
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Film,
  TrendingUp,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Clock,
  Eye,
  Download,
} from "lucide-react";
import { LineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data for analytics
const viewsData = [
  { name: "Jan", views: 4000 },
  { name: "Feb", views: 3000 },
  { name: "Mar", views: 5000 },
  { name: "Apr", views: 7000 },
  { name: "May", views: 6000 },
  { name: "Jun", views: 8000 },
  { name: "Jul", views: 10000 },
  { name: "Aug", views: 9000 },
  { name: "Sep", views: 11000 },
  { name: "Oct", views: 13000 },
  { name: "Nov", views: 15000 },
  { name: "Dec", views: 14000 },
];

const deviceData = [
  { name: "Mobile", value: 45 },
  { name: "Desktop", value: 35 },
  { name: "Tablet", value: 15 },
  { name: "TV", value: 5 },
];

const contentPerformance = [
  { title: "Arcane", views: 152000, change: 12.5, trending: true },
  { title: "The Witcher", views: 124000, change: 8.3, trending: true },
  { title: "Stranger Things", views: 98000, change: -2.1, trending: false },
  { title: "Money Heist", views: 87000, change: 5.6, trending: true },
  { title: "Squid Game", views: 72000, change: -4.8, trending: false },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="space-x-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button>Refresh Data</Button>
        </div>
      </div>

      {/* Stats Overview */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Users</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">24,781</h3>
                  <Badge variant="outline" className="text-xs font-normal bg-green-500/10 text-green-500 border-green-500/20">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    12%
                  </Badge>
                </div>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">+2,540 this month</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Content Views</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">2.4M</h3>
                  <Badge variant="outline" className="text-xs font-normal bg-green-500/10 text-green-500 border-green-500/20">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    8.7%
                  </Badge>
                </div>
              </div>
              <div className="p-2 bg-indigo-500/10 rounded-full">
                <Eye className="h-5 w-5 text-indigo-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">+360K this week</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Watch Time</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">1.2M hrs</h3>
                  <Badge variant="outline" className="text-xs font-normal bg-green-500/10 text-green-500 border-green-500/20">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    5.3%
                  </Badge>
                </div>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Avg 2.5 hrs per user</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Revenue</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">$348.5K</h3>
                  <Badge variant="outline" className="text-xs font-normal bg-red-500/10 text-red-500 border-red-500/20">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    2.1%
                  </Badge>
                </div>
              </div>
              <div className="p-2 bg-green-500/10 rounded-full">
                <BarChart3 className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">$274.5K from subscriptions</p>
          </CardContent>
        </Card>
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle>Views & Engagement</CardTitle>
            <CardDescription>Platform engagement over the last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="views">
              <TabsList className="mb-4">
                <TabsTrigger value="views">Views</TabsTrigger>
                <TabsTrigger value="watch-time">Watch Time</TabsTrigger>
                <TabsTrigger value="users">Active Users</TabsTrigger>
              </TabsList>
              <TabsContent value="views" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={viewsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsla(var(--border)/0.3)" />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false}
                      axisLine={{ stroke: 'hsla(var(--border)/0.5)' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false}
                      axisLine={{ stroke: 'hsla(var(--border)/0.5)' }}
                      tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                      }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                      labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2} 
                      dot={{ strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="watch-time" className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Watch time data will be shown here</p>
              </TabsContent>
              <TabsContent value="users" className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Active users data will be shown here</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle>Device Distribution</CardTitle>
            <CardDescription>User device preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={deviceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsla(var(--border)/0.3)" horizontal={false} />
                  <XAxis 
                    type="number"
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={{ stroke: 'hsla(var(--border)/0.5)' }}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category"
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={{ stroke: 'hsla(var(--border)/0.5)' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                    formatter={(value: number) => [`${value}%`, 'Usage']}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="hsl(var(--primary))"
                    radius={[0, 4, 4, 0]}
                    barSize={30}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Content Performance */}
      <section>
        <Card className="bg-card/50">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Content Performance</CardTitle>
                <CardDescription>Top performing content across the platform</CardDescription>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium">Title</th>
                    <th className="text-left py-3 px-4 text-sm font-medium">Views</th>
                    <th className="text-left py-3 px-4 text-sm font-medium">Change</th>
                    <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contentPerformance.map((content, index) => (
                    <tr key={index} className="border-b border-border">
                      <td className="py-3 px-4 text-sm font-medium">{content.title}</td>
                      <td className="py-3 px-4 text-sm">{(content.views / 1000).toFixed(1)}K</td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex items-center">
                          {content.change > 0 ? (
                            <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                          )}
                          <span className={content.change > 0 ? "text-green-500" : "text-red-500"}>
                            {Math.abs(content.change)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {content.trending ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-muted/50">
                            <Activity className="h-3 w-3 mr-1" />
                            Stable
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-right">
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Access */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Manage users, permissions, and subscriptions</p>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/admin/users">View Users</a>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Film className="h-5 w-5" />
              Content Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Manage shows, movies, and episodes</p>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/admin/content">View Content</a>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Detailed Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">In-depth platform analytics and reports</p>
            <Button variant="outline" className="w-full justify-start">
              View Reports
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AdminDashboard;
