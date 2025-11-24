import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./common/ImageWithFallback";

interface GenreLoadingScreenProps {
  genre: string;
  onLoadingComplete: () => void;
}

const genreImages: Record<string, string> = {
  "Anime": "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGNoYXJhY3RlciUyMGlsbHVzdHJhdGlvbnxlbnwxfHx8fDE3NTgzMjg1Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Horror": "https://images.unsplash.com/photo-1716593518096-fb96f2f7a595?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3Jyb3IlMjBkYXJrJTIwc2t1bGx8ZW58MXx8fHwxNzU4NDQ1NDQyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Mystery": "https://images.unsplash.com/photo-1636056471685-1cfdfa9d2e4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteXN0ZXJ5JTIwZGV0ZWN0aXZlJTIwbm9pcnxlbnwxfHx8fDE3NTg0NDU0NDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Werewolf": "https://images.unsplash.com/photo-1643527692322-0dc1e9bc913b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZXJld29sZiUyMGZhbnRhc3klMjB3b2xmfGVufDF8fHx8MTc1ODQ0NTQ1MHww&ixlib=rb-4.1.0&q=80&w=1080",
  "Romance": "https://images.unsplash.com/photo-1706515125223-60b401bf6dde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbmNlJTIwaGVhcnRzJTIwbG92ZXxlbnwxfHx8fDE3NTg0NDU0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Sci-Fi": "https://images.unsplash.com/photo-1629237213606-4d894c8af292?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwZmljdGlvbiUyMGJvb2tzfGVufDF8fHx8MTc1ODM1Nzc2OXww&ixlib=rb-4.1.0&q=80&w=1080",
  "Fantasy": "https://images.unsplash.com/photo-1711185900806-bf85e7fe7767?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwYm9vayUyMGNvdmVyc3xlbnwxfHx8fDE3NTgzNTc3Njh8MA&ixlib=rb-4.1.0&q=80&w=1080"
};

const genreColors: Record<string, string> = {
  "Anime": "from-pink-500 via-purple-500 to-blue-500",
  "Horror": "from-red-900 via-gray-900 to-black",
  "Mystery": "from-gray-800 via-blue-900 to-gray-700",
  "Werewolf": "from-amber-800 via-orange-900 to-red-900",
  "Romance": "from-pink-400 via-rose-400 to-red-400",
  "Sci-Fi": "from-blue-600 via-cyan-500 to-teal-400",
  "Fantasy": "from-purple-600 via-blue-600 to-indigo-600",
  "Comic": "from-yellow-400 via-orange-500 to-red-500",
  "Thriller": "from-gray-700 via-gray-800 to-black",
  "Adventure": "from-green-600 via-teal-600 to-blue-600",
  "Biography": "from-amber-600 via-orange-600 to-yellow-600",
  "Drama": "from-indigo-600 via-purple-600 to-pink-600"
};

export function GenreLoadingScreen({ genre, onLoadingComplete }: GenreLoadingScreenProps) {
  const [showImage, setShowImage] = useState(false);
  
  useEffect(() => {
    // Show image after text animation
    const imageTimer = setTimeout(() => {
      setShowImage(true);
    }, 800);

    // Complete loading after total animation time
    const completeTimer = setTimeout(() => {
      onLoadingComplete();
    }, 3000);

    return () => {
      clearTimeout(imageTimer);
      clearTimeout(completeTimer);
    };
  }, [onLoadingComplete]);

  const gradientClass = genreColors[genre] || "from-gray-600 via-gray-700 to-gray-800";
  const genreImage = genreImages[genre];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 bg-gradient-to-br ${gradientClass} flex items-center justify-center`}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center">
        {/* Genre Title */}
        <motion.h1
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.8,
            type: "spring",
            stiffness: 100,
            damping: 10
          }}
          className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-8 tracking-wider"
          style={{
            textShadow: "0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(255,255,255,0.3)",
            filter: "drop-shadow(0 0 20px rgba(255,255,255,0.4))"
          }}
        >
          {genre.toUpperCase()}
        </motion.h1>

        {/* Genre Character/Image */}
        {showImage && genreImage && (
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{
              duration: 1,
              type: "spring",
              stiffness: 80,
              damping: 15
            }}
            className="relative"
          >
            {/* Glowing ring around image */}
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.2, 1] }}
              transition={{
                duration: 1.5,
                times: [0, 0.5, 1],
                ease: "easeInOut"
              }}
              style={{
                background: `radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)`,
                filter: "blur(20px)"
              }}
            />
            
            <motion.div
              className="relative w-40 h-40 md:w-48 md:h-48 mx-auto rounded-full overflow-hidden border-4 border-white/30"
              whileHover={{ scale: 1.05 }}
              style={{
                boxShadow: "0 0 40px rgba(255,255,255,0.4), inset 0 0 20px rgba(255,255,255,0.2)"
              }}
            >
              <ImageWithFallback
                src={genreImage}
                alt={`${genre} character`}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Rotating rings */}
            <motion.div
              className="absolute inset-0 border-2 border-white/20 rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            <motion.div
              className="absolute inset-2 border border-white/10 rounded-full"
              animate={{ rotate: -360 }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.div>
        )}

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="text-white/80 text-lg md:text-xl mt-8"
        >
          Loading {genre} Stories...
        </motion.p>

        {/* Loading dots */}
        <motion.div
          className="flex justify-center gap-2 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-white/60 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}