
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { 
  PlusCircle, 
  Eye, 
  Heart, 
  MessageCircle, 
  Edit3, 
  Trash2,
  BarChart3,
  BookOpen,
  FileText,
  Clock,
  TrendingUp,
  Users,
  Target,
  ArrowLeft,
  Search,
  Play
} from "lucide-react";
import { mockUserStories, getStoryStats, UserStory, Chapter } from "../data/userStories";
import { apiService } from "../services/api";
import { StoryEditor } from "./StoryEditor";
import { ChapterEditor } from "./ChapterEditor";
import { StoryAnalytics } from "./StoryAnalytics";

interface MyStoriesProps {
  user: any;
  onBack: () => void;
  onReadStory: (storyId: string) => void;
  onListenStory: (storyId: string) => void;
}

// Helper function to get default cover image based on genre
function getDefaultCoverImage(genre: string): string {
  const coverImages = {
    'Fantasy': 'https://images.unsplash.com/photo-1699369398947-f3779c75bbf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwYm9vayUyMGNvdmVyJTIwbXlzdGljYWx8ZW58MXx8fHwxNzU5NTY4NjI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'Sci-Fi': 'https://images.unsplash.com/photo-1614193471837-27a61f4ccc8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwZmljdGlvbiUyMGJvb2slMjBjb3ZlcnxlbnwxfHx8fDE3NTk1MDI3NDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'Children': 'https://images.unsplash.com/photo-1720160644902-d447e3313b95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHN0b3J5JTIwYm9va3xlbnwxfHx8fDE3NTk1Njg2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'Romance': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    'Mystery': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    'Horror': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    'Adventure': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    'Drama': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    'Comedy': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    'Biography': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'
  };
  
  return coverImages[genre as keyof typeof coverImages] || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400';
}

export function MyStories({ user, onBack, onReadStory, onListenStory }: MyStoriesProps) {
  const [stories, setStories] = useState<UserStory[]>(mockUserStories);
  const [filteredStories, setFilteredStories] = useState<UserStory[]>(mockUserStories);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState<"dashboard" | "edit-story" | "edit-chapter" | "analytics">("dashboard");
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user stories on component mount
  useEffect(() => {
    const loadUserStories = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const result = await apiService.db.getUserStories(user.id);
        if (result.success) {
          // Convert API stories to UserStory format
          const convertedStories = result.data.map((story: any) => ({
            id: story.id,
            title: story.title,
            description: story.description,
            genre: story.genre,
            coverImage: story.cover_image || story.coverImage || getDefaultCoverImage(story.genre),
            chapters: [], // Chapters would be loaded separately in a real app
            totalViews: story.views || 0,
            totalLikes: story.likes || 0,
            totalComments: story.comments || 0,
            createdAt: new Date(story.created_at || story.publishedAt),
            updatedAt: new Date(story.updated_at || story.publishedAt),
            isPublished: story.status === 'published',
            tags: story.tags || [],
            status: story.status || 'draft'
          }));
          setStories(convertedStories);
        } else {
          // Use mock data as fallback
          setStories(mockUserStories);
        }
      } catch (error) {
        console.error("Error loading user stories:", error);
        setStories(mockUserStories);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserStories();
  }, [user?.id]);

  // Filter stories based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStories(stories);
    } else {
      const filtered = stories.filter(story => 
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredStories(filtered);
    }
  }, [stories, searchQuery]);

  const totalStats = {
    totalStories: stories.length,
    publishedStories: stories.filter(s => s.isPublished).length,
    totalViews: stories.reduce((sum, story) => sum + story.totalViews, 0),
    totalLikes: stories.reduce((sum, story) => sum + story.totalLikes, 0),
    totalComments: stories.reduce((sum, story) => sum + story.totalComments, 0),
    totalChapters: stories.reduce((sum, story) => sum + story.chapters.length, 0)
  };

  const handleCreateStory = () => {
    setSelectedStory(null);
    setCurrentView("edit-story");
  };

  const handleEditStory = (story: UserStory) => {
    setSelectedStory(story);
    setCurrentView("edit-story");
  };

  const handleEditChapter = (story: UserStory, chapter: Chapter) => {
    setSelectedStory(story);
    setSelectedChapter(chapter);
    setCurrentView("edit-chapter");
  };

  const handleCreateChapter = (story: UserStory) => {
    setSelectedStory(story);
    setSelectedChapter(null);
    setCurrentView("edit-chapter");
  };

  const handleViewAnalytics = (story: UserStory) => {
    setSelectedStory(story);
    setCurrentView("analytics");
  };

  const handleSaveStory = async (storyData: Partial<UserStory>) => {
    if (selectedStory) {
      // Update existing story
      try {
        const result = await apiService.db.updateStory(selectedStory.id, storyData);
        if (result.success) {
          setStories(prev => prev.map(s => 
            s.id === selectedStory.id 
              ? { ...s, ...storyData, updatedAt: new Date() }
              : s
          ));
        } else {
          // Fallback to local update
          setStories(prev => prev.map(s => 
            s.id === selectedStory.id 
              ? { ...s, ...storyData, updatedAt: new Date() }
              : s
          ));
        }
      } catch (error) {
        console.error("Error updating story:", error);
        // Fallback to local update
        setStories(prev => prev.map(s => 
          s.id === selectedStory.id 
            ? { ...s, ...storyData, updatedAt: new Date() }
            : s
        ));
      }
    } else {
      // Create new story
      try {
        const newStoryData = {
          ...storyData,
          authorId: user?.id,
          author: user?.name || "Anonymous"
        };
        
        const result = await apiService.db.createStory(newStoryData);
        if (result.success) {
          const newStory: UserStory = {
            id: result.data.id,
            title: storyData.title || "Untitled Story",
            description: storyData.description || "",
            genre: storyData.genre || "Fantasy",
            coverImage: storyData.coverImage || getDefaultCoverImage(storyData.genre || "Fantasy"),
            chapters: [],
            totalViews: 0,
            totalLikes: 0,
            totalComments: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            isPublished: false,
            tags: storyData.tags || [],
            status: "draft"
          };
          setStories(prev => [newStory, ...prev]);
        } else {
          // Fallback to local creation
          const newStory: UserStory = {
            id: `user-story-${Date.now()}`,
            title: storyData.title || "Untitled Story",
            description: storyData.description || "",
            genre: storyData.genre || "Fantasy",
            coverImage: storyData.coverImage || getDefaultCoverImage(storyData.genre || "Fantasy"),
            chapters: [],
            totalViews: 0,
            totalLikes: 0,
            totalComments: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            isPublished: false,
            tags: storyData.tags || [],
            status: "draft"
          };
          setStories(prev => [newStory, ...prev]);
        }
      } catch (error) {
        console.error("Error creating story:", error);
        // Fallback to local creation
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
          status: "draft"
        };
        setStories(prev => [newStory, ...prev]);
      }
    }
    setCurrentView("dashboard");
  };

  const handleSaveChapter = (chapterData: Partial<Chapter>) => {
    if (!selectedStory) return;

    setStories(prev => prev.map(story => {
      if (story.id !== selectedStory.id) return story;

      let updatedChapters;
      if (selectedChapter) {
        // Update existing chapter
        updatedChapters = story.chapters.map(chapter =>
          chapter.id === selectedChapter.id
            ? { ...chapter, ...chapterData, updatedAt: new Date() }
            : chapter
        );
      } else {
        // Create new chapter
        const newChapter: Chapter = {
          id: `chapter-${story.id}-${Date.now()}`,
          title: chapterData.title || "Untitled Chapter",
          content: chapterData.content || "",
          wordCount: chapterData.content?.split(/\s+/).length || 0,
          publishedAt: new Date(),
          views: 0,
          likes: 0,
          comments: 0,
          isPublished: chapterData.isPublished || false
        };
        updatedChapters = [...story.chapters, newChapter];
      }

      return {
        ...story,
        chapters: updatedChapters,
        updatedAt: new Date()
      };
    }));

    setCurrentView("dashboard");
  };

  const handleDeleteStory = async (storyId: string) => {
    if (confirm("Are you sure you want to delete this story? This action cannot be undone.")) {
      try {
        const result = await apiService.db.deleteStory(storyId);
        if (result.success) {
          setStories(prev => prev.filter(s => s.id !== storyId));
        } else {
          // Fallback to local deletion
          setStories(prev => prev.filter(s => s.id !== storyId));
        }
      } catch (error) {
        console.error("Error deleting story:", error);
        // Fallback to local deletion
        setStories(prev => prev.filter(s => s.id !== storyId));
      }
    }
  };

  if (currentView === "edit-story") {
    return (
      <StoryEditor
        story={selectedStory}
        onSave={handleSaveStory}
        onCancel={() => setCurrentView("dashboard")}
      />
    );
  }

  if (currentView === "edit-chapter") {
    return (
      <ChapterEditor
        story={selectedStory!}
        chapter={selectedChapter}
        onSave={handleSaveChapter}
        onCancel={() => setCurrentView("dashboard")}
      />
    );
  }

  if (currentView === "analytics" && selectedStory) {
    return (
      <StoryAnalytics
        story={selectedStory}
        onBack={() => setCurrentView("dashboard")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* My Stories Navbar */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-medium">My Stories</h1>
                <p className="text-sm text-muted-foreground">Manage your stories, chapters, and track performance</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search your stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleCreateStory} className="gap-2">
                <PlusCircle className="w-4 h-4" />
                New Story
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Stories</p>
                    <p className="text-2xl font-medium">{totalStats.totalStories}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Published</p>
                    <p className="text-2xl font-medium">{totalStats.publishedStories}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                    <p className="text-2xl font-medium">{totalStats.totalViews.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Likes</p>
                    <p className="text-2xl font-medium">{totalStats.totalLikes.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Comments</p>
                    <p className="text-2xl font-medium">{totalStats.totalComments.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Chapters</p>
                    <p className="text-2xl font-medium">{totalStats.totalChapters}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stories List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">
                {searchQuery ? `Search Results (${filteredStories.length})` : 'Your Stories'}
              </h2>
              {searchQuery && (
                <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              )}
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <BookOpen className="w-8 h-8 text-primary mx-auto animate-pulse" />
                  <p className="text-muted-foreground">Loading your stories...</p>
                </div>
              </div>
            ) : filteredStories.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {searchQuery ? 'No stories found' : 'No stories yet'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery 
                      ? 'Try adjusting your search terms or create a new story.'
                      : 'Start your storytelling journey by creating your first story.'
                    }
                  </p>
                  <Button onClick={handleCreateStory} className="gap-2">
                    <PlusCircle className="w-4 h-4" />
                    {searchQuery ? 'Create New Story' : 'Create Your First Story'}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredStories.map((story) => {
                  const stats = getStoryStats(story);
                  
                  return (
                    <Card key={story.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          {/* Cover Image */}
                          <div className="w-20 h-28 bg-muted rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={story.coverImage} 
                              alt={story.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Story Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-medium truncate">{story.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                  {story.description}
                                </p>
                                
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                  <Badge variant="outline">{story.genre}</Badge>
                                  <Badge variant={story.status === 'published' ? 'default' : 'secondary'}>
                                    {story.status}
                                  </Badge>
                                  <span>{stats.totalChapters} chapters</span>
                                  <span>{stats.totalWordCount.toLocaleString()} words</span>
                                </div>

                                <div className="flex items-center gap-6 text-sm">
                                  <div className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    <span>{story.totalViews.toLocaleString()}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Heart className="w-4 h-4" />
                                    <span>{story.totalLikes.toLocaleString()}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MessageCircle className="w-4 h-4" />
                                    <span>{story.totalComments.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2 ml-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onReadStory(story.id)}
                                  className="gap-1"
                                >
                                  <BookOpen className="w-4 h-4" />
                                  Read
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onListenStory(story.id)}
                                  className="gap-1"
                                >
                                  <Play className="w-4 h-4" />
                                  Listen
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewAnalytics(story)}
                                  className="gap-1"
                                >
                                  <BarChart3 className="w-4 h-4" />
                                  Analytics
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditStory(story)}
                                  className="gap-1"
                                >
                                  <Edit3 className="w-4 h-4" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCreateChapter(story)}
                                  className="gap-1"
                                >
                                  <PlusCircle className="w-4 h-4" />
                                  Chapter
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteStory(story.id)}
                                  className="gap-1 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Chapters */}
                            {story.chapters.length > 0 && (
                              <div className="mt-4 pt-4 border-t">
                                <h4 className="text-sm font-medium mb-2">Chapters</h4>
                                <div className="space-y-1">
                                  {story.chapters.slice(0, 3).map((chapter, index) => (
                                    <div key={chapter.id} className="flex items-center justify-between text-sm">
                                      <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">Ch. {index + 1}</span>
                                        <span className="truncate">{chapter.title}</span>
                                        {!chapter.isPublished && (
                                          <Badge variant="secondary" className="text-xs">Draft</Badge>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-3 text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                          <Eye className="w-3 h-3" />
                                          <span>{chapter.views}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Heart className="w-3 h-3" />
                                          <span>{chapter.likes}</span>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleEditChapter(story, chapter)}
                                          className="h-6 px-2"
                                        >
                                          <Edit3 className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                  {story.chapters.length > 3 && (
                                    <p className="text-xs text-muted-foreground">
                                      +{story.chapters.length - 3} more chapters
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
