
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ChevronLeft, 
  Play, 
  Plus, 
  ThumbsUp, 
  ThumbsDown, 
  Share,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

// Mock data
const showDetails = {
  id: "arcane",
  title: "Arcane",
  tags: ["Fantasy", "League of Legends", "Netflix"],
  seasons: 1,
  year: 2021,
  rating: "16+",
  matches: "98% Match",
  description: "The animated series is based on the video game League of Legends. The series is set in Piltover and Zaun around the time of the current events of the Runeterra world. At the center of the plot of 'Arcane' is the story of the sisters Vi and Powder. Left without their parents, the girls grow up in the smoke-soaked slums of Zaun and harbor hatred for the wealthy citizens of sunny Piltover, who have taken away their dearest possessions.",
  cast: [
    { name: "Hailee Steinfeld", character: "Vi", image: "https://randomuser.me/api/portraits/women/1.jpg" },
    { name: "Ella Purnell", character: "Jinx", image: "https://randomuser.me/api/portraits/women/2.jpg" },
    { name: "Kevin Alejandro", character: "Jayce", image: "https://randomuser.me/api/portraits/men/1.jpg" },
    { name: "Katie Leung", character: "Caitlyn", image: "https://randomuser.me/api/portraits/women/3.jpg" },
  ],
  creators: ["Christian Linke", "Alex Yee"],
  image: "/lovable-uploads/0b3ca943-d2ab-4e06-8fe6-99e4123cf894.png",
  banner: "/lovable-uploads/0b3ca943-d2ab-4e06-8fe6-99e4123cf894.png",
};

const episodes = [
  {
    id: "1",
    number: 1,
    title: "Welcome to the Playground",
    duration: "43 min",
    thumbnail: "https://images.unsplash.com/photo-1627873649417-c67f701f1949?q=80&w=200&h=120&auto=format&fit=crop",
    description: "Orphaned sisters Vi and Powder bring trouble to Zaun's underground streets in the wake of a heist in the privileged city of Piltover.",
    watched: true,
  },
  {
    id: "2",
    number: 2,
    title: "Some Mysteries Are Better Left Unsolved",
    duration: "40 min",
    thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=200&h=120&auto=format&fit=crop",
    description: "Idealistic inventor Jayce attempts to harness magic through science despite his mentor's warnings. Criminal kingpin Silco tests a powerful substance.",
    watched: true,
  },
  {
    id: "3",
    number: 3,
    title: "The Base Violence Necessary for Change",
    duration: "44 min",
    thumbnail: "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?q=80&w=200&h=120&auto=format&fit=crop",
    description: "An epic battle between old rivals results in a fateful moment for Zaun. Jayce and Viktor risk it all for their research.",
    watched: false,
  },
  {
    id: "4",
    number: 4,
    title: "Happy Progress Day!",
    duration: "40 min",
    thumbnail: "https://images.unsplash.com/photo-1533421644343-80948c468487?q=80&w=200&h=120&auto=format&fit=crop",
    description: "A Zaunite gang's brazen daytime heist of a Piltover lab takes a dire turn. Silco resorts to desperate measures to revive an unconscious Jinx.",
    watched: false,
  },
  {
    id: "5",
    number: 5,
    title: "Everybody Wants to Be My Enemy",
    duration: "40 min",
    thumbnail: "https://images.unsplash.com/photo-1606242403117-4087b85a2da7?q=80&w=200&h=120&auto=format&fit=crop",
    description: "Caitlyn's search for Zaun's secret weapon leads her to Vi and a surly street fighter. Viktor makes a surprising discovery.",
    watched: false,
  },
  {
    id: "6",
    number: 6,
    title: "When These Walls Come Tumbling Down",
    duration: "42 min",
    thumbnail: "https://images.unsplash.com/photo-1626128665085-483747621778?q=80&w=200&h=120&auto=format&fit=crop",
    description: "Caitlyn and Vi meet an ally in Zaun's Firelights. Viktor opposes Jayce's proposal for a council vote. Jinx weaves a deadly web.",
    watched: false,
  },
];

const reviews = [
  {
    id: 1,
    author: "Jane Doe",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    date: "November 15, 2023",
    content: "Arcane is a visual masterpiece with deep characters and a compelling story. The animation is groundbreaking, and the world-building is exceptional."
  },
  {
    id: 2,
    author: "John Smith",
    avatar: "https://randomuser.me/api/portraits/men/42.jpg",
    rating: 4,
    date: "October 30, 2023",
    content: "As someone who never played League of Legends, I was pleasantly surprised. The show stands on its own with gorgeous animation and interesting characters."
  },
  {
    id: 3,
    author: "Alex Johnson",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    rating: 5,
    date: "December 1, 2023",
    content: "A perfect blend of action, emotion, and stunning visuals. The story is well-paced and the character development is top-notch."
  }
];

const ShowDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("episodes");
  
  const [selectedSeason, setSelectedSeason] = useState("Season 1");
  const seasons = ["Season 1"];
  
  // Find the current episode based on watched status
  const currentEpisode = episodes.find(ep => !ep.watched) || episodes[0];
  
  return (
    <div className="space-y-8 pb-10">
      {/* Back button */}
      <Button variant="ghost" className="gap-1" asChild>
        <Link to="/">
          <ChevronLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>
      </Button>
      
      {/* Hero Section */}
      <section className="relative w-full h-[500px] rounded-2xl overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={showDetails.banner} 
            alt={showDetails.title} 
            className="w-full h-full object-cover image-mask-gradient"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent" />
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-end p-8">
          <h1 className="text-6xl font-bold mb-2 tracking-tight">{showDetails.title}</h1>
          
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary" className="text-xs font-medium">
              {showDetails.matches}
            </Badge>
            <span className="text-sm text-muted-foreground">{showDetails.year}</span>
            <Badge variant="outline" className="text-xs font-medium">
              {showDetails.rating}
            </Badge>
            <span className="text-sm text-muted-foreground">{showDetails.seasons} Season</span>
          </div>

          <div className="flex gap-2 mb-4">
            {showDetails.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs font-medium">
                {tag}
              </Badge>
            ))}
          </div>
          
          <p className="text-sm text-muted-foreground mb-6 max-w-xl">
            {showDetails.description}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              className="gap-2 px-6"
            >
              <Play className="h-4 w-4" /> Play
            </Button>
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" /> My List
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ThumbsDown className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Current Episode Preview */}
      <section className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-4">Continue Watching</h2>
          <Card className="overflow-hidden bg-card/50">
            <div className="relative aspect-video">
              <img
                src={currentEpisode.thumbnail}
                alt={currentEpisode.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button size="lg" variant="ghost" className="rounded-full bg-white/20 backdrop-blur-sm">
                  <Play className="h-5 w-5" />
                </Button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1">
                <Progress value={30} className="h-1" />
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">
                    {currentEpisode.number}. {currentEpisode.title}
                  </h3>
                  <span className="text-sm text-muted-foreground">{currentEpisode.duration}</span>
                </div>
                <Button size="sm" variant="ghost" className="gap-1">
                  <Clock className="h-3 w-3" />
                  <span className="text-xs">Watch Later</span>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {currentEpisode.description}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-80 lg:w-96">
          <h2 className="text-xl font-bold mb-4">Details</h2>
          <Card className="bg-card/50">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Cast</h3>
                  <div className="flex flex-wrap gap-3">
                    {showDetails.cast.map((person) => (
                      <div key={person.name} className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={person.image} alt={person.name} />
                          <AvatarFallback>{person.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{person.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Creators</h3>
                  <div className="flex flex-wrap gap-2">
                    {showDetails.creators.map((creator) => (
                      <span key={creator} className="text-sm">{creator}</span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {showDetails.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Episodes and Reviews Tabs */}
      <section>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="episodes" className="flex-1 sm:flex-none">Episodes</TabsTrigger>
            <TabsTrigger value="trailers" className="flex-1 sm:flex-none">Trailers & More</TabsTrigger>
            <TabsTrigger value="similar" className="flex-1 sm:flex-none">Similar</TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1 sm:flex-none">Reviews</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="episodes">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Episodes</h2>
                <select 
                  value={selectedSeason} 
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="bg-secondary text-secondary-foreground rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {seasons.map((season) => (
                    <option key={season} value={season}>{season}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-4">
                {episodes.map((episode) => (
                  <Card key={episode.id} className="overflow-hidden bg-card/50 hover:bg-card/80 transition-colors">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-48 relative">
                        <img
                          src={episode.thumbnail}
                          alt={episode.title}
                          className="w-full h-full object-cover sm:h-28"
                        />
                        {episode.watched && (
                          <div className="absolute bottom-2 right-2">
                            <Badge variant="secondary" className="text-[10px]">Watched</Badge>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4 flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h3 className="font-semibold">
                              {episode.number}. {episode.title}
                            </h3>
                            <span className="text-sm text-muted-foreground">{episode.duration}</span>
                          </div>
                          <Button size="sm" variant="ghost" className="rounded-full" aria-label="Play">
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {episode.description}
                        </p>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="trailers">
              <div className="flex items-center justify-center h-40 rounded-lg bg-card/50">
                <p className="text-muted-foreground">No trailers available at this moment</p>
              </div>
            </TabsContent>
            
            <TabsContent value="similar">
              <div className="flex items-center justify-center h-40 rounded-lg bg-card/50">
                <p className="text-muted-foreground">Similar shows will appear here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews">
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} className="bg-card/50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.avatar} alt={review.author} />
                          <AvatarFallback>{review.author[0]}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium">{review.author}</h3>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`} 
                                />
                              ))}
                            </div>
                          </div>
                          
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                          
                          <p className="text-sm mt-2">
                            {review.content}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </section>
    </div>
  );
};

// Star icon component
const Star = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default ShowDetails;
