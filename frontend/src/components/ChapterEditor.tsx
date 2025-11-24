import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  FileText,
  Clock,
  BookOpen,
  Type
} from "lucide-react";
import { UserStory, Chapter } from "../data/userStories";

interface ChapterEditorProps {
  story: UserStory;
  chapter: Chapter | null;
  onSave: (chapterData: Partial<Chapter>) => void;
  onCancel: () => void;
}

export function ChapterEditor({ story, chapter, onSave, onCancel }: ChapterEditorProps) {
  const [title, setTitle] = useState(chapter?.title || "");
  const [content, setContent] = useState(chapter?.content || "");
  const [isPublished, setIsPublished] = useState(chapter?.isPublished || false);

  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
  const estimatedReadTime = Math.ceil(wordCount / 200); // Average reading speed

  const handleSave = () => {
    if (!title.trim()) {
      alert("Please enter a title for your chapter.");
      return;
    }

    if (!content.trim()) {
      alert("Please write some content for your chapter.");
      return;
    }

    const chapterData: Partial<Chapter> = {
      title: title.trim(),
      content: content.trim(),
      wordCount,
      isPublished
    };

    onSave(chapterData);
  };

  const handleAutoSave = () => {
    // In a real app, this would save as draft automatically
    console.log("Auto-saving chapter...");
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    if (content.trim() || title.trim()) {
      const timer = setInterval(handleAutoSave, 30000);
      return () => clearInterval(timer);
    }
  }, [content, title]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onCancel} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Story
          </Button>
          <div>
            <h1 className="text-2xl font-medium">
              {chapter ? "Edit Chapter" : "New Chapter"}
            </h1>
            <p className="text-muted-foreground">
              {story.title} • Chapter {story.chapters.length + (chapter ? 0 : 1)}
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
            Save Chapter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-3 space-y-6">
          {/* Chapter Title */}
          <Card>
            <CardContent className="p-6">
              <div>
                <Label htmlFor="title">Chapter Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter chapter title"
                  className="mt-1 text-xl"
                />
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Chapter Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your chapter here..."
                rows={25}
                className="min-h-[600px] text-base leading-relaxed"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Writing Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Writing Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Words</span>
                </div>
                <span className="font-medium">{wordCount.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Read time</span>
                </div>
                <span className="font-medium">{estimatedReadTime} min</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">Status</span>
                </div>
                <Badge variant={isPublished ? "default" : "secondary"}>
                  {isPublished ? "Published" : "Draft"}
                </Badge>
              </div>

              {chapter && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-orange-600" />
                      <span className="text-sm">Views</span>
                    </div>
                    <span className="font-medium">{chapter.views.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Likes</span>
                    <span className="font-medium">{chapter.likes.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Comments</span>
                    <span className="font-medium">{chapter.comments.toLocaleString()}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Publishing */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {isPublished ? (
                  <p>This chapter is visible to all readers who have access to your story.</p>
                ) : (
                  <p>This chapter is saved as a draft and only visible to you.</p>
                )}
              </div>

              <Button
                variant={isPublished ? "secondary" : "default"}
                onClick={() => setIsPublished(!isPublished)}
                className="w-full"
              >
                {isPublished ? "Unpublish Chapter" : "Publish Chapter"}
              </Button>

              <div className="pt-2 border-t text-xs text-muted-foreground">
                <p>Auto-save: Every 30 seconds</p>
                <p>Last saved: Just now</p>
              </div>
            </CardContent>
          </Card>

          {/* Story Context */}
          <Card>
            <CardHeader>
              <CardTitle>Story Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{story.title}</p>
                <p className="text-sm text-muted-foreground">{story.genre}</p>
              </div>
              
              <div className="text-sm">
                <div className="flex justify-between">
                  <span>Total chapters:</span>
                  <span>{story.chapters.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Story views:</span>
                  <span>{story.totalViews.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Story likes:</span>
                  <span>{story.totalLikes.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Writing Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Writing Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Aim for 1,500-3,000 words per chapter</p>
              <p>• End with a cliffhanger to keep readers engaged</p>
              <p>• Use descriptive language to paint vivid scenes</p>
              <p>• Keep dialogue natural and character-specific</p>
              <p>• Review and edit before publishing</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}