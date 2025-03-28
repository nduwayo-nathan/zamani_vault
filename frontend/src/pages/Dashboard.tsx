import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Plus, ThumbsUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import UserAnalytics from "@/components/user/UserAnalytics";

// Mock data for African history content
const featuredContent = {
  id: "great-zimbabwe",
  title: "Great Zimbabwe: Africa's Lost City",
  tags: ["Architecture", "Medieval", "Documentary"],
  description: "Discover the magnificent stone structures of Great Zimbabwe, an ancient city built by the Shona civilization between the 11th and 15th centuries. This archaeological site reveals the sophisticated urban culture and trading networks that once flourished in southern Africa.",
  image: "https://images.unsplash.com/photo-1489493512598-d08130f49bea?q=80&w=2070&auto=format&fit=crop",
  poster: "https://images.unsplash.com/photo-1489493512598-d08130f49bea?q=80&w=2070&auto=format&fit=crop",
};

const popularContent = [
  {
    id: "1",
    title: "The Kingdom of Kush: Egypt's Southern Neighbor",
    image: "https://images.unsplash.com/photo-1530653333484-db9c6bfb7b5c?q=80&w=200&h=120&auto=format&fit=crop",
    duration: "45 min",
    progress: 0.7,
    type: "video"
  },
  {
    id: "2",
    title: "Mansa Musa: The Richest Man in History",
    image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=200&h=120&auto=format&fit=crop",
    duration: "38 min",
    progress: 0.3,
    type: "video"
  },
  {
    id: "3",
    title: "The Ancient Libraries of Timbuktu",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=200&h=120&auto=format&fit=crop",
    duration: "220 pages",
    progress: 0,
    type: "book"
  },
  {
    id: "4",
    title: "Queen Nzinga: The Warrior Queen of Ndongo",
    image: "https://images.unsplash.com/photo-1594312915251-48db9280c8f1?q=80&w=200&h=120&auto=format&fit=crop",
    duration: "42 min",
    progress: 0,
    type: "video"
  },
  {
    id: "5",
    title: "The Rock-Hewn Churches of Lalibela",
    image: "https://images.unsplash.com/photo-1563177978-4c05f4281d2a?q=80&w=200&h=120&auto=format&fit=crop",
    duration: "35 min",
    progress: 0,
    type: "video"
  },
  {
    id: "6",
    title: "Songhai Empire: West Africa's Golden Age",
    image: "https://images.unsplash.com/photo-1447023029226-ef8f6b52e3ea?q=80&w=200&h=120&auto=format&fit=crop",
    duration: "168 pages",
    progress: 0,
    type: "book"
  }
];

const categories = [
  { id: "kingdoms", name: "Ancient Kingdoms", emoji: "👑" },
  { id: "figures", name: "Historical Figures", emoji: "👤" },
  { id: "artifacts", name: "Artifacts", emoji: "🏺" },
  { id: "architecture", name: "Architecture", emoji: "🏛️" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("kingdoms");
  const { user } = useAuth();
  
  const handleShowDetails = (id: string) => {
    navigate(`/show/${id}`);
  };

  // Filter content based on subscription
  const getFreeContent = () => popularContent.slice(0, 3);
  const getPremiumContent = () => popularContent.slice(3);

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Section */}
      <section className="relative w-full h-[500px] rounded-2xl overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={featuredContent.poster} 
            alt={featuredContent.title} 
            className="w-full h-full object-cover image-mask-gradient"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent" />
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-end p-8">
          <h1 className="text-6xl font-bold mb-2 tracking-tight">{featuredContent.title}</h1>
          
          <div className="flex gap-2 mb-4">
            {featuredContent.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs font-medium">
                {tag}
              </Badge>
            ))}
          </div>
          
          <p className="text-sm text-muted-foreground mb-6 max-w-xl">
            {featuredContent.description}
          </p>
          
          <div className="flex gap-4">
            <Button 
              className="gap-2 px-6" 
              onClick={() => handleShowDetails(featuredContent.id)}
            >
              <Play className="h-4 w-4" /> Watch Documentary
            </Button>
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" /> Add to Library
            </Button>
          </div>
        </div>
      </section>
      
      {/* User Analytics - Only shown if user is logged in */}
      {user && (
        <section>
          <UserAnalytics />
        </section>
      )}
      
      {/* Categories Section */}
      <section>
        <div className="flex items-center gap-3 mb-6 overflow-x-auto scrollbar-none pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className="gap-2 whitespace-nowrap"
            >
              <span>{category.emoji}</span>
              <span>{category.name}</span>
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {popularContent.map((content) => (
            <Card 
              key={content.id} 
              className="overflow-hidden hover-card-scale bg-card/50"
              onClick={() => handleShowDetails(content.id)}
            >
              <div className="relative aspect-video">
                <img
                  src={content.image}
                  alt={content.title}
                  className="w-full h-full object-cover"
                />
                {content.progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${content.progress * 100}%` }} 
                    />
                  </div>
                )}
                {content.type === "book" && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-black/60 text-white text-[10px]">
                      Book
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <h3 className="text-sm font-medium line-clamp-1">{content.title}</h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">{content.duration}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Free Content Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Free Content</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {getFreeContent().map((content) => (
            <Card 
              key={content.id} 
              className="overflow-hidden hover-card-scale bg-card/50"
              onClick={() => handleShowDetails(content.id)}
            >
              <div className="relative aspect-video">
                <img
                  src={content.image}
                  alt={content.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" className="rounded-full bg-white/20 backdrop-blur-sm">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute top-2 left-2">
                  <Badge variant="default" className="bg-green-600 border-0">
                    Free
                  </Badge>
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="text-sm font-medium line-clamp-1">{content.title}</h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">{content.duration}</span>
                  <span className="text-xs text-muted-foreground">
                    {content.type === "video" ? "Video" : "eBook"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Premium Content Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Premium Content</h2>
          {user?.subscription === 'free' ? (
            <Button variant="default" size="sm" onClick={() => navigate('/user/subscription')}>
              Upgrade to Premium
            </Button>
          ) : (
            <Button variant="outline" size="sm">
              View All
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {getPremiumContent().map((content) => (
            <Card 
              key={content.id} 
              className="overflow-hidden hover-card-scale bg-card/50"
              onClick={() => handleShowDetails(content.id)}
            >
              <div className="relative aspect-video">
                <img
                  src={content.image}
                  alt={content.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" className="rounded-full bg-white/20 backdrop-blur-sm">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="bg-primary border-0">
                    Premium
                  </Badge>
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="text-sm font-medium line-clamp-1">{content.title}</h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">{content.duration}</span>
                  <Badge variant="outline" className="text-[10px] px-1 h-5">
                    {content.type === "video" ? "HD" : "PDF"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Show upgrade card for free users */}
        {user?.subscription === 'free' && (
          <Card className="flex flex-col justify-center items-center p-6 bg-primary/5 border-dashed border-primary/30">
            <h3 className="text-lg font-medium mb-2">Get Premium</h3>
            <p className="text-sm text-center text-muted-foreground mb-4">
              Unlock all premium content and features
            </p>
            <Button 
              variant="default"
              onClick={() => navigate('/user/subscription')}
            >
              View Plans
            </Button>
          </Card>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
