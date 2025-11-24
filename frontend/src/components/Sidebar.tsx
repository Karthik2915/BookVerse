import { useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  User, 
  BookOpen, 
  Heart, 
  Bookmark, 
  Settings, 
  Crown,
  Skull,
  Search,
  Zap,
  Sparkles,
  Sword,
  Ghost,
  Camera,
  PawPrint,
  Compass,
  Trophy,
  Library,
  PenTool
} from "lucide-react";

interface SidebarProps {
  user: any;
  currentView: string;
  selectedGenre: string;
  onViewChange: (view: string) => void;
  onGenreSelect: (genre: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const genreIcons: Record<string, any> = {
  "My Profile": User,
  "Mystery": Search,
  "Horror": Skull,
  "Comic": Camera,
  "Anime": Sparkles,
  "Romance": Heart,
  "Sci-Fi": Zap,
  "Werewolf": PawPrint,
  "Fantasy": Sword,
  "Thriller": Ghost,
  "Adventure": Compass,
  "Biography": Crown,
  "Drama": Trophy
};

export function Sidebar({ 
  user, 
  currentView, 
  selectedGenre, 
  onViewChange, 
  onGenreSelect, 
  isOpen, 
  onToggle 
}: SidebarProps) {
  const mainMenuItems = [
    { id: "home", label: "Home", icon: BookOpen },
    { id: "library", label: "My Library", icon: Library },
    { id: "my-stories", label: "My Stories", icon: PenTool },
    { id: "liked", label: "Liked Stories", icon: Heart },
    { id: "bookmarked", label: "Bookmarked", icon: Bookmark },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  const genres = [
    "My Profile",
    "Mystery", 
    "Horror", 
    "Comic", 
    "Anime", 
    "Romance", 
    "Sci-Fi", 
    "Werewolf",
    "Fantasy",
    "Thriller",
    "Adventure",
    "Biography",
    "Drama"
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-50 
        transform transition-transform duration-300 ease-in-out
        w-64 lg:w-72
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* User Profile Section */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                <User className="w-6 h-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-sidebar-foreground">{user?.name || "Reader"}</h3>
              <p className="text-sm text-sidebar-foreground/70">{user?.email || "reader@storyverse.com"}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Main Navigation */}
          <div className="p-4">
            <h4 className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wide mb-3">
              Navigation
            </h4>
            <div className="space-y-1">
              {mainMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className={`
                      w-full justify-start gap-3 h-10 px-3
                      ${isActive 
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" 
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }
                    `}
                    onClick={() => {
                      onViewChange(item.id);
                      if (window.innerWidth < 1024) onToggle();
                    }}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Genres Section */}
          <div className="p-4 border-t border-sidebar-border">
            <h4 className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wide mb-3">
              Genres & Categories
            </h4>
            <div className="space-y-1">
              {genres.map((genre) => {
                const Icon = genreIcons[genre] || BookOpen;
                const isActive = selectedGenre === genre;
                
                return (
                  <Button
                    key={genre}
                    variant={isActive ? "default" : "ghost"}
                    className={`
                      w-full justify-start gap-3 h-10 px-3 transition-all duration-200
                      ${isActive 
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm transform scale-105" 
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:transform hover:scale-102"
                      }
                    `}
                    onClick={() => {
                      onGenreSelect(genre);
                      if (window.innerWidth < 1024) onToggle();
                    }}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{genre}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-sidebar-primary" />
              <span className="font-medium text-sidebar-foreground">StoryVerse</span>
            </div>
            <p className="text-xs text-sidebar-foreground/60">
              Global Storytelling Platform
            </p>
          </div>
        </div>
      </div>
    </>
  );
}