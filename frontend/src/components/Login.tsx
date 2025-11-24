import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { BookOpen, Eye, EyeOff, ArrowLeft, Mail, Lock, Headphones, Globe, Heart, Sparkles } from "lucide-react";

interface LoginProps {
  onBack: () => void;
  onLoginSuccess: (user: any) => void;
  onSwitchToSignup: () => void;
}

export function Login({ onBack, onLoginSuccess, onSwitchToSignup }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Demo login - accepts any email/password
    const demoUser = {
      id: "demo-user-1",
      name: email.split('@')[0] || "Demo User",
      email: email,
      username: email.split('@')[0] || "demouser",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&auto=format&fit=crop&crop=face"
    };

    setIsLoading(false);
    onLoginSuccess(demoUser);
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const demoUser = {
      id: "demo-user-1",
      name: `${provider} User`,
      email: `user@${provider.toLowerCase()}.com`,
      username: `${provider.toLowerCase()}user`,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&auto=format&fit=crop&crop=face"
    };

    setIsLoading(false);
    onLoginSuccess(demoUser);
  };

  const Feature = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6, delay }}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section with Login Form */}
      <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center p-4"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1758610605872-3195caed0bdd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwcmVhZGluZyUyMG5vb2slMjB3YXJtJTIwbGlnaHRpbmclMjBib29rc3xlbnwxfHx8fDE3NTk4NjA1NDh8MA&ixlib=rb-4.1.0&q=80&w=1080')`
        }}
      >
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-orange-400/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              y: [0, 20, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-yellow-400/20 rounded-full blur-xl"
          />
        </div>

        <div className="relative w-full max-w-md z-10">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to StoryVerse</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="backdrop-blur-lg bg-white/95 border-white/20 shadow-2xl">
              <CardHeader className="text-center space-y-4">
                {/* Logo */}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="mx-auto p-3 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl w-fit"
                >
                  <BookOpen className="w-8 h-8 text-white" />
                </motion.div>
                
                <div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                    Welcome back
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-2">
                    Sign in to continue your storytelling journey
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>Remember me</span>
                    </label>
                    <button type="button" className="text-sm text-orange-600 hover:text-orange-700">
                      Forgot password?
                    </button>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative">
                  <Separator className="my-6" />
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-muted-foreground">
                    Or continue with
                  </span>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin("Google")}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin("GitHub")}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </Button>
                </div>

                {/* Sign up link */}
                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Don't have an account? </span>
                  <button
                    onClick={onSwitchToSignup}
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Sign up
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Demo notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-center"
          >
            <p className="text-sm text-white">
              <strong>Demo Mode:</strong> Use any email and password to sign in
            </p>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <Feature>
            <div className="text-center mb-20">
              <h2 className="text-4xl bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4">
                Experience Stories Like Never Before
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                StoryVerse adapts to your lifestyle, making stories accessible anywhere, anytime, for everyone.
              </p>
            </div>
          </Feature>

          {/* Feature 1: Read Anywhere */}
          <Feature delay={0.2}>
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-100 rounded-2xl">
                    <BookOpen className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-2xl">Read Anywhere</h3>
                </div>
                <p className="text-muted-foreground text-lg">
                  Find your perfect reading spot. Whether it's a cozy corner at home, a park bench, or your favorite café - 
                  dive into stories with our beautiful, distraction-free reading interface that works on any device.
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Offline reading</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Progress sync</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Night mode</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div 
                  className="rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1758610605872-3195caed0bdd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwcmVhZGluZyUyMG5vb2slMjB3YXJtJTIwbGlnaHRpbmclMjBib29rc3xlbnwxfHx8fDE3NTk4NjA1NDh8MA&ixlib=rb-4.1.0&q=80&w=1080')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '300px'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <motion.div
                  animate={{ 
                    y: [0, -10, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-4 -right-4 p-3 bg-white rounded-2xl shadow-lg"
                >
                  <BookOpen className="w-6 h-6 text-orange-600" />
                </motion.div>
              </div>
            </div>
          </Feature>

          {/* Feature 2: Listen On-the-Go */}
          <Feature delay={0.4}>
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="relative md:order-1">
                <div 
                  className="rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1758599543158-0519545c4d45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjB3YWxraW5nJTIwaGVhZHBob25lcyUyMGxpc3RlbmluZ3xlbnwxfHx8fDE3NTk4NjA3MTN8MA&ixlib=rb-4.1.0&q=80&w=1080')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '300px'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -bottom-4 -left-4 p-3 bg-blue-500 rounded-2xl shadow-lg"
                >
                  <Headphones className="w-6 h-6 text-white" />
                </motion.div>
              </div>
              <div className="space-y-6 md:order-2">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-2xl">
                    <Headphones className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl">Listen On-the-Go</h3>
                </div>
                <p className="text-muted-foreground text-lg">
                  Can't sit down to read? No problem! Switch seamlessly to audio mode and enjoy stories while walking, 
                  commuting, exercising, or doing chores. Same story, different experience - just like music for your mind.
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>AI narration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Speed control</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Offline download</span>
                  </div>
                </div>
              </div>
            </div>
          </Feature>

          {/* Feature 3: Accessibility First */}
          <Feature delay={0.6}>
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-2xl">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-2xl">Accessibility First</h3>
                </div>
                <p className="text-muted-foreground text-lg">
                  We believe everyone deserves access to great stories. Our platform is designed with accessibility in mind, 
                  helping visually impaired users and those with reading difficulties discover the wonderful world of books 
                  through high-quality audio narration and screen reader compatibility.
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Screen reader friendly</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>High contrast mode</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Voice navigation</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div 
                  className="rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1758272420760-5f45e9e5af1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2Nlc3NpYmlsaXR5JTIwdGVjaG5vbG9neSUyMHJlYWRpbmd8ZW58MXx8fHwxNzU5ODYwNzE0fDA&ixlib=rb-4.1.0&q=80&w=1080')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '300px'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-4 -right-4 p-3 bg-purple-500 rounded-2xl shadow-lg"
                >
                  <Heart className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </div>
          </Feature>

          {/* Feature 4: Global Community */}
          <Feature delay={0.8}>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative md:order-1">
                <div 
                  className="rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1661827291034-a7afb7dd1601?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwcmVhZGVycyUyMGNvbW11bml0eSUyMGJvb2tzfGVufDF8fHx8MTc1OTg2MDcxM3ww&ixlib=rb-4.1.0&q=80&w=1080')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '300px'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <motion.div
                  animate={{ 
                    y: [0, -8, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -bottom-4 -left-4 p-3 bg-green-500 rounded-2xl shadow-lg"
                >
                  <Globe className="w-6 h-6 text-white" />
                </motion.div>
              </div>
              <div className="space-y-6 md:order-2">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-2xl">
                    <Globe className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-2xl">Global Community</h3>
                </div>
                <p className="text-muted-foreground text-lg">
                  Connect with readers and writers from around the world. Discover stories from different cultures, 
                  share your thoughts, and become part of a vibrant global storytelling community that celebrates 
                  diversity and creativity.
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>50+ languages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Global authors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Cultural exchange</span>
                  </div>
                </div>
              </div>
            </div>
          </Feature>

          {/* CTA Section */}
          <Feature delay={1.0}>
            <div className="text-center mt-20 p-12 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl border border-orange-100">
              <div className="inline-flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-orange-600" />
                <h3 className="text-2xl">Ready to Start Your Journey?</h3>
                <Sparkles className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of readers and writers who have already discovered the magic of StoryVerse. 
                Your next favorite story is just one click away.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={onSwitchToSignup}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-8"
                >
                  Join StoryVerse
                </Button>
                <Button 
                  variant="outline"
                  onClick={onBack}
                  className="border-orange-200 text-orange-600 hover:bg-orange-50"
                >
                  Explore Stories
                </Button>
              </div>
            </div>
          </Feature>
        </div>
      </div>
    </div>
  );
}