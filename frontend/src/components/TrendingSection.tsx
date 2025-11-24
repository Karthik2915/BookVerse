import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  TrendingUp, 
  Flame, 
  Play, 
  BookOpen, 
  Heart, 
  Eye, 
  Clock, 
  Star,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { ImageWithFallback } from "./common/ImageWithFallback";

interface Story {
  id: string;
  title: string;
  author: string;
  authorAvatar?: string;
  genre: string;
  description: string;
  coverImage: string;
  audioAvailable: boolean;
  likes: number;
  readTime: string;
  views: number;
  rating?: number;
  trendingRank?: number;
}

interface TrendingSectionProps {
  stories: Story[];
  onReadStory: (id: string) => void;
  onListenStory: (id: string) => void;
}

export function TrendingSection({ stories, onReadStory, onListenStory }: TrendingSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto-rotate featured story
  useEffect(() => {
    if (!autoPlay || stories.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(stories.length, 5));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoPlay, stories.length]);

  const featuredStory = stories[currentIndex];
  const topStories = stories.slice(0, 8);

  if (!featuredStory) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.min(stories.length, 5));
    setAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.min(stories.length, 5)) % Math.min(stories.length, 5));
    setAutoPlay(false);
  };

  return (
    <div className="relative mb-12 overflow-hidden">
      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Trending Now
            </h2>
            <p className="text-muted-foreground">What everyone's reading this week</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="ml-auto"
        >
          <TrendingUp className="w-6 h-6 text-orange-500" />
        </motion.div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Featured Story - Large Card */}
        <div className="lg:col-span-2 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={featuredStory.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="relative h-96 rounded-2xl overflow-hidden group cursor-pointer"
              onMouseEnter={() => setAutoPlay(false)}
              onMouseLeave={() => setAutoPlay(true)}
            >
              <ImageWithFallback
                src={featuredStory.coverImage}
                alt={featuredStory.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Content Overlay */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-red-500/90 text-white border-0">
                      <Flame className="w-3 h-3 mr-1" />
                      #{featuredStory.trendingRank || currentIndex + 1} Trending
                    </Badge>
                    <Badge variant="secondary" className="bg-white/10 text-white border-0">
                      {featuredStory.genre}
                    </Badge>
                    {featuredStory.audioAvailable && (
                      <Badge variant="secondary" className="bg-white/10 text-white border-0">
                        🎧 Audio
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="text-3xl font-bold text-white mb-3 line-clamp-2">
                    {featuredStory.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-8 h-8 border-2 border-white/50">
                      <AvatarImage src={featuredStory.authorAvatar} />
                      <AvatarFallback className="bg-white/20 text-white">
                        {featuredStory.author[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-white/90 font-medium">{featuredStory.author}</span>
                  </div>
                  
                  <p className="text-white/80 mb-6 line-clamp-2 max-w-2xl">
                    {featuredStory.description}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-6 mb-6 text-white/70">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {featuredStory.likes.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {featuredStory.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredStory.readTime}
                    </span>
                    {featuredStory.rating && (
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {featuredStory.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        onClick={() => onReadStory(featuredStory.id)}
                        className="gap-2 bg-white text-black hover:bg-white/90"
                      >
                        <BookOpen className="w-4 h-4" />
                        Read Now
                      </Button>
                    </motion.div>
                    {featuredStory.audioAvailable && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          onClick={() => onListenStory(featuredStory.id)}
                          variant="outline" 
                          className="gap-2 border-white/50 text-white hover:bg-white/10"
                        >
                          <Play className="w-4 h-4" />
                          Listen
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Navigation Arrows */}
              {stories.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Indicators */}
              {stories.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {stories.slice(0, 5).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentIndex(index);
                        setAutoPlay(false);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentIndex 
                          ? "bg-white w-8" 
                          : "bg-white/50 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Top Stories List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <h3 className="text-xl font-semibold">Top 8 This Week</h3>
          </div>
          
          <div className="space-y-3">
            {topStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border/50 hover:border-orange-200 transition-all cursor-pointer group"
                onClick={() => onReadStory(story.id)}
              >
                <div className="flex-shrink-0 relative">
                  <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white z-10 ${
                    index < 3 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                  <ImageWithFallback
                    src={story.coverImage}
                    alt={story.title}
                    className="w-12 h-16 object-cover rounded-md group-hover:scale-105 transition-transform"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {story.title}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {story.author}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {story.likes > 1000 ? `${(story.likes / 1000).toFixed(1)}k` : story.likes}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {story.views > 1000 ? `${(story.views / 1000).toFixed(1)}k` : story.views}
                    </span>
                    {story.audioAvailable && (
                      <span className="text-xs text-orange-600">🎧</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}