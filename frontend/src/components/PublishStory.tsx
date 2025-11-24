import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Switch } from "./ui/switch";
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Mic, 
  FileText,
  Eye,
  Save,
  Crown,
  Globe
} from "lucide-react";
import { ImageWithFallback } from "./common/ImageWithFallback";
import { languages } from "../data/languages";

interface PublishStoryProps {
  onBack: () => void;
  onPublish: (story: any) => void;
  user?: any;
  selectedLanguage: string;
}

export function PublishStory({ onBack, onPublish, user, selectedLanguage }: PublishStoryProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    type: "",
    content: "",
    coverImage: "",
    audioFile: null as File | null,
    tags: [] as string[],
    isPublic: true,
    isPremium: false,
    language: selectedLanguage
  });
  const [currentTag, setCurrentTag] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const genres = [
    "Fantasy", "Sci-Fi", "Romance", "Mystery", "Horror", 
    "Adventure", "Drama", "Comedy", "Children", "Biography"
  ];

  const storyTypes = [
    { value: "story", label: "📖 Text Story", description: "Traditional written story" },
    { value: "comic", label: "🎨 Comic/Manga", description: "Visual storytelling with panels" },
    { value: "children", label: "🧸 Children's Story", description: "Stories for young readers" }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, coverImage: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, audioFile: file }));
      // Simulate upload progress
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would start/stop audio recording
  };

  const previewStory = () => {
    // Switch to preview mode
    setStep(4);
  };

  const publishStory = () => {
    // Validate required fields
    if (!formData.title || !formData.content || !formData.genre || !formData.type) {
      alert("Please fill in all required fields");
      return;
    }

    const newStory = {
      id: Date.now().toString(),
      ...formData,
      author: user?.name || "Anonymous",
      authorId: user?.id,
      authorAvatar: user?.avatar || "",
      likes: 0,
      views: 0,
      readTime: `${Math.max(1, Math.ceil(formData.content.length / 1000))} min read`,
      audioAvailable: !!formData.audioFile,
      isLiked: false,
      isBookmarked: false,
      publishedAt: new Date().toISOString(),
      rating: 0,
      comments: 0,
      wordCount: formData.content.split(/\s+/).length,
      chapters: 1,
      status: "published"
    };

    onPublish(newStory);
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Story Details";
      case 2: return "Content";
      case 3: return "Media & Publishing";
      case 4: return "Preview";
      default: return "Publish Story";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack}>
                <X className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl font-medium">Publish New Story</h1>
                <p className="text-sm text-muted-foreground">{getStepTitle()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={previewStory} disabled={!formData.title || !formData.content}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button onClick={publishStory}>
                <FileText className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-4 mt-4">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  step >= stepNum ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {stepNum}
                </div>
                {stepNum < 4 && <div className="w-8 h-0.5 bg-muted" />}
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Story Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter your story title"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Brief description of your story"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Story Type *</Label>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {storyTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => handleInputChange("type", type.value)}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          formData.type === type.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted/50"
                        }`}
                      >
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-muted-foreground">{type.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Genre *</Label>
                  <Select value={formData.genre} onValueChange={(value) => handleInputChange("genre", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Language *</Label>
                  <Select value={formData.language} onValueChange={(value) => handleInputChange("language", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setStep(2)} disabled={!formData.title || !formData.genre || !formData.type}>
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Story Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="content">Story Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    placeholder="Write your story here..."
                    rows={15}
                    className="min-h-[400px]"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {formData.content.length} characters • ~{Math.max(1, Math.ceil(formData.content.length / 1000))} min read
                  </div>
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      placeholder="Add tags"
                      onKeyPress={(e) => e.key === "Enter" && addTag()}
                    />
                    <Button onClick={addTag} variant="outline">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button onClick={() => removeTag(tag)}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)} disabled={!formData.content}>
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Media & Publishing Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cover Image */}
                <div>
                  <Label>Cover Image</Label>
                  <div className="mt-2">
                    {formData.coverImage ? (
                      <div className="relative">
                        <ImageWithFallback
                          src={formData.coverImage}
                          alt="Cover"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => handleInputChange("coverImage", "")}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50">
                        <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Upload cover image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Audio */}
                <div>
                  <Label>Audio Version (Optional)</Label>
                  <div className="mt-2 space-y-3">
                    <div className="flex gap-2">
                      <label className="flex-1">
                        <div className="border border-border rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:bg-muted/50">
                          <Upload className="w-5 h-5" />
                          <div>
                            <div className="font-medium">Upload Audio File</div>
                            <div className="text-xs text-muted-foreground">MP3, WAV, or M4A</div>
                          </div>
                        </div>
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={handleAudioUpload}
                          className="hidden"
                        />
                      </label>
                      <Button
                        variant="outline"
                        onClick={toggleRecording}
                        className={isRecording ? "bg-red-100 text-red-800" : ""}
                      >
                        <Mic className="w-4 h-4" />
                        {isRecording ? "Stop" : "Record"}
                      </Button>
                    </div>

                    {formData.audioFile && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{formData.audioFile.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleInputChange("audioFile", null)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        {uploadProgress > 0 && uploadProgress < 100 && (
                          <Progress value={uploadProgress} className="h-2" />
                        )}
                        {uploadProgress === 100 && (
                          <div className="text-xs text-green-600">Upload complete!</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Monetization */}
                <div>
                  <Label>Monetization</Label>
                  <div className="mt-2 border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Crown className="w-6 h-6 text-yellow-500"/>
                      <div>
                        <div className="font-medium">Premium Content</div>
                        <div className="text-xs text-muted-foreground">Make this story available to premium subscribers only.</div>
                      </div>
                    </div>
                    <Switch
                      checked={formData.isPremium}
                      onCheckedChange={(checked) => handleInputChange("isPremium", checked)}
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button onClick={() => setStep(4)}>
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Preview Your Story</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex gap-4 mb-4">
                    {formData.coverImage && (
                      <ImageWithFallback
                        src={formData.coverImage}
                        alt="Cover"
                        className="w-20 h-28 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{formData.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{formData.description}</p>
                      <div className="flex gap-2 mb-2">
                        <Badge>{formData.genre}</Badge>
                        {formData.audioFile && <Badge variant="secondary">🎧 Audio</Badge>}
                        {formData.isPremium && (
                            <Badge variant="premium" className="bg-yellow-500 text-white">
                                <Crown className="w-3 h-3 mr-1" />
                                Premium
                            </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {formData.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <strong>Preview:</strong>
                    <p className="mt-2 line-clamp-3">{formData.content}</p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(3)}>
                    Back
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Save className="w-4 h-4 mr-2" />
                      Save Draft
                    </Button>
                    <Button onClick={publishStory}>
                      <FileText className="w-4 h-4 mr-2" />
                      Publish Story
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
