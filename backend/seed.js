const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
require('dotenv').config();

// --- Database Configuration ---
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  multipleStatements: true
};

// --- Data Parsing Functions ---
async function parseTsFile(filePath, arrayName) {
  try {
    let fileContent = await fs.readFile(filePath, 'utf-8');

    // Use a non-greedy regex to find the array, stopping at the first `];`
    const arrayRegex = new RegExp(`export const ${arrayName}.*?=\\s*(\\[[\\s\\S]*?\\]);`);
    const match = fileContent.match(arrayRegex);

    if (!match || !match[1]) {
      console.error(`Could not find array named "${arrayName}" in ${filePath}`);
      return [];
    }

    let arrayString = match[1];

    // This is a simplified transformation and is brittle.
    // It relies on the specific format of the mock data files.
    const evaluated = new Function(`
      const completeBooks = []; // Mock dependency for evaluation context
      const completeBookStories = []; // Mock dependency for evaluation context
      return ${arrayString};
    `)();
    
    return evaluated;
  } catch (err) {
    console.error(`Error reading or parsing file ${filePath}:`, err);
    return [];
  }
}

function parseChapters(content) {
  if (!content) return [];
  const chapters = [];
  // Corrected Regex to handle "The End" and varying chapter titles
  const chapterRegex = /Chapter\\s+(\\d+):([\\s\\S]*?)(?=Chapter\\s+\\d+:|The End|$)/g;
  let match;
  while ((match = chapterRegex.exec(content)) !== null) {
    const chapterNumber = parseInt(match[1], 10);
    const rawContent = match[2].trim();
    // The title is the first line of the content
    const title = rawContent.split('\\n')[0].trim();
    chapters.push({ chapterNumber, title, content: rawContent });
  }
  return chapters;
}


// --- Seeding Logic ---

async function seed() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database.');

    console.log('Clearing existing data...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
    await connection.query('TRUNCATE TABLE \`chapters\`;');
    await connection.query('TRUNCATE TABLE \`story_stats\`;');
    await connection.query('TRUNCATE TABLE \`stories\`;');
    await connection.query('TRUNCATE TABLE \`users\`;');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('Tables cleared.');

    console.log('Parsing mock data files...');
    const completeBooks = await parseTsFile('frontend/src/data/completeBooks.ts', 'completeBooks');
    const mockStories = await parseTsFile('frontend/src/data/mockStories.ts', 'mockStories');

    if (!completeBooks.length && !mockStories.length) {
      console.error('No data parsed. Aborting seed.');
      return;
    }
    console.log(`Parsed ${completeBooks.length} complete books and ${mockStories.length} mock stories.`);


    console.log('Creating users...');
    const authors = new Map();
    const allStories = [...completeBooks, ...mockStories];

    for (const story of allStories) {
        if (story.author && !authors.has(story.author)) {
            const authorId = uuidv4();
            const username = story.author.toLowerCase().replace(/[^a-z0-9]/g, '');
            authors.set(story.author, {
                id: authorId,
                name: story.author,
                username: `${username}${authors.size}`, // Ensure uniqueness
                email: `${username}${authors.size}@storyverse.demo`,
                password: 'password123', // Demo password
                avatar: story.authorAvatar || `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(story.author)}`,
            });
        }
    }

    for (const author of authors.values()) {
      await connection.execute(
        'INSERT INTO \`users\` (id, name, username, email, password, avatar) VALUES (?, ?, ?, ?, ?, ?)',
        [author.id, author.name, author.username, author.email, author.password, author.avatar]
      );
    }
    console.log(`Inserted ${authors.size} users.`);

    console.log('Seeding stories and chapters...');
    const seededStoryIds = new Set();

    for (const book of completeBooks) {
        const author = authors.get(book.author);
        if (!author || seededStoryIds.has(book.id)) continue;

        const storyId = book.id || uuidv4();
        await connection.execute(
            'INSERT INTO \`stories\` (id, title, authorId, genre, type, description, coverImage, isPublished, language) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [storyId, book.title, author.id, book.genre, 'multi-chapter', book.description, book.coverImage, true, 'en']
        );
        seededStoryIds.add(storyId);

        await connection.execute(
            'INSERT INTO \`story_stats\` (storyId, views, likes, rating) VALUES (?, ?, ?, ?)',
            [storyId, book.reads || 0, book.likes || 0, book.rating || 0]
        );

        const chapters = parseChapters(book.content);
        for (const chapter of chapters) {
            await connection.execute(
            'INSERT INTO \`chapters\` (id, storyId, chapterNumber, title, content, readTime) VALUES (?, ?, ?, ?, ?, ?)',
            [uuidv4(), storyId, chapter.chapterNumber, chapter.title, chapter.content, `${Math.ceil(chapter.content.split(' ').length / 200)} min read`]
            );
        }
    }

    for (const story of mockStories) {
        const author = authors.get(story.author);
        if (!author || seededStoryIds.has(story.id)) continue;

        const storyId = story.id || uuidv4();
        await connection.execute(
            'INSERT INTO \`stories\` (id, title, authorId, genre, type, description, coverImage, isPublished, language) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [storyId, story.title, author.id, story.genre, 'short-story', story.description, story.coverImage, true, 'en']
        );
        seededStoryIds.add(storyId);
        
        await connection.execute(
            'INSERT INTO \`story_stats\` (storyId, views, likes, rating) VALUES (?, ?, ?, ?)',
            [storyId, story.views || 0, story.likes || 0, story.rating || 0]
        );

        await connection.execute(
            'INSERT INTO \`chapters\` (id, storyId, chapterNumber, title, content, readTime, audioUrl, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [uuidv4(), storyId, 1, story.title, story.content, story.readTime, story.audioUrl, story.duration]
        );
    }
    console.log(`Seeded ${seededStoryIds.size} unique stories.`);

    console.log('Database seeding completed successfully!');

  } catch (error) {
    console.error('Failed to seed database:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('MySQL connection closed.');
    }
  }
}

seed();
