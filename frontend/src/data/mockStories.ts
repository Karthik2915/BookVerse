// Comprehensive mock data for the storytelling platform
import { completeBooks } from './completeBooks';

export interface Story {
  id: string;
  title: string;
  author: string;
  authorAvatar?: string;
  genre: string;
  type: "story" | "comic" | "children";
  description: string;
  coverImage: string;
  audioAvailable: boolean;
  likes: number;
  readTime: string;
  views: number;
  rating: number;
  publishedAt: string;
  isLiked: boolean;
  isBookmarked: boolean;
  isTrending?: boolean;
  isNewRelease?: boolean;
  isFeatured?: boolean;
  content: string;
  audioUrl?: string;
  duration?: string;
  tags: string[];
}

// Convert complete books to Story format
const completeBookStories: Story[] = completeBooks.map(book => ({
  id: book.id,
  title: book.title,
  author: book.author,
  authorAvatar: book.authorAvatar,
  genre: book.genre,
  type: "story" as const,
  description: book.description,
  coverImage: book.coverImage,
  audioAvailable: book.hasAudio,
  likes: book.likes,
  readTime: book.readingTime,
  views: book.reads,
  rating: book.rating,
  publishedAt: book.publishedDate,
  isLiked: book.isLiked,
  isBookmarked: book.isBookmarked,
  isTrending: true,
  isNewRelease: true,
  isFeatured: true,
  content: book.content,
  tags: book.tags
}));

export const mockStories: Story[] = [
  // Complete multi-chapter books with rich dialogue for AI voice testing
  ...completeBookStories,
  
  // Fantasy Stories
  {
    id: "1",
    title: "The Crystal Cave Chronicles",
    author: "Sarah Chen",
    authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
    genre: "Fantasy",
    type: "story",
    description: "A young mage discovers ancient secrets hidden within crystal caves that could change the fate of her kingdom forever.",
    coverImage: "https://images.unsplash.com/photo-1711185900806-bf85e7fe7767?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwYm9vayUyMGNvdmVyc3xlbnwxfHx8fDE3NTgzNTc3Njh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    audioAvailable: true,
    audioUrl: "/audio/crystal-cave.mp3",
    duration: "12:30",
    likes: 2847,
    readTime: "8 min read",
    views: 12450,
    rating: 4.7,
    publishedAt: "2024-09-15",
    isLiked: false,
    isBookmarked: false,
    isTrending: true,
    isFeatured: true,
    content: "The morning mist clung to the crystal formations like whispered secrets, each droplet refracting the pale sunlight into a thousand tiny rainbows. Lyra stepped carefully through the cave entrance, her staff glowing with a soft blue light that seemed to respond to the magical energy emanating from the walls...",
    tags: ["magic", "adventure", "crystals", "coming-of-age"]
  },
  {
    id: "2",
    title: "The Dragon's Last Song",
    author: "Marcus Thornfield",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    genre: "Fantasy",
    type: "story",
    description: "When the last dragon falls silent, a bard must journey across realms to restore the ancient melodies that keep magic alive.",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFnb24lMjBmYW50YXN5fGVufDF8fHx8MTc1ODQ0Mzg4M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    audioAvailable: true,
    audioUrl: "/audio/dragon-song.mp3",
    duration: "18:45",
    likes: 1923,
    readTime: "15 min read",
    views: 8934,
    rating: 4.5,
    publishedAt: "2024-09-10",
    isLiked: true,
    isBookmarked: false,
    isTrending: true,
    content: "The silence was deafening. For three thousand years, the Song of Valdris had echoed through the Whispering Peaks, a melody so ancient and powerful that it wove magic itself into the fabric of reality...",
    tags: ["dragons", "music", "quest", "magic"]
  },
  {
    id: "3",
    title: "Shadows of the Moonwell",
    author: "Elena Blackthorn",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    genre: "Fantasy",
    type: "story",
    description: "A cursed village, a mysterious well, and a young woman who must break an ancient spell before the next full moon.",
    coverImage: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb29uJTIwd2VsbCUyMGZhbnRhc3l8ZW58MXx8fHwxNzU4NDQzOTEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    audioAvailable: false,
    likes: 1456,
    readTime: "12 min read",
    views: 6782,
    rating: 4.3,
    publishedAt: "2024-09-08",
    isLiked: false,
    isBookmarked: true,
    content: "The village of Silverbrook had been dying for seven moons. Not in the way villages usually died—with people leaving or crops failing—but truly dying, as if the very essence of life was being drained away...",
    tags: ["curse", "mystery", "village", "moon"]
  },

  // Sci-Fi Stories
  {
    id: "4",
    title: "Digital Dreams",
    author: "Alex Rodriguez",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    genre: "Sci-Fi",
    type: "story",
    description: "In a world where consciousness can be digitized, a programmer must navigate the boundary between reality and virtual existence.",
    coverImage: "https://images.unsplash.com/photo-1629237213606-4d894c8af292?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwZmljdGlvbiUyMGJvb2tzfGVufDF8fHx8MTc1ODM1Nzc2OXww&ixlib=rb-4.1.0&q=80&w=1080",
    audioAvailable: true,
    audioUrl: "/audio/digital-dreams.mp3",
    duration: "15:45",
    likes: 3214,
    readTime: "12 min read",
    views: 15670,
    rating: 4.6,
    publishedAt: "2024-09-20",
    isLiked: true,
    isBookmarked: false,
    isNewRelease: true,
    content: "The upload process was supposed to be painless. That's what they told everyone who signed up for the Digital Consciousness Project...",
    tags: ["ai", "consciousness", "virtual reality", "technology"]
  },
  {
    id: "5",
    title: "The Mars Colony Incident",
    author: "Dr. Priya Sharma",
    authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
    genre: "Sci-Fi",
    type: "story",
    description: "When communication with Mars Colony Seven goes dark, Commander Hayes leads a rescue mission that uncovers a terrifying truth.",
    coverImage: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJzJTIwY29sb255fGVufDF8fHx8MTc1ODQ0NDAyNnww&ixlib=rb-4.1.0&q=80&w=1080",
    audioAvailable: true,
    audioUrl: "/audio/mars-colony.mp3",
    duration: "22:30",
    likes: 2765,
    readTime: "18 min read",
    views: 11203,
    rating: 4.4,
    publishedAt: "2024-09-12",
    isLiked: false,
    isBookmarked: false,
    isTrending: true,
    content: "The last transmission from Mars Colony Seven came at 14:47 UTC on a Tuesday. Three words that would haunt Commander Hayes for the rest of her life: 'They are here.'...",
    tags: ["space", "mars", "aliens", "survival"]
  },

  // Romance Stories
  {
    id: "6",
    title: "Letters from Yesterday",
    author: "Isabella Rose",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    genre: "Romance",
    type: "story",
    description: "When Emma inherits her grandmother's bookshop, she discovers a box of love letters that lead her to an unexpected romance.",
    coverImage: "https://images.unsplash.com/photo-1598618356503-d79f9f19e91c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbmNlJTIwbm92ZWwlMjBjb3ZlcnN8ZW58MXx8fHwxNzU4Mzk5MjQxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    audioAvailable: true,
    audioUrl: "/audio/letters.mp3",
    duration: "16:20",
    likes: 4127,
    readTime: "14 min read",
    views: 18956,
    rating: 4.8,
    publishedAt: "2024-09-18",
    isLiked: false,
    isBookmarked: true,
    isTrending: true,
    content: "The brass key felt cold in Emma's palm as she stood before the dusty bookshop that had belonged to her grandmother for forty years...",
    tags: ["bookshop", "letters", "inheritance", "small town"]
  },
  {
    id: "7",
    title: "The Coffee Shop Equation",
    author: "James Mitchell",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    genre: "Romance",
    type: "story",
    description: "A brilliant mathematician finds that the most complex equation she's ever encountered is love itself.",
    coverImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwcm9tYW5jZXxlbnwxfHx8fDE3NTg0NDQwNjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    audioAvailable: false,
    likes: 1834,
    readTime: "10 min read",
    views: 7432,
    rating: 4.2,
    publishedAt: "2024-09-14",
    isLiked: true,
    isBookmarked: false,
    content: "Dr. Sofia Chen had solved equations that had stumped mathematicians for decades, but she couldn't figure out why her heart raced every time the barista with the crooked smile handed her coffee...",
    tags: ["coffee shop", "mathematician", "equations", "academic"]
  },

  // Mystery Stories
  {
    id: "8",
    title: "The Midnight Gallery",
    author: "Detective Ray Morrison",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    genre: "Mystery",
    type: "story",
    description: "Art pieces are disappearing from galleries across the city, but they're not being stolen—they're vanishing into thin air.",
    coverImage: "https://images.unsplash.com/photo-1698954634383-eba274a1b1c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteXN0ZXJ5JTIwdGhyaWxsZXIlMjBib29rc3xlbnwxfHx8fDE3NTg0NDM1OTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    audioAvailable: true,
    audioUrl: "/audio/midnight-gallery.mp3",
    duration: "19:15",
    likes: 2156,
    readTime: "16 min read",
    views: 9876,
    rating: 4.5,
    publishedAt: "2024-09-16",
    isLiked: false,
    isBookmarked: false,
    content: "The frame was still there, hanging exactly where it should be, but the canvas was blank. Not painted over, not removed—simply blank, as if the artwork had never existed...",
    tags: ["art", "detective", "supernatural", "city"]
  },
  {
    id: "9",
    title: "The Vanishing Room",
    author: "Catherine Blake",
    authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
    genre: "Mystery",
    type: "story",
    description: "In a Victorian mansion, a room appears and disappears according to its own mysterious schedule, hiding dark family secrets.",
    coverImage: "https://images.unsplash.com/photo-1520637836862-4d197d17c90a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWN0b3JpYW4lMjBtYW5zaW9ufGVufDF8fHx8MTc1ODQ0NDEwMnww&ixlib=rb-4.1.0&q=80&w=1080",
    audioAvailable: false,
    likes: 1687,
    readTime: "13 min read",
    views: 6234,
    rating: 4.1,
    publishedAt: "2024-09-11",
    isLiked: false,
    isBookmarked: true,
    content: "The blueprints were clear: twenty-seven rooms on the second floor of Ravenshollow Manor. But Clara had counted twenty-eight doors...",
    tags: ["victorian", "mansion", "family secrets", "paranormal"]
  },

  // Children's Stories
  {
    id: "10",
    title: "The Little Dragon's First Flight",
    author: "Emma Thompson",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    genre: "Children",
    type: "children",
    description: "Join Spark, a young dragon who is afraid of heights, as he learns that bravery comes in many forms.",
    coverImage: "https://images.unsplash.com/photo-1725711028497-baa7469ac4a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGJvb2tzJTIwaWxsdXN0cmF0aW9ufGVufDF8fHx8MTc1ODQ0MzYwMHww&ixlib=rb-4.1.0&q=80&w=1080",
    audioAvailable: true,
    audioUrl: "/audio/little-dragon.mp3",
    duration: "8:20",
    likes: 5432,
    readTime: "5 min read",
    views: 23456,
    rating: 4.9,
    publishedAt: "2024-09-19",
    isLiked: false,
    isBookmarked: true,
    isNewRelease: true,
    content: "Once upon a time, in a cozy cave high up in the Whispering Mountains, lived a little dragon named Spark...",
    tags: ["dragons", "bravery", "friendship", "flying"]
  },
  {
    id: "11",
    title: "The Magic Paintbrush",
    author: "Oliver Green",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    genre: "Children",
    type: "children",
    description: "When Lily finds a special paintbrush in her grandmother's attic, she discovers that everything she paints comes to life!",
    coverImage: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWdpYyUyMHBhaW50YnJ1c2h8ZW58MXx8fHwxNzU4NDQ0MTU1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    audioAvailable: true,
    audioUrl: "/audio/magic-paintbrush.mp3",
    duration: "10:30",
    likes: 3876,
    readTime: "7 min read",
    views: 16789,
    rating: 4.7,
    publishedAt: "2024-09-13",
    isLiked: true,
    isBookmarked: false,
    content: "Lily had always loved to paint, but she never imagined that one dusty paintbrush would change her life forever...",
    tags: ["magic", "art", "grandmother", "creativity"]
  },

  // Horror Stories
  {
    id: "12",
    title: "The Whispering Walls",
    author: "Victor Darkmore",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    genre: "Horror",
    type: "story",
    description: "A renovation project turns into a nightmare when the walls of an old house begin to whisper forgotten secrets.",
    coverImage: "https://images.unsplash.com/photo-1586941962765-e2e7bb6000df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3Jyb3IlMjBob3VzZXxlbnwxfHx8fDE3NTg0NDQxODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    audioAvailable: true,
    audioUrl: "/audio/whispering-walls.mp3",
    duration: "14:45",
    likes: 2341,
    readTime: "11 min read",
    views: 8654,
    rating: 4.3,
    publishedAt: "2024-09-09",
    isLiked: false,
    isBookmarked: false,
    content: "The first whisper came on the third day of demolition. Sarah had been pulling down old wallpaper in the master bedroom when she heard it—a soft, unintelligible murmur that seemed to come from within the walls themselves...",
    tags: ["renovation", "whispers", "haunted house", "secrets"]
  },

  // Adventure Stories
  {
    id: "13",
    title: "The Lost Temple of Zephyria",
    author: "Captain Jake Sullivan",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    genre: "Adventure",
    type: "story",
    description: "An archaeologist races against time and treasure hunters to find an ancient temple that holds the key to a lost civilization.",
    coverImage: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb3N0JTIwdGVtcGxlfGVufDF8fHx8MTc1ODQ0NDIzMXww&ixlib=rb-4.1.0&q=80&w=1080",
    audioAvailable: true,
    audioUrl: "/audio/lost-temple.mp3",
    duration: "21:15",
    likes: 1923,
    readTime: "17 min read",
    views: 7845,
    rating: 4.4,
    publishedAt: "2024-09-07",
    isLiked: false,
    isBookmarked: true,
    content: "Dr. Maya Reeves had spent fifteen years searching for the Temple of Zephyria, following clues carved in ancient stones and whispered in forgotten languages...",
    tags: ["archaeology", "temple", "treasure hunters", "civilization"]
  },

  // Drama Stories
  {
    id: "14",
    title: "The Last Performance",
    author: "Elena Martinez",
    authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
    genre: "Drama",
    type: "story",
    description: "A retired opera singer must choose between her peaceful retirement and one final performance that could save the theater she loves.",
    coverImage: "https://images.unsplash.com/photo-1507924538820-ede94a04019d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcGVyYSUyMHRoZWF0ZXJ8ZW58MXx8fHwxNzU4NDQ0MjY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    audioAvailable: false,
    likes: 1456,
    readTime: "13 min read",
    views: 5678,
    rating: 4.6,
    publishedAt: "2024-09-06",
    isLiked: false,
    isBookmarked: false,
    content: "The letter arrived on a Tuesday morning, carried by a young man in a suit too large for his thin frame. Madame Celeste Moreau, once the most celebrated soprano in all of Europe, read it twice before setting it down with trembling hands...",
    tags: ["opera", "retirement", "theater", "legacy"]
  },

  // Comic/Manga Stories
  {
    id: "15",
    title: "Neon Samurai: Chapter 1",
    author: "Akira Tanaka",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    genre: "Sci-Fi",
    type: "comic",
    description: "In Neo-Tokyo 2145, a ronin with a cybernetic arm fights to protect the innocent from corporate tyranny.",
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwc2FtdXJhaXxlbnwxfHx8fDE3NTg0NDQzMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    audioAvailable: false,
    likes: 3467,
    readTime: "6 min read",
    views: 14567,
    rating: 4.8,
    publishedAt: "2024-09-21",
    isLiked: true,
    isBookmarked: false,
    isNewRelease: true,
    content: "[Comic panels would be displayed here] The rain fell in sheets across the neon-lit streets of Neo-Tokyo, each droplet carrying the weight of a city drowning in its own ambition...",
    tags: ["cyberpunk", "samurai", "neo-tokyo", "corporate"]
  }
];

// Utility functions to filter stories
export const getTrendingStories = () => mockStories.filter(story => story.isTrending);
export const getNewReleases = () => mockStories.filter(story => story.isNewRelease);
export const getFeaturedStory = () => mockStories.find(story => story.isFeatured);
export const getStoriesByGenre = (genre: string) => mockStories.filter(story => story.genre === genre);
export const getTopRatedStories = () => mockStories.sort((a, b) => b.rating - a.rating).slice(0, 10);
export const getMostLikedStories = () => mockStories.sort((a, b) => b.likes - a.likes).slice(0, 10);
export const getAudioAvailableStories = () => mockStories.filter(story => story.audioAvailable);

export const genres = [
  "Fantasy", "Sci-Fi", "Romance", "Mystery", "Horror", 
  "Adventure", "Drama", "Children", "Comedy", "Biography"
];