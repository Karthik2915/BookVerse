import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Slider } from "./ui/slider";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { 
  ArrowLeft, 
  Book, 
  Play, 
  Pause, 
  Volume2, 
  Heart, 
  Share2, 
  Bookmark,
  Settings,
  SkipBack,
  SkipForward,
  VolumeX,
  Users,
  Bot,
  Mic,
  Type,
  FastForward,
  Rewind,
  Loader2
} from "lucide-react";
import { voiceSynthesis } from "../utils/voiceSynthesis";

interface Story {
  id: string;
  title: string;
  author: string;
  authorAvatar?: string;
  genre: string;
  type: "story" | "comic" | "children";
  content: string;
  audioUrl?: string;
  duration?: string;
  likes: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

interface StoryReaderProps {
  story: Story;
  onBack: () => void;
  startInAudioMode?: boolean;
}

export function StoryReader({ story, onBack, startInAudioMode = false }: StoryReaderProps) {
  const [isAudioMode, setIsAudioMode] = useState(startInAudioMode);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [volume, setVolume] = useState([70]);
  const [speechRate, setSpeechRate] = useState([1.0]);
  const [textSize, setTextSize] = useState(16);
  const [isLiked, setIsLiked] = useState(story.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(story.isBookmarked);
  const [characterVoices, setCharacterVoices] = useState<any[]>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState<string>("narrator");
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const paragraphs = story.content.split('\n').filter(p => p.trim());
  const paragraphRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize voice synthesis
  useEffect(() => {
    const initVoices = async () => {
      setIsInitializing(true);
      try {
        await voiceSynthesis.analyzeStoryCharacters(story.content, story.genre);
        const voices = voiceSynthesis.getCharacterVoices();
        setCharacterVoices(voices);
      } catch (error) {
        console.error('Voice initialization error:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    
    initVoices();
    
    return () => {
      voiceSynthesis.stopSpeaking();
    };
  }, [story]);

  // Scroll to current paragraph
  useEffect(() => {
    if (isAudioMode && paragraphRefs.current[currentParagraph]) {
      paragraphRefs.current[currentParagraph]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentParagraph, isAudioMode]);

  const detectCharacterInParagraph = (text: string): string => {
    // Simple dialogue detection
    const dialogueMatch = text.match(/"([^"]+)",?\s*([A-Za-z][a-zA-Z\s]*?)\s*(?:said|asked|replied|whispered|shouted|exclaimed)/);
    if (dialogueMatch && dialogueMatch[2]) {
      return dialogueMatch[2].trim().toLowerCase();
    }
    
    // Check if any known character names appear in the text
    for (const charVoice of characterVoices) {
      if (text.toLowerCase().includes(charVoice.characterName.toLowerCase()) && 
          text.includes('"')) {
        return charVoice.characterName.toLowerCase();
      }
    }
    
    return "narrator";
  };

  const speakCurrentParagraph = useCallback(() => {
    if (currentParagraph >= paragraphs.length) {
      console.log("Story complete - no more paragraphs!");
      setIsPlaying(false);
      return;
    }

    const text = paragraphs[currentParagraph];
    const speaker = detectCharacterInParagraph(text);
    setCurrentSpeaker(speaker);
    
    console.log(`🎙️ Speaking paragraph ${currentParagraph + 1}/${paragraphs.length} as ${speaker}`);
    console.log(`📊 Progress: ${Math.round((currentParagraph + 1) / paragraphs.length * 100)}%`);

    voiceSynthesis.speakText(
      text,
      speaker,
      () => {
        console.log(`✅ Finished paragraph ${currentParagraph + 1}, moving to next`);
        // On speech end, move to next paragraph
        setCurrentParagraph(prev => {
          const next = prev + 1;
          console.log(`⏭️ Advancing from ${prev + 1} to ${next + 1}`);
          if (next >= paragraphs.length) {
            console.log("🎬 Story complete!");
            setIsPlaying(false);
            return prev; // Stay at last paragraph
          }
          return next;
        });
      },
      (error) => {
        console.error("❌ Speech error:", error);
        setIsPlaying(false);
      }
    );
  }, [currentParagraph, paragraphs]);

  // Auto-play next paragraph when currentParagraph changes during playback
  useEffect(() => {
    if (isPlaying && !isInitializing) {
      console.log(`🔄 useEffect triggered: paragraph ${currentParagraph + 1}/${paragraphs.length}, playing: ${isPlaying}`);
      speakCurrentParagraph();
    }
  }, [currentParagraph, isPlaying, isInitializing, speakCurrentParagraph]);

  const togglePlayPause = () => {
    if (isPlaying) {
      voiceSynthesis.stopSpeaking();
      setIsPlaying(false);
    } else {
      if (!isInitializing) {
        setIsPlaying(true);
      }
    }
  };

  const skipToNext = () => {
    voiceSynthesis.stopSpeaking();
    if (currentParagraph < paragraphs.length - 1) {
      setCurrentParagraph(prev => prev + 1);
    }
  };

  const skipToPrevious = () => {
    voiceSynthesis.stopSpeaking();
    if (currentParagraph > 0) {
      setCurrentParagraph(prev => prev - 1);
    }
  };

  const toggleAudioMode = () => {
    voiceSynthesis.stopSpeaking();
    setIsPlaying(false);
    setIsAudioMode(!isAudioMode);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const getVoiceIcon = (speaker: string) => {
    if (speaker === "narrator") return <Bot className="w-3 h-3" />;
    return <Users className="w-3 h-3" />;
  };

  const getVoiceColor = (speaker: string) => {
    const voice = characterVoices.find(v => v.characterName.toLowerCase() === speaker);
    if (!voice) return "text-muted-foreground";
    
    if (voice.voice.gender === 'male') return "text-blue-600";
    if (voice.voice.gender === 'female') return "text-pink-600";
    if (voice.voice.gender === 'elder') return "text-purple-600";
    return "text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={story.authorAvatar} />
                  <AvatarFallback>{story.author[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="font-medium text-sm">{story.title}</h1>
                  <p className="text-xs text-muted-foreground">by {story.author}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={isAudioMode ? "default" : "outline"}
                size="sm"
                onClick={toggleAudioMode}
                className={isAudioMode ? "bg-gradient-to-r from-purple-500 to-pink-500" : ""}
              >
                {isAudioMode ? <Volume2 className="w-4 h-4" /> : <Book className="w-4 h-4" />}
                {isAudioMode ? "Audio" : "Read"}
              </Button>
              <Button
                variant={isLiked ? "default" : "outline"}
                size="sm"
                onClick={toggleLike}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant={isBookmarked ? "default" : "outline"}
                size="sm"
                onClick={toggleBookmark}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {isAudioMode ? (
          /* AI Audio Player Mode */
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Audio Controls */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        {/* Progress Circle */}
                        <svg className="w-32 h-32 -rotate-90">
                          {/* Background Circle */}
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-muted/20"
                          />
                          {/* Progress Circle */}
                          <motion.circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="url(#gradient)"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 56}`}
                            initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                            animate={{ 
                              strokeDashoffset: 2 * Math.PI * 56 * (1 - (currentParagraph + 1) / paragraphs.length)
                            }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#a855f7" />
                              <stop offset="100%" stopColor="#ec4899" />
                            </linearGradient>
                          </defs>
                        </svg>
                        
                        {/* Avatar/Bot */}
                        <motion.div
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                          animate={{ 
                            scale: isPlaying ? [1, 1.1, 1] : 1,
                          }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: isPlaying ? Infinity : 0,
                            ease: "easeInOut"
                          }}
                        >
                          {/* Pulsing rings when speaking */}
                          {isPlaying && (
                            <>
                              <motion.div
                                className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-30"
                                animate={{ 
                                  scale: [1, 1.4, 1.4],
                                  opacity: [0.3, 0, 0]
                                }}
                                transition={{ 
                                  duration: 2, 
                                  repeat: Infinity,
                                  ease: "easeOut"
                                }}
                              />
                              <motion.div
                                className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-30"
                                animate={{ 
                                  scale: [1, 1.4, 1.4],
                                  opacity: [0.3, 0, 0]
                                }}
                                transition={{ 
                                  duration: 2, 
                                  repeat: Infinity,
                                  ease: "easeOut",
                                  delay: 0.5
                                }}
                              />
                            </>
                          )}
                          
                          <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                            {isInitializing ? (
                              <Loader2 className="w-8 h-8 text-white animate-spin" />
                            ) : (
                              <Bot className="w-8 h-8 text-white" />
                            )}
                          </div>
                        </motion.div>
                        
                        {/* Percentage Text */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-background px-2 py-1 rounded-full border shadow-sm">
                          <span className="text-xs font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {Math.round((currentParagraph + 1) / paragraphs.length * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <h2 className="font-medium">{story.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {isInitializing ? "Initializing AI voices..." : "AI Narrated by Aria"}
                    </p>
                    <Badge className="w-fit mx-auto mt-2">{story.genre}</Badge>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Current Speaker */}
                    <div className="text-center">
                      <div className={`flex items-center justify-center gap-2 mb-2 ${getVoiceColor(currentSpeaker)}`}>
                        {getVoiceIcon(currentSpeaker)}
                        <span className="text-sm font-medium capitalize">
                          {currentSpeaker === "narrator" ? "Narrator" : currentSpeaker}
                        </span>
                        {isPlaying && (
                          <motion.div
                            className="flex gap-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <motion.div
                              className="w-1 h-3 bg-current rounded-full"
                              animate={{ height: ["8px", "16px", "8px"] }}
                              transition={{ duration: 0.5, repeat: Infinity }}
                            />
                            <motion.div
                              className="w-1 h-3 bg-current rounded-full"
                              animate={{ height: ["8px", "16px", "8px"] }}
                              transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }}
                            />
                            <motion.div
                              className="w-1 h-3 bg-current rounded-full"
                              animate={{ height: ["8px", "16px", "8px"] }}
                              transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }}
                            />
                          </motion.div>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Paragraph {currentParagraph + 1} of {paragraphs.length}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <Slider
                        value={[currentParagraph]}
                        onValueChange={(value) => {
                          voiceSynthesis.stopSpeaking();
                          setIsPlaying(false);
                          setCurrentParagraph(value[0]);
                        }}
                        max={paragraphs.length - 1}
                        step={1}
                        className="w-full"
                        disabled={isInitializing}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Paragraph {currentParagraph + 1}</span>
                        <span>Total {paragraphs.length}</span>
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-center gap-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={skipToPrevious}
                        disabled={currentParagraph === 0 || isInitializing}
                      >
                        <SkipBack className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSpeechRate([Math.max(0.5, speechRate[0] - 0.25)])}
                        disabled={isInitializing}
                      >
                        <Rewind className="w-4 h-4" />
                      </Button>
                      <Button
                        size="lg"
                        onClick={togglePlayPause}
                        disabled={isInitializing}
                        className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSpeechRate([Math.min(2.0, speechRate[0] + 0.25)])}
                        disabled={isInitializing}
                      >
                        <FastForward className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={skipToNext}
                        disabled={currentParagraph >= paragraphs.length - 1 || isInitializing}
                      >
                        <SkipForward className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Voice Settings */}
                    <Separator />
                    
                    <div className="space-y-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                        className="w-full"
                        disabled={isInitializing}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Voice Settings
                      </Button>
                      
                      <AnimatePresence>
                        {showVoiceSettings && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-3"
                          >
                            <div className="space-y-2">
                              <label className="text-xs font-medium">Speech Rate</label>
                              <div className="flex items-center gap-2">
                                <Slider
                                  value={speechRate}
                                  onValueChange={setSpeechRate}
                                  min={0.5}
                                  max={2.0}
                                  step={0.1}
                                  className="flex-1"
                                />
                                <span className="text-xs w-8">{speechRate[0].toFixed(1)}x</span>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-xs font-medium">Volume</label>
                              <div className="flex items-center gap-2">
                                <Volume2 className="w-3 h-3" />
                                <Slider
                                  value={volume}
                                  onValueChange={setVolume}
                                  max={100}
                                  step={1}
                                  className="flex-1"
                                />
                                <span className="text-xs w-8">{volume[0]}%</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Character Voices */}
                    {characterVoices.length > 0 && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium flex items-center gap-2">
                            <Mic className="w-4 h-4" />
                            Character Voices
                          </h4>
                          <div className="space-y-1">
                            {characterVoices.map((char, index) => (
                              <div key={index} className="flex items-center justify-between text-xs">
                                <span className="capitalize">{char.characterName}</span>
                                <Badge variant="outline" className={getVoiceColor(char.characterName)}>
                                  {char.voice.name}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Story Content */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <h1 className="text-xl font-medium">{story.title}</h1>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={story.authorAvatar} />
                        <AvatarFallback>{story.author[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-muted-foreground">by {story.author}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <ScrollArea className="h-[600px]">
                      <div className="space-y-4 pr-4">
                        {paragraphs.map((paragraph, index) => (
                          <motion.div
                            key={index}
                            ref={el => paragraphRefs.current[index] = el}
                            className={`p-4 rounded-lg transition-all duration-300 cursor-pointer ${
                              index === currentParagraph 
                                ? "bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200" 
                                : "hover:bg-muted/30"
                            }`}
                            onClick={() => {
                              voiceSynthesis.stopSpeaking();
                              setIsPlaying(false);
                              setCurrentParagraph(index);
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-xs text-muted-foreground mt-1 w-8">
                                {index + 1}
                              </span>
                              <p className="leading-relaxed">
                                {paragraph}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          /* Traditional Reading Mode */
          <div className="max-w-3xl mx-auto">
            {/* Reading Controls */}
            <div className="flex items-center justify-between mb-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                <span className="text-sm">Text Size:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTextSize(Math.max(12, textSize - 2))}
                >
                  A-
                </Button>
                <span className="text-sm px-2">{textSize}px</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTextSize(Math.min(24, textSize + 2))}
                >
                  A+
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Badge>{story.genre}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleAudioMode}
                  className="flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  Switch to AI Audio
                </Button>
              </div>
            </div>

            {/* Story Content */}
            <Card>
              <CardHeader>
                <h1 className="text-2xl font-medium">{story.title}</h1>
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={story.authorAvatar} />
                    <AvatarFallback>{story.author[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-muted-foreground">by {story.author}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <div 
                  className="prose max-w-none leading-relaxed"
                  style={{ fontSize: `${textSize}px` }}
                >
                  {paragraphs.map((paragraph, index) => (
                    <p key={index} className="mb-6">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}