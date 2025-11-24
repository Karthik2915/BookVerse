import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  MessageCircle, 
  X, 
  Send, 
  BookOpen, 
  Heart, 
  Star, 
  Volume2,
  Sparkles,
  Bot,
  User,
  Mic,
  MicOff
} from "lucide-react";
import { mockStories } from "../data/mockStories";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  recommendations?: any[];
  isTyping?: boolean;
}

interface AIAssistantProps {
  user: any;
  onReadStory: (storyId: string) => void;
  onListenStory: (storyId: string) => void;
}

export function AIAssistant({ user, onReadStory, onListenStory }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "ai",
      content: `Hello ${user?.name || "there"}! 👋 I'm Aria, your personal AI storytelling companion. I can help you discover amazing stories tailored to your interests, and even narrate them with different character voices! What kind of stories are you in the mood for today?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = async (userMessage: string): Promise<{ content: string; recommendations?: any[] }> => {
    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const message = userMessage.toLowerCase();
    
    // Genre-based recommendations
    if (message.includes("fantasy") || message.includes("magic") || message.includes("dragon")) {
      const fantasyStories = mockStories.filter(s => s.genre === "Fantasy").slice(0, 3);
      return {
        content: "✨ I love fantasy stories too! Here are some magical tales I think you'll enjoy. Each one has rich world-building and characters that come alive through our AI narration - I use different voices for each character to make the experience truly immersive!",
        recommendations: fantasyStories
      };
    }
    
    if (message.includes("romance") || message.includes("love") || message.includes("relationship")) {
      const romanceStories = mockStories.filter(s => s.genre === "Romance").slice(0, 3);
      return {
        content: "💕 Ah, a fellow romantic! These heartwarming stories will make you swoon. When you listen to them, I'll use tender female voices for the heroines and deep, passionate male voices for the love interests.",
        recommendations: romanceStories
      };
    }

    if (message.includes("sci-fi") || message.includes("science") || message.includes("space") || message.includes("future")) {
      const scifiStories = mockStories.filter(s => s.genre === "Sci-Fi").slice(0, 3);
      return {
        content: "🚀 Excellent choice! Science fiction opens up infinite possibilities. These stories will transport you to other worlds. My AI narration adapts to the futuristic setting - I can even modify voices to sound alien or robotic when needed!",
        recommendations: scifiStories
      };
    }

    if (message.includes("children") || message.includes("kids") || message.includes("bedtime")) {
      const childrenStories = mockStories.filter(s => s.genre === "Children").slice(0, 3);
      return {
        content: "🌟 Perfect for young minds! These stories are wonderful for children. When narrating children's stories, I use warm, nurturing voices like a caring grandmother or loving mother to create that cozy bedtime story feeling.",
        recommendations: childrenStories
      };
    }

    if (message.includes("mystery") || message.includes("detective") || message.includes("crime")) {
      const mysteryStories = mockStories.filter(s => s.genre === "Mystery").slice(0, 3);
      return {
        content: "🔍 Intriguing choice! These mysteries will keep you guessing until the very end. I love using different character voices for suspects and detectives - it really helps distinguish the characters and adds to the suspense!",
        recommendations: mysteryStories
      };
    }

    if (message.includes("sad") || message.includes("depressed") || message.includes("down")) {
      const upliftingStories = mockStories.filter(s => 
        s.genre === "Romance" || s.genre === "Children" || s.description.includes("hope")
      ).slice(0, 3);
      return {
        content: "I'm sorry you're feeling down. Here are some uplifting stories that might brighten your day. Sometimes a good story with warm character voices can be like a comforting hug. Would you like me to read one to you?",
        recommendations: upliftingStories
      };
    }

    if (message.includes("recommend") || message.includes("suggest") || message.includes("what should")) {
      const randomStories = mockStories.sort(() => 0.5 - Math.random()).slice(0, 3);
      return {
        content: "Based on what's popular right now, here are some fantastic stories I'd recommend! Each has unique characters that I bring to life with distinct voices. What draws you to a story - the plot, the characters, or perhaps the way it's told?",
        recommendations: randomStories
      };
    }

    if (message.includes("voice") || message.includes("narrat") || message.includes("read to me")) {
      return {
        content: "I'd love to narrate stories for you! 🎭 I use advanced AI to create different voices for each character:\n\n• Male characters get deep, distinctive male voices\n• Female characters get varied female voices\n• Children's stories use warm, motherly/grandmother voices\n• Each character in a story gets their own unique voice\n\nJust click the 'Listen' button on any story, and I'll bring it to life with immersive narration!"
      };
    }

    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      return {
        content: `Hello again, ${user?.name || "friend"}! 😊 I'm always here and ready to help you discover your next favorite story. What's on your reading list today? Or would you prefer me to surprise you with a recommendation?`
      };
    }

    if (message.includes("thank") || message.includes("thanks")) {
      return {
        content: "You're very welcome! 😊 I'm always happy to help you find amazing stories. Is there anything else you'd like to explore? Maybe a different genre or a story with a specific mood?"
      };
    }

    // Default response with random recommendations
    const randomStories = mockStories.sort(() => 0.5 - Math.random()).slice(0, 2);
    return {
      content: "That's interesting! While I think about that, here are some stories you might enjoy. I'm constantly learning about reader preferences to give better recommendations. What kind of mood are you in for today?",
      recommendations: randomStories
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const aiResponse = await getAIResponse(inputMessage);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse.content,
        timestamp: new Date(),
        recommendations: aiResponse.recommendations
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice recognition is not supported in your browser");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <>
      {/* Floating AI Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="relative p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
        >
          <MessageCircle className="w-6 h-6" />
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
          />
        </motion.button>
      </motion.div>

      {/* AI Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl h-[600px] max-h-[90vh]"
            >
              <Card className="h-full flex flex-col shadow-2xl border-0 bg-white/95 backdrop-blur-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="p-2 bg-white/20 rounded-full"
                    >
                      <Bot className="w-5 h-5" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-lg">Aria - AI Story Assistant</CardTitle>
                      <p className="text-sm text-white/80">Your personal storytelling companion</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-0">
                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                          {message.type === "ai" && (
                            <Avatar className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500">
                              <AvatarFallback>
                                <Bot className="w-4 h-4 text-white" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          
                          <div className={`max-w-[80%] ${message.type === "user" ? "order-1" : ""}`}>
                            <div className={`p-3 rounded-2xl ${
                              message.type === "user" 
                                ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white ml-auto" 
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            </div>
                            
                            {/* Story Recommendations */}
                            {message.recommendations && message.recommendations.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {message.recommendations.map((story) => (
                                  <motion.div
                                    key={story.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow"
                                  >
                                    <div className="flex items-start gap-3">
                                      <img
                                        src={story.coverImage}
                                        alt={story.title}
                                        className="w-12 h-16 object-cover rounded-lg"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm text-gray-900 truncate">{story.title}</h4>
                                        <p className="text-xs text-gray-600 mb-1">by {story.author}</p>
                                        <div className="flex items-center gap-2 mb-2">
                                          <Badge variant="secondary" className="text-xs">{story.genre}</Badge>
                                          <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            <span className="text-xs text-gray-600">{story.rating}</span>
                                          </div>
                                        </div>
                                        <div className="flex gap-2">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                              onReadStory(story.id);
                                              setIsOpen(false);
                                            }}
                                            className="text-xs h-7 px-2"
                                          >
                                            <BookOpen className="w-3 h-3 mr-1" />
                                            Read
                                          </Button>
                                          <Button
                                            size="sm"
                                            onClick={() => {
                                              onListenStory(story.id);
                                              setIsOpen(false);
                                            }}
                                            className="text-xs h-7 px-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                                          >
                                            <Volume2 className="w-3 h-3 mr-1" />
                                            Listen
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            )}
                            
                            <p className="text-xs text-gray-500 mt-1">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>

                          {message.type === "user" && (
                            <Avatar className="w-8 h-8 order-2">
                              <AvatarImage src={user?.avatar} />
                              <AvatarFallback>
                                <User className="w-4 h-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                      
                      {/* Typing Indicator */}
                      {isTyping && (
                        <div className="flex gap-3 justify-start">
                          <Avatar className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500">
                            <AvatarFallback>
                              <Bot className="w-4 h-4 text-white" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-gray-100 p-3 rounded-2xl">
                            <div className="flex gap-1">
                              <motion.div
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                                className="w-2 h-2 bg-gray-400 rounded-full"
                              />
                              <motion.div
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                                className="w-2 h-2 bg-gray-400 rounded-full"
                              />
                              <motion.div
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                                className="w-2 h-2 bg-gray-400 rounded-full"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Input Area */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Input
                          ref={inputRef}
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Ask me about stories, genres, or request recommendations..."
                          className="pr-12 bg-gray-50 border-gray-200 focus:border-purple-500"
                          disabled={isTyping}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={startVoiceRecognition}
                          disabled={isListening || isTyping}
                          className={`absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 ${isListening ? "text-red-500" : "text-gray-400"}`}
                        >
                          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </Button>
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isTyping}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Sparkles className="w-3 h-3 text-purple-500" />
                      <p className="text-xs text-gray-500">
                        Try: "Recommend fantasy stories" or "Read me a children's story"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}