export interface Chapter {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  publishedAt: Date;
  views: number;
  likes: number;
  comments: number;
  isPublished: boolean;
}

export interface UserStory {
  id: string;
  title: string;
  description: string;
  genre: string;
  coverImage: string;
  chapters: Chapter[];
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  tags: string[];
  status: 'draft' | 'published' | 'completed';
}

export interface StoryAnalytics {
  storyId: string;
  dailyViews: { date: string; views: number }[];
  weeklyViews: { week: string; views: number }[];
  monthlyViews: { month: string; views: number }[];
  readerDemographics: {
    ageGroups: { range: string; percentage: number }[];
    countries: { country: string; percentage: number }[];
    devices: { device: string; percentage: number }[];
  };
  engagement: {
    averageReadingTime: number;
    completionRate: number;
    bookmarkRate: number;
    shareRate: number;
  };
}

// Mock user stories
export const mockUserStories: UserStory[] = [
  {
    id: "user-story-1",
    title: "The Digital Realm",
    description: "A thrilling adventure through cyberspace where reality and virtual worlds collide.",
    genre: "Sci-Fi",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400",
    totalViews: 12450,
    totalLikes: 892,
    totalComments: 156,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-09-20"),
    isPublished: true,
    tags: ["sci-fi", "cyberpunk", "adventure", "technology"],
    status: "published",
    chapters: [
      {
        id: "chapter-1-1",
        title: "The Awakening",
        content: "In the year 2157, Maya Chen stared at the holographic display floating before her...",
        wordCount: 2847,
        publishedAt: new Date("2024-01-20"),
        views: 3420,
        likes: 245,
        comments: 42,
        isPublished: true
      },
      {
        id: "chapter-1-2", 
        title: "Into the Grid",
        content: "The neural interface hummed to life as Maya's consciousness began to merge with the digital realm...",
        wordCount: 3156,
        publishedAt: new Date("2024-02-05"),
        views: 2890,
        likes: 198,
        comments: 38,
        isPublished: true
      },
      {
        id: "chapter-1-3",
        title: "The Guardian Protocol",
        content: "Deep within the data streams, something ancient stirred...",
        wordCount: 2654,
        publishedAt: new Date("2024-02-20"),
        views: 2340,
        likes: 167,
        comments: 29,
        isPublished: true
      },
      {
        id: "chapter-1-4",
        title: "Digital Shadows",
        content: "Maya's avatar glitched as she encountered the first Guardian...",
        wordCount: 0,
        publishedAt: new Date(),
        views: 0,
        likes: 0,
        comments: 0,
        isPublished: false
      }
    ]
  },
  {
    id: "user-story-2",
    title: "Moonlight Chronicles",
    description: "A romantic fantasy about a werewolf pack and their human allies in modern-day Seattle.",
    genre: "Romance",
    coverImage: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=400",
    totalViews: 8967,
    totalLikes: 654,
    totalComments: 98,
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-09-15"),
    isPublished: true,
    tags: ["romance", "werewolf", "urban-fantasy", "seattle"],
    status: "published",
    chapters: [
      {
        id: "chapter-2-1",
        title: "Full Moon Rising",
        content: "Aria never believed in werewolves until she witnessed the transformation...",
        wordCount: 2234,
        publishedAt: new Date("2024-03-15"),
        views: 2890,
        likes: 234,
        comments: 31,
        isPublished: true
      },
      {
        id: "chapter-2-2",
        title: "The Pack's Secret",
        content: "The Alpha's eyes held secrets darker than the Seattle rain...",
        wordCount: 2678,
        publishedAt: new Date("2024-04-01"),
        views: 2456,
        likes: 198,
        comments: 28,
        isPublished: true
      },
      {
        id: "chapter-2-3",
        title: "Blood Moon Prophecy",
        content: "Ancient prophecies speak of a human who would unite the packs...",
        wordCount: 0,
        publishedAt: new Date(),
        views: 0,
        likes: 0,
        comments: 0,
        isPublished: false
      }
    ]
  },
  {
    id: "user-story-3",
    title: "The Mystery of Blackwood Manor",
    description: "A detective thriller set in Victorian England with supernatural elements.",
    genre: "Mystery",
    coverImage: "https://images.unsplash.com/photo-1520637836862-4d197d17c13a?w=400",
    totalViews: 5432,
    totalLikes: 378,
    totalComments: 67,
    createdAt: new Date("2024-06-05"),
    updatedAt: new Date("2024-09-10"),
    isPublished: false,
    tags: ["mystery", "victorian", "supernatural", "detective"],
    status: "draft",
    chapters: [
      {
        id: "chapter-3-1",
        title: "The Blackwood Invitation",
        content: "Inspector Hartwell received the mysterious letter on a foggy London morning...",
        wordCount: 1876,
        publishedAt: new Date(),
        views: 0,
        likes: 0,
        comments: 0,
        isPublished: false
      }
    ]
  }
];

// Mock analytics data
export const mockAnalytics: Record<string, StoryAnalytics> = {
  "user-story-1": {
    storyId: "user-story-1",
    dailyViews: [
      { date: "2024-09-20", views: 145 },
      { date: "2024-09-21", views: 167 },
      { date: "2024-09-22", views: 189 },
      { date: "2024-09-23", views: 234 },
      { date: "2024-09-24", views: 198 },
      { date: "2024-09-25", views: 156 },
      { date: "2024-09-26", views: 223 }
    ],
    weeklyViews: [
      { week: "Week 1", views: 1234 },
      { week: "Week 2", views: 1456 },
      { week: "Week 3", views: 1678 },
      { week: "Week 4", views: 1345 }
    ],
    monthlyViews: [
      { month: "Jan", views: 2341 },
      { month: "Feb", views: 2789 },
      { month: "Mar", views: 3234 },
      { month: "Apr", views: 2987 },
      { month: "May", views: 3456 },
      { month: "Jun", views: 3789 },
      { month: "Jul", views: 4123 },
      { month: "Aug", views: 3890 },
      { month: "Sep", views: 4234 }
    ],
    readerDemographics: {
      ageGroups: [
        { range: "18-24", percentage: 35 },
        { range: "25-34", percentage: 42 },
        { range: "35-44", percentage: 18 },
        { range: "45+", percentage: 5 }
      ],
      countries: [
        { country: "United States", percentage: 45 },
        { country: "United Kingdom", percentage: 22 },
        { country: "Canada", percentage: 15 },
        { country: "Australia", percentage: 10 },
        { country: "Others", percentage: 8 }
      ],
      devices: [
        { device: "Mobile", percentage: 65 },
        { device: "Desktop", percentage: 28 },
        { device: "Tablet", percentage: 7 }
      ]
    },
    engagement: {
      averageReadingTime: 8.5, // minutes
      completionRate: 78, // percentage
      bookmarkRate: 12, // percentage
      shareRate: 5 // percentage
    }
  }
};

// Helper functions for story management
export const createNewStory = (): Partial<UserStory> => ({
  id: `user-story-${Date.now()}`,
  title: "",
  description: "",
  genre: "Fantasy",
  coverImage: "",
  chapters: [],
  totalViews: 0,
  totalLikes: 0,
  totalComments: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  isPublished: false,
  tags: [],
  status: "draft"
});

export const createNewChapter = (storyId: string): Chapter => ({
  id: `chapter-${storyId}-${Date.now()}`,
  title: "",
  content: "",
  wordCount: 0,
  publishedAt: new Date(),
  views: 0,
  likes: 0,
  comments: 0,
  isPublished: false
});

export const getStoryStats = (story: UserStory) => ({
  totalChapters: story.chapters.length,
  publishedChapters: story.chapters.filter(c => c.isPublished).length,
  draftChapters: story.chapters.filter(c => !c.isPublished).length,
  totalWordCount: story.chapters.reduce((sum, chapter) => sum + chapter.wordCount, 0),
  averageViews: story.totalViews / Math.max(story.chapters.filter(c => c.isPublished).length, 1),
  engagementRate: ((story.totalLikes + story.totalComments) / Math.max(story.totalViews, 1)) * 100
});