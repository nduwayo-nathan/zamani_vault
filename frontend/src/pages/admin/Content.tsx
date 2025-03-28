
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MoreVertical, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Edit,
  Trash,
  Eye,
  Film,
  Tv,
  Clock,
  Play,
  Tag,
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock content data
const shows = Array.from({ length: 15 }, (_, i) => ({
  id: `show-${i+1}`,
  title: `TV Show ${i+1}`,
  type: "series",
  seasons: Math.floor(Math.random() * 5) + 1,
  episodes: Math.floor(Math.random() * 20) + 5,
  releaseYear: 2015 + Math.floor(Math.random() * 8),
  status: i % 10 === 0 ? "draft" : (i % 5 === 0 ? "archived" : "published"),
  genre: i % 3 === 0 ? "Drama" : (i % 3 === 1 ? "Comedy" : "Action"),
  rating: (Math.random() * 2 + 3).toFixed(1),
  thumbnail: "https://images.unsplash.com/photo-1585951237318-9ea5e175b891?q=80&w=120&h=80&auto=format&fit=crop",
  lastUpdated: new Date(Date.now() - (Math.random() * 10000000000)).toISOString().split('T')[0],
}));

const movies = Array.from({ length: 10 }, (_, i) => ({
  id: `movie-${i+1}`,
  title: `Movie ${i+1}`,
  type: "movie",
  duration: `${Math.floor(Math.random() * 60) + 90} min`,
  releaseYear: 2015 + Math.floor(Math.random() * 8),
  status: i % 10 === 0 ? "draft" : (i % 5 === 0 ? "archived" : "published"),
  genre: i % 3 === 0 ? "Action" : (i % 3 === 1 ? "Thriller" : "Comedy"),
  rating: (Math.random() * 2 + 3).toFixed(1),
  thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=120&h=80&auto=format&fit=crop",
  lastUpdated: new Date(Date.now() - (Math.random() * 10000000000)).toISOString().split('T')[0],
}));

const AdminContent = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  
  const itemsPerPage = 10;
  
  // Get content based on active tab
  const getContent = () => {
    if (activeTab === "movies") return movies;
    if (activeTab === "series") return shows;
    return [...shows, ...movies];
  };
  
  // Filter content based on search query and filters
  const filteredContent = getContent().filter(content => {
    const matchesSearch = 
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.genre.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || content.status === statusFilter;
    const matchesGenre = genreFilter === "all" || content.genre === genreFilter;
    
    return matchesSearch && matchesStatus && matchesGenre;
  });
  
  // Paginate content
  const indexOfLastContent = currentPage * itemsPerPage;
  const indexOfFirstContent = indexOfLastContent - itemsPerPage;
  const currentContent = filteredContent.slice(indexOfFirstContent, indexOfLastContent);
  const totalPages = Math.ceil(filteredContent.length / itemsPerPage);
  
  // Get unique genres
  const uniqueGenres = Array.from(
    new Set([...shows, ...movies].map(content => content.genre))
  );
  
  // Handle content actions
  const handleEditContent = (contentId: string) => {
    toast({
      title: "Edit Content",
      description: `Editing content ${contentId}`,
    });
  };
  
  const handleDeleteContent = (contentId: string) => {
    toast({
      title: "Delete Content",
      description: `Are you sure you want to delete content ${contentId}?`,
      variant: "destructive",
    });
  };
  
  const handleViewContent = (contentId: string) => {
    navigate(`/show/${contentId}`);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Published</Badge>;
      case "draft":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Draft</Badge>;
      case "archived":
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">Archived</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center">
        <Button variant="ghost" className="mr-2" onClick={() => navigate("/admin")}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">Manage movies, TV shows, and episodes</p>
        </div>
      </div>
      
      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            All Content
          </TabsTrigger>
          <TabsTrigger value="movies" className="flex items-center gap-2">
            <Film className="h-4 w-4" />
            Movies
          </TabsTrigger>
          <TabsTrigger value="series" className="flex items-center gap-2">
            <Tv className="h-4 w-4" />
            TV Shows
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Filters and Actions */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search content..."
              className="pl-10 w-[250px] bg-background/50"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                <Check className={`h-4 w-4 mr-2 ${statusFilter === "all" ? "opacity-100" : "opacity-0"}`} />
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("published")}>
                <Check className={`h-4 w-4 mr-2 ${statusFilter === "published" ? "opacity-100" : "opacity-0"}`} />
                Published
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("draft")}>
                <Check className={`h-4 w-4 mr-2 ${statusFilter === "draft" ? "opacity-100" : "opacity-0"}`} />
                Draft
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("archived")}>
                <Check className={`h-4 w-4 mr-2 ${statusFilter === "archived" ? "opacity-100" : "opacity-0"}`} />
                Archived
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Tag className="h-4 w-4" />
                Genre
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setGenreFilter("all")}>
                <Check className={`h-4 w-4 mr-2 ${genreFilter === "all" ? "opacity-100" : "opacity-0"}`} />
                All
              </DropdownMenuItem>
              {uniqueGenres.map((genre) => (
                <DropdownMenuItem key={genre} onClick={() => setGenreFilter(genre)}>
                  <Check className={`h-4 w-4 mr-2 ${genreFilter === genre ? "opacity-100" : "opacity-0"}`} />
                  {genre}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Content
          </Button>
        </div>
      </div>
      
      {/* Content Table */}
      <Card className="bg-card/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium">Title</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Genre</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Year</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Rating</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Last Updated</th>
                  <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentContent.map(content => (
                  <tr key={content.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={content.thumbnail} 
                            alt={content.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="font-medium">{content.title}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {content.type === "movie" ? (
                          <>
                            <Film className="h-4 w-4 text-primary" />
                            <span className="text-sm">Movie</span>
                          </>
                        ) : (
                          <>
                            <Tv className="h-4 w-4 text-indigo-500" />
                            <span className="text-sm">TV Show</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(content.status)}</td>
                    <td className="py-3 px-4 text-sm">{content.genre}</td>
                    <td className="py-3 px-4 text-sm">{content.releaseYear}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm">{content.rating}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{content.lastUpdated}</td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditContent(content.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewContent(content.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {content.type === "series" && (
                            <DropdownMenuItem>
                              <Film className="h-4 w-4 mr-2" />
                              Manage Episodes
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteContent(content.id)}
                            className="text-red-500 focus:text-red-500"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="py-4 border-t border-border flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstContent + 1}-{Math.min(indexOfLastContent, filteredContent.length)} of {filteredContent.length} items
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">{currentPage} / {totalPages || 1}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
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

export default AdminContent;
