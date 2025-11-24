import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  ArrowLeft, 
  Eye, 
  Heart, 
  MessageCircle,
  TrendingUp,
  Users,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  BarChart3,
  Calendar,
  Target
} from "lucide-react";
import { UserStory } from "../data/userStories";
import { mockAnalytics } from "../data/userStories";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface StoryAnalyticsProps {
  story: UserStory;
  onBack: () => void;
}

export function StoryAnalytics({ story, onBack }: StoryAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");
  
  // Get analytics data (in a real app, this would come from your backend)
  const analytics = mockAnalytics[story.id] || {
    storyId: story.id,
    dailyViews: [],
    weeklyViews: [],
    monthlyViews: [],
    readerDemographics: {
      ageGroups: [],
      countries: [],
      devices: []
    },
    engagement: {
      averageReadingTime: 0,
      completionRate: 0,
      bookmarkRate: 0,
      shareRate: 0
    }
  };

  const getChartData = () => {
    switch (timeRange) {
      case "week":
        return analytics.dailyViews.slice(-7);
      case "month":
        return analytics.dailyViews.slice(-30);
      case "year":
        return analytics.monthlyViews;
      default:
        return analytics.monthlyViews;
    }
  };

  const chartData = getChartData();

  // Color schemes for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const deviceIcons = {
    Mobile: Smartphone,
    Desktop: Monitor,
    Tablet: Tablet
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Stories
          </Button>
          <div>
            <h1 className="text-2xl font-medium">Story Analytics</h1>
            <p className="text-muted-foreground">{story.title}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={timeRange === "week" ? "default" : "outline"}
            onClick={() => setTimeRange("week")}
            size="sm"
          >
            Week
          </Button>
          <Button
            variant={timeRange === "month" ? "default" : "outline"}
            onClick={() => setTimeRange("month")}
            size="sm"
          >
            Month
          </Button>
          <Button
            variant={timeRange === "year" ? "default" : "outline"}
            onClick={() => setTimeRange("year")}
            size="sm"
          >
            Year
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-medium">{story.totalViews.toLocaleString()}</p>
                <p className="text-xs text-green-600">+12% this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Heart className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Likes</p>
                <p className="text-2xl font-medium">{story.totalLikes.toLocaleString()}</p>
                <p className="text-xs text-green-600">+8% this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Comments</p>
                <p className="text-2xl font-medium">{story.totalComments.toLocaleString()}</p>
                <p className="text-xs text-green-600">+15% this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Engagement</p>
                <p className="text-2xl font-medium">{analytics.engagement.completionRate}%</p>
                <p className="text-xs text-green-600">+5% this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="readers">Readers</TabsTrigger>
          <TabsTrigger value="chapters">Chapters</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Views Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Views Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={timeRange === "year" ? "month" : "date"} />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="views" stroke="#8884d8" fill="#8884d8" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Engagement Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Avg. Reading Time</span>
                </div>
                <p className="text-2xl font-medium">{analytics.engagement.averageReadingTime} min</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Completion Rate</span>
                </div>
                <p className="text-2xl font-medium">{analytics.engagement.completionRate}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium">Bookmark Rate</span>
                </div>
                <p className="text-2xl font-medium">{analytics.engagement.bookmarkRate}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Share Rate</span>
                </div>
                <p className="text-2xl font-medium">{analytics.engagement.shareRate}%</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="readers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Age Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>Age Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={analytics.readerDemographics.ageGroups}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="percentage"
                    >
                      {analytics.readerDemographics.ageGroups.map((entry, index) => (
                        <Cell key={`age-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {analytics.readerDemographics.ageGroups.map((group, index) => (
                    <div key={group.range} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span>{group.range}</span>
                      </div>
                      <span>{group.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Countries */}
            <Card>
              <CardHeader>
                <CardTitle>Top Countries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analytics.readerDemographics.countries.map((country, index) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{country.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${country.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{country.percentage}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Devices */}
            <Card>
              <CardHeader>
                <CardTitle>Reading Devices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analytics.readerDemographics.devices.map((device) => {
                  const Icon = deviceIcons[device.device as keyof typeof deviceIcons] || Monitor;
                  return (
                    <div key={device.device} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{device.device}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${device.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{device.percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chapters" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chapter Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {story.chapters.map((chapter, index) => (
                  <div key={chapter.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">Ch. {index + 1}</span>
                        <h4 className="font-medium">{chapter.title}</h4>
                        {!chapter.isPublished && (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {chapter.wordCount.toLocaleString()} words
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{chapter.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{chapter.likes.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{chapter.comments.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Reader Engagement Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={timeRange === "year" ? "month" : "date"} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Average Reading Time</span>
                      <span>{analytics.engagement.averageReadingTime} minutes</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(analytics.engagement.averageReadingTime / 15) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span>{analytics.engagement.completionRate}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${analytics.engagement.completionRate}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Bookmark Rate</span>
                      <span>{analytics.engagement.bookmarkRate}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full"
                        style={{ width: `${analytics.engagement.bookmarkRate}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Share Rate</span>
                      <span>{analytics.engagement.shareRate}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${analytics.engagement.shareRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}