
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardFooter,
} from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MoreVertical, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Edit,
  DollarSign,
  Check,
  User,
  Calendar,
  RotateCcw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock subscription plans
const subscriptionPlans = [
  { id: "free", name: "Free", price: 0, features: ["Limited access to content", "Standard video quality", "Ad-supported"] },
  { id: "premium", name: "Premium", price: 9.99, features: ["Full access to all content", "HD video quality", "Ad-free experience", "Download for offline viewing"] },
  { id: "scholar", name: "Scholar", price: 19.99, features: ["Everything in Premium", "Academic resources", "Primary sources", "Expert commentary", "Research tools"] }
];

// Mock user subscriptions
const userSubscriptions = Array.from({ length: 15 }, (_, i) => ({
  id: `sub-${i+1}`,
  userId: `user-${i+1}`,
  userName: `User ${i+1}`,
  plan: i % 3 === 0 ? "free" : (i % 3 === 1 ? "premium" : "scholar"),
  status: i % 10 === 0 ? "expired" : (i % 5 === 0 ? "pending" : "active"),
  startDate: new Date(Date.now() - (Math.random() * 10000000000)).toISOString().split('T')[0],
  renewalDate: new Date(Date.now() + (Math.random() * 10000000000)).toISOString().split('T')[0],
  lastPayment: i % 10 === 0 ? null : new Date(Date.now() - (Math.random() * 1000000000)).toISOString().split('T')[0],
  paymentMethod: i % 4 === 0 ? "Paypal" : (i % 4 === 1 ? "Credit Card" : (i % 4 === 2 ? "Bank Transfer" : "Mobile Money")),
}));

const AdminSubscriptions = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  
  const itemsPerPage = 10;
  
  // Filter subscriptions
  const filteredSubscriptions = userSubscriptions.filter(subscription => {
    const matchesSearch = 
      subscription.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subscription.userId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || subscription.status === statusFilter;
    const matchesPlan = planFilter === "all" || subscription.plan === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });
  
  // Paginate subscriptions
  const indexOfLastSubscription = currentPage * itemsPerPage;
  const indexOfFirstSubscription = indexOfLastSubscription - itemsPerPage;
  const currentSubscriptions = filteredSubscriptions.slice(indexOfFirstSubscription, indexOfLastSubscription);
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
  
  // Handle subscription actions
  const handleEditSubscription = (subscriptionId: string) => {
    toast({
      title: "Edit Subscription",
      description: `Editing subscription ${subscriptionId}`,
    });
  };
  
  const handleCancelSubscription = (subscriptionId: string) => {
    toast({
      title: "Cancel Subscription",
      description: `Are you sure you want to cancel subscription ${subscriptionId}?`,
      variant: "destructive",
    });
  };
  
  const handleRenewSubscription = (subscriptionId: string) => {
    toast({
      title: "Renew Subscription",
      description: `Subscription ${subscriptionId} has been renewed`,
    });
  };
  
  const handleAddSubscription = () => {
    toast({
      title: "Add Subscription",
      description: "Creating a new subscription",
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>;
      case "expired":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Expired</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "free":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Free</Badge>;
      case "premium":
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">Premium</Badge>;
      case "scholar":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Scholar</Badge>;
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
          <h1 className="text-3xl font-bold">Subscription Management</h1>
          <p className="text-muted-foreground">Manage user subscriptions and plans</p>
        </div>
      </div>
      
      {/* Subscription Plans */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Subscription Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subscriptionPlans.map((plan) => (
            <Card key={plan.id} className="bg-card/50">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">{plan.name}</h3>
                  <Badge variant={plan.id === "free" ? "outline" : (plan.id === "premium" ? "secondary" : "default")}>
                    {plan.id === "free" ? "Free" : `$${plan.price}/mo`}
                  </Badge>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="px-6 py-4 border-t border-border flex justify-between">
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Plan
                </Button>
                {plan.id !== "free" && (
                  <Button variant="outline" size="sm" className="gap-2">
                    <DollarSign className="h-4 w-4" />
                    Pricing
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Filters and Actions */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users..."
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
              <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                <Check className={`h-4 w-4 mr-2 ${statusFilter === "active" ? "opacity-100" : "opacity-0"}`} />
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                <Check className={`h-4 w-4 mr-2 ${statusFilter === "pending" ? "opacity-100" : "opacity-0"}`} />
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("expired")}>
                <Check className={`h-4 w-4 mr-2 ${statusFilter === "expired" ? "opacity-100" : "opacity-0"}`} />
                Expired
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Plan
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setPlanFilter("all")}>
                <Check className={`h-4 w-4 mr-2 ${planFilter === "all" ? "opacity-100" : "opacity-0"}`} />
                All Plans
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPlanFilter("free")}>
                <Check className={`h-4 w-4 mr-2 ${planFilter === "free" ? "opacity-100" : "opacity-0"}`} />
                Free
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPlanFilter("premium")}>
                <Check className={`h-4 w-4 mr-2 ${planFilter === "premium" ? "opacity-100" : "opacity-0"}`} />
                Premium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPlanFilter("scholar")}>
                <Check className={`h-4 w-4 mr-2 ${planFilter === "scholar" ? "opacity-100" : "opacity-0"}`} />
                Scholar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex gap-2">
          <Button className="gap-2" onClick={handleAddSubscription}>
            <Plus className="h-4 w-4" />
            Add Subscription
          </Button>
        </div>
      </div>
      
      {/* Subscriptions Table */}
      <Card className="bg-card/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Plan</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Start Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Renewal Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Payment Method</th>
                  <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentSubscriptions.map(subscription => (
                  <tr key={subscription.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{subscription.userName}</div>
                          <div className="text-xs text-muted-foreground">{subscription.userId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getPlanBadge(subscription.plan)}</td>
                    <td className="py-3 px-4">{getStatusBadge(subscription.status)}</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {subscription.startDate}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {subscription.renewalDate}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{subscription.paymentMethod || '-'}</td>
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
                          <DropdownMenuItem onClick={() => handleEditSubscription(subscription.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {subscription.status === "expired" && (
                            <DropdownMenuItem onClick={() => handleRenewSubscription(subscription.id)}>
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Renew
                            </DropdownMenuItem>
                          )}
                          {subscription.status === "active" && (
                            <DropdownMenuItem 
                              onClick={() => handleCancelSubscription(subscription.id)}
                              className="text-red-500 focus:text-red-500"
                            >
                              <DollarSign className="h-4 w-4 mr-2" />
                              Cancel
                            </DropdownMenuItem>
                          )}
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
            Showing {indexOfFirstSubscription + 1}-{Math.min(indexOfLastSubscription, filteredSubscriptions.length)} of {filteredSubscriptions.length} items
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

export default AdminSubscriptions;
