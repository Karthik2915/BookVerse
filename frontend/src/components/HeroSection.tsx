import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Play, BookOpen, Heart, TrendingUp, Star } from "lucide-react";
import { ImageWithFallback } from "./common/ImageWithFallback";
import { completeBooks } from "../data/completeBooks";

interface Story {
  id: string;
  title: string;
  author: string;
  authorAvatar?: string;
  genre: string;
  description: string;
  coverImage: string;
  hasAudio: boolean;
  likes: number;
  readingTime: string;
  rating: number;
  isNewRelease?: boolean;
  isTrending?: boolean;
}

interface HeroSectionProps {
  onReadStory: (id: string) => void;
  onListenStory: (id: string) => void;
}

export function HeroSection({ onReadStory, onListenStory }: HeroSectionProps) {
  const featuredStory: Story = {
    ...completeBooks[0],
    isNewRelease: true,
    isTrending: true,
  };

  return (
    <div className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 w-full">
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
      </div>
      
      <div className="relative px-6 py-12 md:px-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Content */}
            <div className="text-white space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {featuredStory.isTrending && (
                    <Badge className="bg-red-500/90 text-white border-0">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending #1
                    </Badge>
                  )}
                  {featuredStory.isNewRelease && (
                    <Badge className="bg-green-500/90 text-white border-0">
                      New Release
                    </Badge>
                  )}
                  <Badge className="bg-white/20 text-white border-0">
                    {featuredStory.genre}
                  </Badge>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tight">
                  {featuredStory.title}
                </h1>
                
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8 border-2 border-white/20">
                    <AvatarImage src={featuredStory.authorAvatar} />
                    <AvatarFallback className="bg-white/20 text-white">
                      {featuredStory.author[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-lg text-white/90">by {featuredStory.author}</span>
                </div>
              </div>
              
              <p className="text-xl text-white/90 leading-relaxed max-w-lg">
                {featuredStory.description}
              </p>
              
              <div className="flex items-center gap-6 text-white/80">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{featuredStory.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{featuredStory.likes.toLocaleString()}</span>
                </div>
                <span>{featuredStory.readingTime}</span>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-white/90 font-medium"
                  onClick={() => onReadStory(featuredStory.id)}
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Start Reading
                </Button>
                
                {featuredStory.hasAudio && (
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white/30 text-white hover:bg-white/10 font-medium"
                    onClick={() => onListenStory(featuredStory.id)}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Listen Now
                  </Button>
                )}
              </div>
            </div>
            
            {/* Featured Story Cover */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <Card className="relative overflow-hidden border-0 shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                  <div className="aspect-[3/4] w-80">
                    <ImageWithFallback
                      src={featuredStory.coverImage}
                      alt={featuredStory.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}