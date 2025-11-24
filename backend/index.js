const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./database');
const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 3002; // Changed port to 3002

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

// Corrected endpoint to get all stories (now called books for frontend compatibility)
app.get('/api/books', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        s.id, 
        s.title, 
        u.name as authorName, 
        u.avatar as authorAvatar,
        s.description,
        s.coverImage,
        s.genre,
        s.type,
        ss.views,
        ss.likes,
        ss.rating,
        GROUP_CONCAT(c.content ORDER BY c.chapterNumber ASC SEPARATOR '\n\n') as content
      FROM stories s
      JOIN users u ON s.authorId = u.id
      JOIN story_stats ss ON s.id = ss.storyId
      LEFT JOIN chapters c ON s.id = c.storyId
      WHERE s.isPublished = true
      GROUP BY s.id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Corrected endpoint to get a single story by ID
app.get('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [storyRows] = await pool.query(`
      SELECT 
        s.*, 
        u.name as authorName, 
        u.avatar as authorAvatar,
        ss.views, 
        ss.likes, 
        ss.rating
      FROM stories s
      JOIN users u ON s.authorId = u.id
      JOIN story_stats ss ON s.id = ss.storyId
      WHERE s.id = ?
    `, [id]);

    if (storyRows.length === 0) {
      return res.status(404).json({ error: 'Story not found' });
    }

    const [chapterRows] = await pool.query(
      'SELECT content FROM chapters WHERE storyId = ? ORDER BY chapterNumber ASC',
      [id]
    );

    const story = storyRows[0];
    story.content = chapterRows.map(c => c.content).join('\n\n');

    res.json(story);
  } catch (error) {
    console.error(`Error fetching book ${id}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
