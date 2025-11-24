import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";
import { BookOpen, Eye, EyeOff, ArrowLeft, Mail, Lock, User, PenTool, BarChart3, Zap, DollarSign, Shield, Rocket } from "lucide-react";

interface SignUpProps {
  onBack: () => void;
  onSignupSuccess: (user: any) => void;
  onSwitchToLogin: () => void;
}

export function SignUp({ onBack, onSignupSuccess, onSwitchToLogin }: SignUpProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Demo signup - creates user with provided info
    const newUser = {
      id: `user-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      username: formData.name.toLowerCase().replace(/\s+/g, ''),
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&auto=format&fit=crop&crop=face"
    };

    setIsLoading(false);
    onSignupSuccess(newUser);
  };

  const handleSocialSignup = async (provider: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newUser = {
      id: `user-${Date.now()}`,
      name: `${provider} User`,
      email: `user@${provider.toLowerCase()}.com`,
      username: `${provider.toLowerCase()}user`,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&auto=format&fit=crop&crop=face"
    };

    setIsLoading(false);
    onSignupSuccess(newUser);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
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
      {/* Hero Section with Signup Form */}
      <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center p-4"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1609348445085-13fc7e652d3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjByZWFkaW5nJTIwYm9vayUyMGhlYWRwaG9uZXMlMjBhdWRpb3xlbnwxfHx8fDE3NTk4NjA3MTN8MA&ixlib=rb-4.1.0&q=80&w=1080')`
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
                    Join StoryVerse
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-2">
                    Create your account and start your storytelling journey
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Signup Form */}
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
                        required
                      />
                    </div>
                    {errors.name && (
                      <p className="text-xs text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
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
                    {errors.password && (
                      <p className="text-xs text-red-500">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => {
                        setAgreedToTerms(checked as boolean);
                        if (errors.terms && checked) {
                          setErrors(prev => ({ ...prev, terms: "" }));
                        }
                      }}
                      className={errors.terms ? "border-red-500" : ""}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the{" "}
                        <button type="button" className="text-orange-600 hover:text-orange-700 underline">
                          Terms of Service
                        </button>{" "}
                        and{" "}
                        <button type="button" className="text-orange-600 hover:text-orange-700 underline">
                          Privacy Policy
                        </button>
                      </label>
                      {errors.terms && (
                        <p className="text-xs text-red-500">{errors.terms}</p>
                      )}
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create account"}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative">
                  <Separator className="my-6" />
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-muted-foreground">
                    Or sign up with
                  </span>
                </div>

                {/* Social Signup */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleSocialSignup("Google")}
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
                    onClick={() => handleSocialSignup("GitHub")}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </Button>
                </div>

                {/* Login link */}
                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Already have an account? </span>
                  <button
                    onClick={onSwitchToLogin}
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Sign in
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
              <strong>Demo Mode:</strong> Fill out the form to create a demo account
            </p>
          </motion.div>
        </div>
      </div>

      {/* Features Section for Creators */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <Feature>
            <div className="text-center mb-20">
              <h2 className="text-4xl bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4">
                Empower Your Creative Journey
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Join thousands of creators who are sharing their stories with the world and building successful careers.
              </p>
            </div>
          </Feature>

          {/* Feature 1: Intuitive Writing Tools */}
          <Feature delay={0.2}>
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-2xl">
                    <PenTool className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl">Intuitive Writing Tools</h3>
                </div>
                <p className="text-muted-foreground text-lg">
                  Write with ease using our distraction-free editor. Rich formatting, chapter organization, 
                  auto-save, and collaboration features help you focus on what matters most - your story.
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Auto-save</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Rich formatting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Version history</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 rounded-2xl p-8 shadow-xl border border-blue-100 h-72 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto">
                      <PenTool className="w-8 h-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <div className="w-32 h-2 bg-blue-200 rounded-full mx-auto"></div>
                      <div className="w-24 h-2 bg-blue-100 rounded-full mx-auto"></div>
                      <div className="w-28 h-2 bg-blue-200 rounded-full mx-auto"></div>
                    </div>
                  </div>
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
                  <PenTool className="w-6 h-6 text-blue-600" />
                </motion.div>
              </div>
            </div>
          </Feature>

          {/* Feature 2: Real-Time Analytics */}
          <Feature delay={0.4}>
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="relative md:order-1">
                <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50 rounded-2xl p-8 shadow-xl border border-green-100 h-72">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Story Performance</h4>
                      <BarChart3 className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <div className="flex-1 h-2 bg-green-200 rounded-full">
                          <div className="w-3/4 h-full bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-sm text-green-600">1.2K</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <div className="flex-1 h-2 bg-blue-200 rounded-full">
                          <div className="w-1/2 h-full bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-sm text-blue-600">850</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                        <div className="flex-1 h-2 bg-yellow-200 rounded-full">
                          <div className="w-2/3 h-full bg-yellow-500 rounded-full"></div>
                        </div>
                        <span className="text-sm text-yellow-600">650</span>
                      </div>
                    </div>
                  </div>
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
                  className="absolute -bottom-4 -left-4 p-3 bg-green-500 rounded-2xl shadow-lg"
                >
                  <BarChart3 className="w-6 h-6 text-white" />
                </motion.div>
              </div>
              <div className="space-y-6 md:order-2">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-2xl">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-2xl">Real-Time Analytics</h3>
                </div>
                <p className="text-muted-foreground text-lg">
                  Track your story's performance with detailed analytics. See reader engagement, 
                  completion rates, favorite chapters, and audience demographics to improve your craft.
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Reader insights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Engagement metrics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Growth tracking</span>
                  </div>
                </div>
              </div>
            </div>
          </Feature>

          {/* Feature 3: AI Writing Assistant */}
          <Feature delay={0.6}>
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-2xl">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-2xl">AI Writing Assistant</h3>
                </div>
                <p className="text-muted-foreground text-lg">
                  Overcome writer's block with our AI-powered assistant. Get suggestions for plot development, 
                  character arcs, dialogue improvements, and creative inspiration when you need it most.
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Plot suggestions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Character development</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Grammar checking</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-2xl p-8 shadow-xl border border-purple-100 h-72 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <motion.div
                      animate={{ 
                        rotate: [0, 360]
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto"
                    >
                      <Zap className="w-8 h-8 text-white" />
                    </motion.div>
                    <div className="space-y-2">
                      <p className="text-sm text-purple-600">✨ "What if your character..."</p>
                      <p className="text-xs text-muted-foreground">AI Suggestion</p>
                    </div>
                  </div>
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
                  <Zap className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </div>
          </Feature>

          {/* Feature 4: Monetization & Growth */}
          <Feature delay={0.8}>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative md:order-1">
                <div className="bg-gradient-to-br from-yellow-50 via-white to-orange-50 rounded-2xl p-8 shadow-xl border border-yellow-100 h-72">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Creator Earnings</h4>
                      <DollarSign className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 border border-yellow-200">
                        <div className="text-xl font-bold text-yellow-600">$1,247</div>
                        <div className="text-xs text-muted-foreground">This Month</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-orange-200">
                        <div className="text-xl font-bold text-orange-600">$8,932</div>
                        <div className="text-xs text-muted-foreground">Total Earned</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>+23% from last month</span>
                    </div>
                  </div>
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
                  className="absolute -bottom-4 -left-4 p-3 bg-yellow-500 rounded-2xl shadow-lg"
                >
                  <DollarSign className="w-6 h-6 text-white" />
                </motion.div>
              </div>
              <div className="space-y-6 md:order-2">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-yellow-100 rounded-2xl">
                    <DollarSign className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="text-2xl">Monetize Your Stories</h3>
                </div>
                <p className="text-muted-foreground text-lg">
                  Turn your passion into profit. Earn from subscriptions, donations, premium chapters, 
                  and merchandise. We provide multiple revenue streams to help you build a sustainable writing career.
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Multiple revenue streams</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Fair creator split</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Growth tools</span>
                  </div>
                </div>
              </div>
            </div>
          </Feature>

          {/* Success Stories */}
          <Feature delay={1.0}>
            <div className="mt-20 p-12 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl border border-orange-100">
              <div className="text-center mb-8">
                <h3 className="text-2xl mb-4">Success Stories</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Join creators who have built thriving communities and turned their storytelling passion into successful careers.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-orange-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Rocket className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium">Sarah Chen</div>
                      <div className="text-sm text-muted-foreground">Romance Author</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "StoryVerse helped me reach 50K readers and earn $3,000/month from my stories."
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 border border-orange-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Marcus Johnson</div>
                      <div className="text-sm text-muted-foreground">Sci-Fi Writer</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "The analytics helped me understand my audience better and triple my readership."
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 border border-orange-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Elena Rodriguez</div>
                      <div className="text-sm text-muted-foreground">Fantasy Creator</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "From hobby to full-time career - StoryVerse made my dreams come true."
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  onClick={() => handleSignUp(new Event('submit') as any)}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-8"
                >
                  Start Your Story Today
                </Button>
              </div>
            </div>
          </Feature>
        </div>
      </div>
    </div>
  );
}