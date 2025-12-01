import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Play, Book, Heart, Clock, Eye, Star, Bookmark } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./common/ImageWithFallback";

interface StoryCardProps {
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
  onRead: (id: string) => void;
  onListen?: (id: string) => void;
}

export function StoryCard({
  id,
  title,
  author,
  authorAvatar,
  genre,
  type,
  description,
  coverImage,
  audioAvailable,
  likes,
  readTime,
  views,
  onRead,
  onListen
}: StoryCardProps) {
  const getGenreColor = (genre: string) => {
    const colors: Record<string, string> = {
      "Fantasy": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      "Sci-Fi": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      "Romance": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      "Mystery": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      "Children": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      "Horror": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      "Adventure": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      "Drama": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
    };
    return colors[genre] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "comic":
        return "🎨";
      case "children":
        return "🧸";
      default:
        return "📖";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 overflow-hidden w-full h-fit border border-border/50 bg-card hover:border-orange-200">
        <CardHeader className="p-0">
          <div className="relative aspect-[3/4] overflow-hidden">
            <ImageWithFallback
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Floating Action Buttons */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onRead(id);
                }}
                className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-black hover:bg-white transition-colors shadow-lg"
              >
                <Book className="w-5 h-5" />
              </motion.button>
              {onListen && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onListen(id);
                  }}
                  className="p-3 bg-orange-500/90 backdrop-blur-sm rounded-full text-white hover:bg-orange-500 transition-colors shadow-lg"
                >
                  <Play className="w-5 h-5" />
                </motion.button>
              )}
            </div>
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge className={`${getGenreColor(genre)} shadow-sm`}>
                {getTypeIcon(type)} {genre}
              </Badge>
            </div>
            
            {/* Audio Badge */}
            {onListen && (
              <div className="absolute top-3 right-3">
                <Badge variant="secondary" className="bg-black/80 text-white border-0 shadow-sm">
                  🎧 Audio
                </Badge>
              </div>
            )}
            
            {/* Bookmark Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-3 right-3 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/30"
            >
              <Bookmark className="w-4 h-4" />
            </motion.button>
          </div>
        </CardHeader>
      
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Avatar className="w-7 h-7 border border-border/50">
            <AvatarImage src={authorAvatar} />
            <AvatarFallback className="text-xs">{author[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground font-medium">{author}</span>
        </div>
        
        <h3 className="font-semibold text-base line-clamp-2 group-hover:text-orange-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <motion.span 
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer"
            >
              <Heart className="w-3 h-3" />
              {likes > 1000 ? `${(likes / 1000).toFixed(1)}k` : likes}
            </motion.span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readTime}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {views > 1000 ? `${(views / 1000).toFixed(1)}k` : views}
            </span>
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">4.{Math.floor(Math.random() * 9)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <motion.div 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }}
          className="flex-1"
        >
          <Button 
            onClick={() => onRead(id)} 
            className="w-full gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 
                       hover:from-orange-600 hover:to-yellow-600 text-white border-0"
            size="sm"
          >
            <Book className="w-4 h-4" />
            Read
          </Button>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }}
          className="flex-1"
        >
          <Button 
            onClick={() => onListen(id)} 
            variant="outline" 
            className="w-full gap-2 border-orange-200 text-orange-600 
                       hover:bg-orange-50 hover:border-orange-300"
            size="sm"
          >
            <Play className="w-4 h-4" />
            Listen
          </Button>
        </motion.div>
      </CardFooter>
    </Card>
    </motion.div>
  );
}
