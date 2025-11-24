import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { StoryCard } from "./StoryCard";

interface Story {
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
}

interface StorySliderProps {
  title: string;
  stories: Story[];
  onReadStory: (id: string) => void;
  onListenStory: (id: string) => void;
}

export function StorySlider({ title, stories, onReadStory, onListenStory }: StorySliderProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const cardWidth = 272; // 256px card + 16px gap
  const cardsVisible = Math.floor(containerWidth / cardWidth) || 4;
  const maxScroll = Math.max(0, (stories.length - cardsVisible) * cardWidth);
  
  // Touch/Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startScrollPosition, setStartScrollPosition] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const lastMoveTime = useRef(0);
  const lastMoveX = useRef(0);

  useEffect(() => {
    const updateContainerWidth = () => {
      if (scrollContainerRef.current) {
        setContainerWidth(scrollContainerRef.current.offsetWidth);
      }
    };

    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    return () => window.removeEventListener('resize', updateContainerWidth);
  }, []);

  const scrollLeft = () => {
    const newPosition = Math.max(0, scrollPosition - cardWidth * 2);
    setScrollPosition(newPosition);
  };

  const scrollRight = () => {
    const newPosition = Math.min(maxScroll, scrollPosition + cardWidth * 2);
    setScrollPosition(newPosition);
  };

  // Smooth scroll to position with bounds checking
  const smoothScrollTo = useCallback((targetPosition: number) => {
    const boundedPosition = Math.max(0, Math.min(maxScroll, targetPosition));
    setScrollPosition(boundedPosition);
  }, [maxScroll]);

  // Handle pointer/touch start
  const handlePointerStart = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartScrollPosition(scrollPosition);
    setVelocity(0);
    lastMoveTime.current = Date.now();
    lastMoveX.current = e.clientX;
    
    // Prevent text selection while dragging
    e.preventDefault();
    
    // Capture pointer to receive move events even if cursor leaves element
    if (scrollContainerRef.current) {
      scrollContainerRef.current.setPointerCapture(e.pointerId);
    }
  }, [scrollPosition]);

  // Handle pointer/touch move
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    
    const currentTime = Date.now();
    const deltaX = e.clientX - startX;
    const newScrollPosition = startScrollPosition - deltaX; // Reverse direction for natural feel
    
    // Calculate velocity for momentum
    const timeDelta = currentTime - lastMoveTime.current;
    if (timeDelta > 0) {
      const velocityX = (e.clientX - lastMoveX.current) / timeDelta;
      setVelocity(velocityX);
    }
    
    lastMoveTime.current = currentTime;
    lastMoveX.current = e.clientX;
    
    smoothScrollTo(newScrollPosition);
    
    e.preventDefault();
  }, [isDragging, startX, startScrollPosition, smoothScrollTo]);

  // Handle pointer/touch end
  const handlePointerEnd = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Apply momentum based on velocity
    if (Math.abs(velocity) > 0.5) {
      const momentumDistance = velocity * 200; // Adjust multiplier for desired momentum
      const targetPosition = scrollPosition - momentumDistance;
      
      // Animate to final position with momentum
      smoothScrollTo(targetPosition);
    }
    
    // Release pointer capture
    if (scrollContainerRef.current) {
      scrollContainerRef.current.releasePointerCapture(e.pointerId);
    }
  }, [isDragging, velocity, scrollPosition, smoothScrollTo]);

  // Prevent context menu on long press
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
    }
  }, [isDragging]);

  // Keyboard navigation support
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollLeft();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollRight();
    }
  }, [scrollLeft, scrollRight]);

  if (stories.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12 relative"
    >
      {/* Enhanced Title and Controls */}
      <div className="relative z-10 flex items-center justify-between mb-6 bg-background/95 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 sticky left-0"
        >
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
              {title}
            </h2>
            <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"></div>
          </div>
          {stories.length > cardsVisible && (
            <p className="text-xs text-muted-foreground mt-1 opacity-70">
              Drag to browse or use arrows
            </p>
          )}
        </motion.div>
        {stories.length > cardsVisible && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-2 sticky right-0"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={scrollLeft}
                disabled={scrollPosition === 0}
                className="bg-background/95 backdrop-blur-sm border-border/50 hover:border-orange-300 hover:bg-orange-50 transition-all disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={scrollRight}
                disabled={scrollPosition >= maxScroll}
                className="bg-background/95 backdrop-blur-sm border-border/50 hover:border-orange-300 hover:bg-orange-50 transition-all disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
      
      {/* Strict Container Boundary - Contains slider within viewport */}
      <div className="relative w-full">
        {/* Viewport Container - Only this area is visible */}
        <div 
          ref={scrollContainerRef}
          className={`overflow-hidden w-full select-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 rounded-lg ${
            isDragging 
              ? 'cursor-grabbing bg-accent/30' 
              : 'cursor-grab hover:bg-accent/10'
          }`}
          style={{
            position: 'relative',
            isolation: 'isolate',
            containIntrinsicSize: 'auto 400px'
          }}
          onPointerDown={handlePointerStart}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onContextMenu={handleContextMenu}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-label={`${title} slider - Use arrow keys or drag to navigate`}
          // Touch events for better mobile support
          onTouchStart={(e) => e.preventDefault()}
        >
          {/* Sliding Container - This moves but stays within viewport bounds */}
          <div
            className={`flex gap-4 will-change-transform ${isDragging ? 'transition-none' : 'transition-transform'}`}
            style={{
              transform: `translateX(-${scrollPosition}px)`,
              transition: isDragging ? 'none' : 'transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              width: `${stories.length * cardWidth}px`,
              minWidth: '100%',
              position: 'relative',
              left: 0,
              top: 0,
              pointerEvents: isDragging ? 'none' : 'auto' // Prevent card interactions while dragging
            }}
          >
            <AnimatePresence>
              {stories.map((story, index) => (
                <motion.div 
                  key={story.id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.05,
                    ease: "easeOut" 
                  }}
                  whileHover={isDragging ? {} : { y: -4 }}
                  className="flex-shrink-0"
                  style={{ 
                    width: '256px',
                    height: 'fit-content',
                    pointerEvents: isDragging ? 'none' : 'auto'
                  }}
                  onPointerDown={(e) => {
                    // Prevent drag from starting on cards
                    e.stopPropagation();
                  }}
                >
                  <StoryCard
                    {...story}
                    onRead={onReadStory}
                    onListen={story.audioAvailable ? onListenStory : undefined}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Scroll Indicators */}
        {stories.length > cardsVisible && (
          <div className="flex justify-center mt-4 gap-1">
            {Array.from({ length: Math.ceil(stories.length / cardsVisible) }).map((_, index) => {
              const isActive = Math.floor(scrollPosition / (cardWidth * cardsVisible)) === index;
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    const targetPosition = index * cardWidth * cardsVisible;
                    smoothScrollTo(targetPosition);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'bg-orange-500 w-6' 
                      : 'bg-gray-300 hover:bg-orange-300'
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}