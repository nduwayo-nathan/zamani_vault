
// This file represents a service that would interact with the Django ML backend
// For now, it provides mock data structures and functions

// Interfaces for ML data
interface ContentRecommendation {
  contentId: string;
  score: number;
  reason: string;
}

interface UserInsight {
  category: string;
  interest: number; // 0-100 scale
  trend: 'increasing' | 'decreasing' | 'stable';
}

interface ContentTrend {
  category: string;
  viewCount: number;
  growthRate: number;
  popularity: number; // 0-100 scale
}

interface UserSegment {
  id: string;
  name: string;
  size: number; // Count of users in segment
  topInterests: string[];
  avgSessionDuration: number; // In minutes
}

// Mock ML service interface
export const mlService = {
  // User recommendations based on viewing history
  getUserRecommendations: async (userId: string): Promise<ContentRecommendation[]> => {
    console.log(`Getting recommendations for user ${userId}`);
    // In a real implementation, this would call the Django ML endpoint
    return mockRecommendations;
  },
  
  // User insights for admins
  getUserInsights: async (userId: string): Promise<UserInsight[]> => {
    console.log(`Getting insights for user ${userId}`);
    return mockUserInsights;
  },
  
  // Content trends for admin dashboard
  getContentTrends: async (): Promise<ContentTrend[]> => {
    console.log('Getting content trends');
    return mockContentTrends;
  },
  
  // User segmentation for marketing
  getUserSegments: async (): Promise<UserSegment[]> => {
    console.log('Getting user segments');
    return mockUserSegments;
  },
  
  // Prediction of content performance
  predictContentPerformance: async (contentData: any): Promise<{
    estimatedViews: number;
    targetAudience: string[];
    engagementScore: number;
  }> => {
    console.log('Predicting content performance', contentData);
    return {
      estimatedViews: Math.floor(Math.random() * 10000),
      targetAudience: ['scholars', 'history enthusiasts', 'students'],
      engagementScore: Math.floor(Math.random() * 100)
    };
  }
};

// Mock data for development
const mockRecommendations: ContentRecommendation[] = [
  {
    contentId: '1',
    score: 0.95,
    reason: 'Based on your interest in Ancient Kingdoms'
  },
  {
    contentId: '3',
    score: 0.87,
    reason: 'Users who viewed "Mansa Musa" also enjoyed this'
  },
  {
    contentId: '6',
    score: 0.82,
    reason: 'Matches your reading preferences'
  }
];

const mockUserInsights: UserInsight[] = [
  { category: 'Ancient Kingdoms', interest: 85, trend: 'increasing' },
  { category: 'Historical Figures', interest: 72, trend: 'stable' },
  { category: 'Architecture', interest: 63, trend: 'decreasing' },
  { category: 'Artifacts', interest: 45, trend: 'increasing' }
];

const mockContentTrends: ContentTrend[] = [
  { category: 'Ancient Kingdoms', viewCount: 12500, growthRate: 0.15, popularity: 92 },
  { category: 'Historical Figures', viewCount: 10200, growthRate: 0.08, popularity: 85 },
  { category: 'Architecture', viewCount: 8700, growthRate: 0.05, popularity: 78 },
  { category: 'Artifacts', viewCount: 6300, growthRate: 0.12, popularity: 73 },
  { category: 'Books', viewCount: 4200, growthRate: 0.02, popularity: 65 }
];

const mockUserSegments: UserSegment[] = [
  {
    id: 'segment-1',
    name: 'History Enthusiasts',
    size: 1240,
    topInterests: ['Ancient Kingdoms', 'Historical Figures'],
    avgSessionDuration: 25.3
  },
  {
    id: 'segment-2',
    name: 'Academic Researchers',
    size: 850,
    topInterests: ['Primary Sources', 'Archaeological Findings'],
    avgSessionDuration: 42.7
  },
  {
    id: 'segment-3',
    name: 'Casual Learners',
    size: 3200,
    topInterests: ['Video Content', 'Famous Stories'],
    avgSessionDuration: 15.1
  },
  {
    id: 'segment-4',
    name: 'Educators',
    size: 780,
    topInterests: ['Educational Materials', 'Timelines'],
    avgSessionDuration: 35.8
  }
];

export default mlService;
