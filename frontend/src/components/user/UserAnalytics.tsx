
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus, BarChart3, PieChart, LineChart, RefreshCw } from 'lucide-react';
import mlService from '@/services/mlService';
import { useAuth } from '@/contexts/AuthContext';

const UserAnalytics = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("interests");

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // In a real app, these would fetch from the actual ML service through Django
        const userInsights = await mlService.getUserInsights(user.id);
        const userRecommendations = await mlService.getUserRecommendations(user.id);
        
        setInsights(userInsights);
        setRecommendations(userRecommendations);
      } catch (error) {
        console.error("Error loading user analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Interests</CardTitle>
            <CardDescription>
              Personalized insights based on your viewing history
            </CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={() => setIsLoading(true)} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="interests" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Your Interests</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              <span>Recommendations</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent>
          <TabsContent value="interests" className="space-y-4 mt-2">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {insights.map((insight) => (
                    <div key={insight.category} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{insight.category}</span>
                          {getTrendIcon(insight.trend)}
                        </div>
                        <span className="text-sm font-medium">{insight.interest}%</span>
                      </div>
                      <Progress value={insight.interest} className="h-2" />
                    </div>
                  ))}
                </div>
                
                <div className="pt-4">
                  <h4 className="text-sm font-medium mb-3">Interest Breakdown</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={insights}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="category" 
                        tick={{fontSize: 12}}
                        tickFormatter={(value) => value.substring(0, 3)}
                        className="text-xs" 
                      />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'var(--background)',
                          borderColor: 'var(--border)',
                          borderRadius: '0.5rem',
                        }}
                      />
                      <Bar dataKey="interest" fill="var(--primary)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-4 mt-2">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4">
                  {recommendations.map((rec) => (
                    <div key={rec.contentId} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Content #{rec.contentId}</span>
                          <Badge variant="outline" className="text-xs">
                            {(rec.score * 100).toFixed(0)}% match
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{rec.reason}</p>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center pt-2">
                  <Button variant="outline" size="sm">
                    See more recommendations
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default UserAnalytics;
