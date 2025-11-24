import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload,
  X,
  Plus
} from "lucide-react";
import { UserStory } from "../data/userStories";
import { ImageWithFallback } from "./common/ImageWithFallback";

interface StoryEditorProps {
  story: UserStory | null;
  onSave: (storyData: Partial<UserStory>) => void;
  onCancel: () => void;
}

const genres = [
  "Fantasy", "Sci-Fi", "Romance", "Mystery", "Horror", "Thriller",
  "Adventure", "Drama", "Comedy", "Biography", "Children", "Comic", 
  "Anime", "Werewolf"
];

export function StoryEditor({ story, onSave, onCancel }: StoryEditorProps) {
  const [title, setTitle] = useState(story?.title || "");
  const [description, setDescription] = useState(story?.description || "");
  const [genre, setGenre] = useState(story?.genre || "Fantasy");
  const [coverImage, setCoverImage] = useState(story?.coverImage || "");
  const [tags, setTags] = useState<string[]>(story?.tags || []);
  const [newTag, setNewTag] = useState("");
  const [isPublished, setIsPublished] = useState(story?.isPublished || false);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert("Please enter a title for your story.");
      return;
    }

    const storyData: Partial<UserStory> = {
      title: title.trim(),
      description: description.trim(),
      genre,
      coverImage: coverImage || "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
      tags,
      isPublished,
      status: isPublished ? "published" : "draft"
    };

    onSave(storyData);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onCancel} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-medium">
              {story ? "Edit Story" : "Create New Story"}
            </h1>
            <p className="text-muted-foreground">
              {story ? "Update your story details" : "Start your storytelling journey"}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsPublished(!isPublished)}>
            <Eye className="w-4 h-4 mr-2" />
            {isPublished ? "Published" : "Draft"}
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Story
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Story Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Story Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your story title"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write a compelling description of your story..."
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="genre">Genre</Label>
                <Select value={genre} onValueChange={setGenre}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tags">Add Tags</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="tags"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter tags to help readers find your story"
                  />
                  <Button onClick={handleAddTag} variant="outline" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cover Image */}
          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                {coverImage ? (
                  <ImageWithFallback
                    src={coverImage}
                    alt="Story cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">No cover image</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="cover-url">Cover Image URL</Label>
                <Input
                  id="cover-url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://example.com/cover.jpg"
                  className="mt-1"
                />
              </div>
              
              <Button variant="outline" className="w-full gap-2">
                <Upload className="w-4 h-4" />
                Upload Image
              </Button>
            </CardContent>
          </Card>

          {/* Publishing Status */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status:</span>
                  <Badge variant={isPublished ? "default" : "secondary"}>
                    {isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {isPublished ? (
                    <p>Your story is visible to all readers on StoryVerse.</p>
                  ) : (
                    <p>Your story is saved as a draft and only visible to you.</p>
                  )}
                </div>

                <Button
                  variant={isPublished ? "secondary" : "default"}
                  onClick={() => setIsPublished(!isPublished)}
                  className="w-full"
                >
                  {isPublished ? "Unpublish" : "Publish Story"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Story Stats (if editing existing story) */}
          {story && (
            <Card>
              <CardHeader>
                <CardTitle>Story Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Chapters:</span>
                    <span>{story.chapters.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Views:</span>
                    <span>{story.totalViews.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Likes:</span>
                    <span>{story.totalLikes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Comments:</span>
                    <span>{story.totalComments.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span>{story.createdAt.toLocaleDateString()}</span>
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
