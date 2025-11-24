
import { mockUserStories, UserStory } from "../data/userStories";

// Simulate a database
let stories: UserStory[] = mockUserStories;

const db = {
  getUserStories: async (userId: string): Promise<{ success: boolean; data: UserStory[] }> => {
    console.log(`Fetching stories for user: ${userId}`);
    // In a real app, you would fetch stories from a database based on userId
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return { success: true, data: stories };
  },

  createStory: async (storyData: Partial<UserStory>): Promise<{ success: boolean; data: UserStory }> => {
    console.log("Creating new story:", storyData);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newStory: UserStory = {
      id: `user-story-${Date.now()}`,
      title: storyData.title || "Untitled Story",
      description: storyData.description || "",
      genre: storyData.genre || "Fantasy",
      coverImage: storyData.coverImage || "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
      chapters: [],
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublished: false,
      tags: storyData.tags || [],
      status: "draft",
      ...(storyData as any)
    };
    
    stories.unshift(newStory); // Add to the beginning of the array
    return { success: true, data: newStory };
  },

  updateStory: async (storyId: string, storyData: Partial<UserStory>): Promise<{ success: boolean; data: UserStory | null }> => {
    console.log(`Updating story ${storyId}:`, storyData);
    await new Promise(resolve => setTimeout(resolve, 500));

    const storyIndex = stories.findIndex(s => s.id === storyId);
    if (storyIndex > -1) {
      stories[storyIndex] = { ...stories[storyIndex], ...storyData, updatedAt: new Date() };
      return { success: true, data: stories[storyIndex] };
    }
    return { success: false, data: null };
  },

  deleteStory: async (storyId: string): Promise<{ success: boolean }> => {
    console.log(`Deleting story ${storyId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const initialLength = stories.length;
    stories = stories.filter(s => s.id !== storyId);
    
    return { success: stories.length < initialLength };
  },
};

export const apiService = {
  db,
  // You can add other services like authentication, storage, etc.
  // auth: { ... },
  // storage: { ... }
};
