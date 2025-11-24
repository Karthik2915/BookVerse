import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  Search, 
  PlusCircle, 
  BookOpen, 
  User,
  Heart,
  Bookmark,
  Home,
  Library,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Bell,
  Sparkles,
  Crown,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { genres } from "../data/mockStories";
import { languages } from "../data/languages";

interface NavbarProps {
  user: any;
  isAuthenticated: boolean;
  currentView: string;
  selectedGenre: string;
  searchQuery: string;
  selectedLanguage: string;
  onViewChange: (view: "home" | "read" | "publish" | "library" | "genre" | "my-stories" | "login" | "signup" | "subscription" | "payment-panel") => void;
  onGenreSelect: (genre: string) => void;
  onSearchChange: (query: string) => void;
  onLanguageChange: (language: string) => void;
  onLogout: () => void;
}

export function Navbar({ 
  user, 
  isAuthenticated,
  currentView, 
  selectedGenre, 
  searchQuery,
  selectedLanguage,
  onViewChange, 
  onGenreSelect, 
  onSearchChange,
  onLanguageChange,
  onLogout
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGenreMenuOpen, setIsGenreMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "library", label: "Library", icon: Library },
    { id: "my-stories", label: "My Stories", icon: BookOpen },
    { id: "subscription", label: "Subscription", icon: Crown }
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                StoryVerse
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Global Storytelling Platform
              </p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Main Nav Items */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onViewChange(item.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all relative ${
                      isActive 
                        ? "text-primary bg-primary/10" 
                        : "text-muted-foreground hover:text-primary hover:bg-accent/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-lg border border-orange-200/30"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Genres Dropdown */}
            <DropdownMenu open={isGenreMenuOpen} onOpenChange={setIsGenreMenuOpen}>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent/50 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="font-medium">Genres</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isGenreMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2" align="center">
                <DropdownMenuLabel className="text-sm font-medium text-muted-foreground px-2">
                  Browse by Genre
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="grid grid-cols-2 gap-1">
                  {genres.slice(1).map((genre) => (
                    <DropdownMenuItem
                      key={genre}
                      onClick={() => {
                        onGenreSelect(genre);
                        setIsGenreMenuOpen(false);
                      }}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedGenre === genre 
                          ? "bg-orange-50 text-orange-700 border border-orange-200" 
                          : "hover:bg-accent"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-sm font-medium">{genre}</div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Dropdown */}
            <DropdownMenu open={isLangMenuOpen} onOpenChange={setIsLangMenuOpen}>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent/50 transition-all"
                >
                  <Globe className="w-4 h-4" />
                  <span className="font-medium">{languages.find(l => l.code === selectedLanguage)?.name || 'Language'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2" align="center">
                <DropdownMenuLabel className="text-sm font-medium text-muted-foreground px-2">
                  Select Language
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="grid grid-cols-2 gap-1">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedLanguage === lang.code 
                          ? "bg-orange-50 text-orange-700 border border-orange-200" 
                          : "hover:bg-accent"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-sm font-medium">{lang.name}</div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search stories, authors, genres..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-accent/30 border-border/50 focus:bg-background transition-colors"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Publish Button */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={() => onViewChange("publish")}
                    className="gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white border-0"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Publish</span>
                  </Button>
                </motion.div>

                {/* Notifications */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg hover:bg-accent/50 transition-colors relative"
                >
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></div>
                </motion.button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2 p-1 rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <Avatar className="w-8 h-8 border-2 border-gradient-to-r from-orange-400 to-yellow-400">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="w-4 h-4 text-muted-foreground hidden lg:block" />
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onViewChange("my-stories")}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>My Stories</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onViewChange("payment-panel")}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>Payment Panel</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Liked Stories</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bookmark className="mr-2 h-4 w-4" />
                      <span>Bookmarks</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* Login/Signup Buttons */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline"
                    onClick={() => onViewChange("login")} 
                    className="hidden sm:flex gap-2"
                  >
                    <User className="w-4 h-4" />
                    Sign in
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={() => onViewChange("signup")}
                    className="gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white border-0"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Join</span>
                    <span className="sm:hidden">Sign up</span>
                  </Button>
                </motion.div>
              </>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-accent/50 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-accent/30 border-border/50"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-lg"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {/* Mobile Nav Items */}
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onViewChange(item.id as any);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      isActive 
                        ? "text-primary bg-primary/10 border border-primary/20" 
                        : "text-muted-foreground hover:text-primary hover:bg-accent/50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                );
              })}
              
              {/* Mobile Genres */}
              <div className="pt-2">
                <p className="text-sm font-medium text-muted-foreground px-3 pb-2">Genres</p>
                <div className="grid grid-cols-2 gap-2">
                  {genres.slice(1, 9).map((genre) => (
                    <motion.button
                      key={genre}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onGenreSelect(genre);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`p-2 rounded-lg text-sm transition-colors ${
                        selectedGenre === genre 
                          ? "bg-orange-50 text-orange-700 border border-orange-200" 
                          : "bg-accent/50 hover:bg-accent text-muted-foreground hover:text-primary"
                      }`}
                    >
                      {genre}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Mobile Authentication */}
              {!isAuthenticated && (
                <div className="pt-4 border-t border-border/50 space-y-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onViewChange("login");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent/50 transition-all"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Sign in</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onViewChange("signup");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 text-white transition-all"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span className="font-medium">Join StoryVerse</span>
                  </motion.button>
                </div>
              )}

              {/* Mobile User Actions */}
              {isAuthenticated && (
                <div className="pt-4 border-t border-border/50 space-y-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onViewChange("publish");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 text-white transition-all"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span className="font-medium">Publish Story</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent/50 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign out</span>
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}