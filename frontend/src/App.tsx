import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { Navbar } from "./components/Navbar";
import { StorySlider } from "./components/StorySlider";
import { TrendingSection } from "./components/TrendingSection";
import { HeroSection } from "./components/HeroSection";
import { StoryReader } from "./components/StoryReader";
import { PublishStory } from "./components/PublishStory";
import { GenreLoadingScreen } from "./components/GenreLoadingScreen";
import { GenrePage } from "./components/GenrePage";
import { MyStories } from "./components/MyStories";
import { Login } from "./components/Login";
import { SignUp } from "./components/SignUp";
import { AIAssistant } from "./components/AIAssistant";
import { SubscriptionPage } from "./components/SubscriptionPage";
import { PaymentPanel } from "./components/PaymentPanel";
import { completeBooks, getCompleteBooksByLanguage } from "./data/completeBooks"; // Import getCompleteBooksByLanguage

const API_URL = 'http://localhost:3001/api';

export default function App() {
  const [currentView, setCurrentView] = useState<"home" | "read" | "publish" | "library" | "genre" | "my-stories" | "login" | "signup" | "subscription" | "payment-panel">("home");
  const [currentStory, setCurrentStory] = useState<any>(null);
  const [audioModeRequested, setAudioModeRequested] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [stories, setStories] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showGenreLoading, setShowGenreLoading] = useState(false);
  const [pendingGenre, setPendingGenre] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    const demoUser = {
      id: "demo-user-1",
      name: "Demo User",
      email: "demo@storyverse.com",
      username: "demouser",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&auto=format&fit=crop&crop=face"
    };
    setUser(demoUser);
    setIsAuthenticated(true);
    setStories(getCompleteBooksByLanguage(selectedLanguage)); // Load stories by language
  }, [selectedLanguage]);

  const handleReadStory = (storyId: string) => {
    const story = completeBooks.find(book => book.id === storyId);
    if (story) {
      setCurrentStory(story);
      setAudioModeRequested(false);
      setCurrentView("read");
    }
  };

  const handleListenStory = (storyId: string) => {
    const story = completeBooks.find(book => book.id === storyId);
    if (story) {
      setCurrentStory(story);
      setAudioModeRequested(true);
      setCurrentView("read");
    }
  };

  const handlePublishStory = async (newStory: any) => {
    if (!isAuthenticated || !user) {
      setCurrentView("login");
      return;
    }

    const storyWithUser = { ...newStory, author: user.name, authorId: user.id, authorAvatar: user.avatar };

    try {
      const response = await fetch(`${API_URL}/stories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storyWithUser),
      });
      const publishedStory = await response.json();
      setStories(prev => [publishedStory, ...prev]);
      setCurrentView("my-stories");
    } catch (error) {
      console.error('Failed to publish story:', error);
    }
  };

  const handleGenreSelect = (genre: string) => {
    if (genre === "My Profile" || genre === selectedGenre) {
      setCurrentView("genre");
      setSelectedGenre(genre);
      return;
    }
    setPendingGenre(genre);
    setShowGenreLoading(true);
  };

  const handleGenreLoadingComplete = () => {
    setShowGenreLoading(false);
    setSelectedGenre(pendingGenre);
    setCurrentView("genre");
    setPendingGenre("");
  };

  const handleBackToHome = () => {
    setCurrentView("home");
    setSelectedGenre("All");
  };

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentView("home");
  };

  const handleSignupSuccess = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentView("home");
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView("home");
  };

  if (currentView === "login") return <Login onBack={() => setCurrentView("home")} onLoginSuccess={handleLoginSuccess} onSwitchToSignup={() => setCurrentView("signup")} />;
  if (currentView === "signup") return <SignUp onBack={() => setCurrentView("home")} onSignupSuccess={handleSignupSuccess} onSwitchToLogin={() => setCurrentView("login")} />;
  if (showGenreLoading) return <GenreLoadingScreen genre={pendingGenre} onLoadingComplete={handleGenreLoadingComplete} />;
  if (currentView === "read" && currentStory) return <StoryReader story={currentStory} startInAudioMode={audioModeRequested} onBack={() => { setCurrentView("home"); setCurrentStory(null); setAudioModeRequested(false); }} />;
  if (currentView === "publish") {
    if (!isAuthenticated) { setCurrentView("login"); return null; }
    return <PublishStory user={user} onBack={() => setCurrentView("home")} onPublish={handlePublishStory} selectedLanguage={selectedLanguage} />;
  }
  if (currentView === "genre") return <GenrePage genre={selectedGenre} onBack={handleBackToHome} onReadStory={handleReadStory} onListenStory={handleListenStory} stories={stories} />;
  if (currentView === "my-stories") {
    if (!isAuthenticated) { setCurrentView("login"); return null; }
    const userStories = stories.filter((s: any) => s.authorId === user.id);
    return <MyStories user={user} onBack={() => setCurrentView("home")} stories={userStories} />;
  }
  if (currentView === "subscription") return <SubscriptionPage />;
  if (currentView === "payment-panel") return <PaymentPanel />;

  const trendingStories = stories.filter((story: any) => story.isTrending);
  const newReleases = stories.filter((story: any) => story.isNewRelease);
  const topRatedStories = [...stories].sort((a: any, b: any) => b.rating - a.rating).slice(0, 10);
  const audioStories = stories.filter((story: any) => story.hasAudio);
  const getStoriesByGenre = (genre: string) => stories.filter((story: any) => story.genre === genre);

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} isAuthenticated={isAuthenticated} currentView={currentView} selectedGenre={selectedGenre} searchQuery={searchQuery} onViewChange={setCurrentView} onGenreSelect={handleGenreSelect} onSearchChange={setSearchQuery} onLogout={handleLogout} selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />
      {isAuthenticated && user && <AIAssistant user={user} onReadStory={handleReadStory} onListenStory={handleListenStory} />}
      <div className="w-full">
        <div className="container mx-auto px-4 py-8 max-w-7xl overflow-x-hidden">
          {currentView === "home" && (
            <>
              <HeroSection onReadStory={handleReadStory} onListenStory={handleListenStory} />
              <TrendingSection stories={trendingStories} onReadStory={handleReadStory} onListenStory={handleListenStory} />
              <div className="space-y-12 w-full overflow-x-hidden">
                <StorySlider title="✨ New Releases" stories={newReleases} onReadStory={handleReadStory} onListenStory={handleListenStory} />
                <StorySlider title="⭐ Top Rated" stories={topRatedStories} onReadStory={handleReadStory} onListenStory={handleListenStory} />
                <StorySlider title="🎧 Audio Stories" stories={audioStories} onReadStory={handleReadStory} onListenStory={handleListenStory} />
                {["Anime", "Horror", "Mystery", "Romance", "Sci-Fi", "Fantasy"].map((genre) => {
                  const genreStories = getStoriesByGenre(genre);
                  if (genreStories.length === 0) return null;
                  return <StorySlider key={genre} title={`📚 ${genre} Stories`} stories={genreStories} onReadStory={handleReadStory} onListenStory={handleListenStory} />;
                })}
              </div>
              <div className="mt-20 mb-12">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4">Join Our Global Community</h3>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Discover stories from talented authors worldwide and become part of our thriving storytelling ecosystem.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                  <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl border border-orange-100">
                    <div className="text-3xl font-bold text-orange-600 mb-2">{stories.length}+</div>
                    <div className="text-sm text-muted-foreground">Stories Published</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                    <div className="text-3xl font-bold text-blue-600 mb-2">250K+</div>
                    <div className="text-sm text-muted-foreground">Active Readers</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                    <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
                    <div className="text-sm text-muted-foreground">Countries</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                    <div className="text-3xl font-bold text-purple-600 mb-2">12M+</div>
                    <div className="text-sm text-muted-foreground">Stories Read</div>
                  </div>
                </div>
              </div>
            </>
          )}
          {currentView === "library" && (
            <div className="space-y-12 w-full">
              <div className="text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4">Your Library</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Your saved stories, reading history, and personalized recommendations all in one place.</p>
              </div>
              <StorySlider title="📖 Continue Reading" stories={stories.slice(0, 5)} onReadStory={handleReadStory} onListenStory={handleListenStory} />
              <StorySlider title="❤️ Liked Stories" stories={stories.filter((story: any) => story.isLiked)} onReadStory={handleReadStory} onListenStory={handleListenStory} />
              <StorySlider title="🔖 Bookmarked" stories={stories.filter((story: any) => story.isBookmarked)} onReadStory={handleReadStory} onListenStory={handleListenStory} />
              <StorySlider title="💡 Recommended for You" stories={topRatedStories.slice(0, 8)} onReadStory={handleReadStory} onListenStory={handleListenStory} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
