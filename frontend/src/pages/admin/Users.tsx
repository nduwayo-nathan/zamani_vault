
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MoreVertical, 
  UserPlus, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  Edit,
  Trash,
  Ban,
  Mail,
  Shield,
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock user data
const users = Array.from({ length: 20 }, (_, i) => ({
  id: `user-${i+1}`,
  name: `User ${i+1}`,
  email: `user${i+1}@example.com`,
  username: `user${i+1}`,
  status: i % 10 === 0 ? "suspended" : (i % 5 === 0 ? "pending" : "active"),
  plan: i % 3 === 0 ? "premium" : (i % 3 === 1 ? "standard" : "basic"),
  createdAt: new Date(Date.now() - (Math.random() * 10000000000)).toISOString().split('T')[0],
  lastLogin: i % 4 === 0 ? "Never" : new Date(Date.now() - (Math.random() * 1000000000)).toISOString().split('T')[0],
}));

const AdminUsers = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  
  const itemsPerPage = 10;
  
  // Filter users based on search query and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesPlan = planFilter === "all" || user.plan === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });
  
  // Paginate users
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  
  // Handle user actions
  const handleEditUser = (userId: string) => {
    toast({
      title: "Edit User",
      description: `Editing user ${userId}`,
    });
  };
  
  const handleDeleteUser = (userId: string) => {
    toast({
      title: "Delete User",
      description: `Are you sure you want to delete user ${userId}?`,
      variant: "destructive",
    });
  };
  
  const handleSuspendUser = (userId: string) => {
    toast({
      title: "Suspend User",
      description: `User ${userId} has been suspended.`,
    });
  };
  
  const handleActivateUser = (userId: string) => {
    toast({
      title: "Activate User",
      description: `User ${userId} has been activated.`,
    });
  };
  
  const handleChangeRole = (userId: string) => {
    toast({
      title: "Change Role",
      description: `Changed role for user ${userId}.`,
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>;
      case "suspended":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Suspended</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "premium":
        return <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20">Premium</Badge>;
      case "standard":
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Standard</Badge>;
      case "basic":
        return <Badge variant="secondary" className="bg-gray-500/10 text-gray-500 border-gray-500/20">Basic</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
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
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage users, subscriptions, and permissions</p>
        </div>
      </div>
      
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
              <DropdownMenuItem onClick={() => setStatusFilter("suspended")}>
                <Check className={`h-4 w-4 mr-2 ${statusFilter === "suspended" ? "opacity-100" : "opacity-0"}`} />
                Suspended
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                <Check className={`h-4 w-4 mr-2 ${statusFilter === "pending" ? "opacity-100" : "opacity-0"}`} />
                Pending
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
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPlanFilter("premium")}>
                <Check className={`h-4 w-4 mr-2 ${planFilter === "premium" ? "opacity-100" : "opacity-0"}`} />
                Premium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPlanFilter("standard")}>
                <Check className={`h-4 w-4 mr-2 ${planFilter === "standard" ? "opacity-100" : "opacity-0"}`} />
                Standard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPlanFilter("basic")}>
                <Check className={`h-4 w-4 mr-2 ${planFilter === "basic" ? "opacity-100" : "opacity-0"}`} />
                Basic
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>
      
      {/* Users Table */}
      <Card className="bg-card/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Plan</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Created</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Last Login</th>
                  <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map(user => (
                  <tr key={user.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium">{user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(user.status)}</td>
                    <td className="py-3 px-4">{getPlanBadge(user.plan)}</td>
                    <td className="py-3 px-4 text-sm">{user.createdAt}</td>
                    <td className="py-3 px-4 text-sm">{user.lastLogin}</td>
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
                          <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/user/profile?id=${user.id}`)}>
                            <Shield className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status === "active" ? (
                            <DropdownMenuItem onClick={() => handleSuspendUser(user.id)}>
                              <Ban className="h-4 w-4 mr-2" />
                              Suspend
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleActivateUser(user.id)}>
                              <Check className="h-4 w-4 mr-2" />
                              Activate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleDeleteUser(user.id)}
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
            Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
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

export default AdminUsers;
