import { motion } from "motion/react";
import { StorySlider } from "./StorySlider";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, Filter, TrendingUp, Clock, Star } from "lucide-react";
import { getStoriesByGenre, mockStories } from "../data/mockStories";

interface GenrePageProps {
  genre: string;
  onBack: () => void;
  onReadStory: (id: string) => void;
  onListenStory: (id: string) => void;
}

const genreDescriptions: Record<string, string> = {
  "Anime": "Discover captivating anime-style stories with rich characters, epic adventures, and stunning visual narratives.",
  "Horror": "Spine-chilling tales that will keep you on the edge of your seat. Enter if you dare...",
  "Mystery": "Unravel complex puzzles and follow thrilling investigations in these mind-bending mysteries.",
  "Werewolf": "Transform into a world of shapeshifters, pack dynamics, and supernatural romance.",
  "Romance": "Fall in love with heartwarming stories of passion, connection, and happily ever afters.",
  "Sci-Fi": "Journey to the future with cutting-edge technology, space exploration, and scientific wonders.",
  "Fantasy": "Enter magical realms filled with dragons, wizards, and extraordinary adventures.",
  "Comic": "Visual storytelling at its finest with colorful characters and dynamic narratives.",
  "Thriller": "High-stakes suspense that will keep your heart racing until the very last page.",
  "Adventure": "Epic quests and daring journeys that will take you to the edge of the world.",
  "Biography": "Real-life stories of extraordinary people who changed the world.",
  "Drama": "Emotional depth and human complexity in stories that touch the heart and soul."
};

const genreGradients: Record<string, string> = {
  "Anime": "from-pink-500/20 via-purple-500/20 to-blue-500/20",
  "Horror": "from-red-900/20 via-gray-900/20 to-black/20",
  "Mystery": "from-gray-800/20 via-blue-900/20 to-gray-700/20",
  "Werewolf": "from-amber-800/20 via-orange-900/20 to-red-900/20",
  "Romance": "from-pink-400/20 via-rose-400/20 to-red-400/20",
  "Sci-Fi": "from-blue-600/20 via-cyan-500/20 to-teal-400/20",
  "Fantasy": "from-purple-600/20 via-blue-600/20 to-indigo-600/20",
  "Comic": "from-yellow-400/20 via-orange-500/20 to-red-500/20",
  "Thriller": "from-gray-700/20 via-gray-800/20 to-black/20",
  "Adventure": "from-green-600/20 via-teal-600/20 to-blue-600/20",
  "Biography": "from-amber-600/20 via-orange-600/20 to-yellow-600/20",
  "Drama": "from-indigo-600/20 via-purple-600/20 to-pink-600/20"
};

export function GenrePage({ genre, onBack, onReadStory, onListenStory }: GenrePageProps) {
  // Get stories for this genre
  const genreStories = genre === "My Profile" 
    ? mockStories.filter(story => story.isLiked || story.isBookmarked)
    : getStoriesByGenre(genre);
    
  const trendingStories = genreStories
    .filter(story => story.isTrending)
    .slice(0, 8);
    
  const newStories = genreStories
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 8);
    
  const topRatedStories = genreStories
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8);

  const gradientClass = genreGradients[genre] || "from-gray-600/20 via-gray-700/20 to-gray-800/20";
  const description = genreDescriptions[genre] || `Explore amazing ${genre} stories from our community of writers.`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="min-h-screen bg-background"
    >
      {/* Hero Section */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${gradientClass}`}>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
        </div>
        
        <div className="relative px-6 py-12 md:px-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Button
                variant="ghost"
                onClick={onBack}
                className="mb-6 gap-2 hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
              
              <div className="mb-6">
                <motion.h1
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-medium mb-4"
                >
                  {genre}
                </motion.h1>
                
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-xl text-muted-foreground max-w-2xl"
                >
                  {description}
                </motion.p>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex items-center gap-4 flex-wrap"
              >
                <Badge variant="secondary" className="gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {genreStories.length} Stories
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Star className="w-3 h-3" />
                  Highly Rated
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Clock className="w-3 h-3" />
                  Updated Daily
                </Badge>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="max-w-7xl mx-auto px-6 py-8"
      >
        {genreStories.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-muted-foreground mb-4">
              <Filter className="w-16 h-16 mx-auto opacity-50" />
            </div>
            <h3 className="text-xl font-medium mb-2">No {genre} stories yet</h3>
            <p className="text-muted-foreground">
              Be the first to publish a {genre} story on StoryVerse!
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Trending Section */}
            {trendingStories.length > 0 && (
              <StorySlider
                title={`🔥 Trending ${genre}`}
                stories={trendingStories}
                onReadStory={onReadStory}
                onListenStory={onListenStory}
              />
            )}

            {/* New Stories Section */}
            {newStories.length > 0 && (
              <StorySlider
                title={`✨ Latest ${genre}`}
                stories={newStories}
                onReadStory={onReadStory}
                onListenStory={onListenStory}
              />
            )}

            {/* Top Rated Section */}
            {topRatedStories.length > 0 && (
              <StorySlider
                title={`⭐ Top Rated ${genre}`}
                stories={topRatedStories}
                onReadStory={onReadStory}
                onListenStory={onListenStory}
              />
            )}

            {/* All Stories Section */}
            {genreStories.length > 8 && (
              <StorySlider
                title={`📚 All ${genre} Stories`}
                stories={genreStories}
                onReadStory={onReadStory}
                onListenStory={onListenStory}
              />
            )}
          </div>
        )}

        {/* Stats */}
        {genreStories.length > 0 && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16 text-center"
          >
            <h3 className="text-xl font-medium mb-6">{genre} Community Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div>
                <div className="text-2xl font-medium text-primary">{genreStories.length}</div>
                <div className="text-sm text-muted-foreground">Stories</div>
              </div>
              <div>
                <div className="text-2xl font-medium text-primary">
                  {Math.round(genreStories.reduce((acc, story) => acc + story.rating, 0) / genreStories.length * 10) / 10}
                </div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </div>
              <div>
                <div className="text-2xl font-medium text-primary">
                  {genreStories.reduce((acc, story) => acc + story.views, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Views</div>
              </div>
              <div>
                <div className="text-2xl font-medium text-primary">
                  {genreStories.reduce((acc, story) => acc + story.likes, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Likes</div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}