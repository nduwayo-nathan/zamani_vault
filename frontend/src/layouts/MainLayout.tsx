
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Home, 
  Search, 
  TrendingUp,
  BookOpen,
  Clock, 
  Film, 
  Scroll,
  User, 
  CreditCard, 
  Settings, 
  LogOut,
  Shield,
  Library,
  Users,
  FileEdit,
  DollarSign
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const isUserRoute = location.pathname.startsWith('/user');
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Menu items for user
  const userMainMenuItems = [
    { title: "Home", icon: Home, url: "/user" },
    { title: "Search", icon: Search, url: "/user/search" },
    { title: "Discover", icon: TrendingUp, url: "/user/discover" },
  ];

  const userLibraryItems = [
    { title: "Favorites", icon: BookOpen, url: "/user/favorites" },
    { title: "Watch Later", icon: Clock, url: "/user/watchlist" },
  ];

  const userBrowseItems = [
    { title: "Videos", icon: Film, url: "/user/videos" },
    { title: "Books", icon: Scroll, url: "/user/books" },
    { title: "Artifacts", icon: Library, url: "/user/artifacts" },
  ];

  const userProfileItems = [
    { title: "Profile", icon: User, url: "/user/profile" },
    { title: "Subscription", icon: CreditCard, url: "/user/subscription" },
    { title: "Settings", icon: Settings, url: "/user/settings" },
  ];

  // Menu items for admin
  const adminMenuItems = [
    { title: "Dashboard", icon: Home, url: "/admin" },
    { title: "Users", icon: Users, url: "/admin/users" },
    { title: "Content", icon: FileEdit, url: "/admin/content" },
    { title: "Subscriptions", icon: DollarSign, url: "/admin/subscriptions" },
  ];

  // Render sidebar menu based on role
  const renderSidebarContent = () => {
    if (isAdmin && isAdminRoute) {
      return (
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild data-state={location.pathname === item.url ? "active" : "inactive"}>
                      <Link to={item.url} className="flex items-center">
                        <item.icon size={18} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          {/* Admin switch to user view */}
          <SidebarGroup>
            <SidebarGroupLabel>Switch View</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild data-state="inactive">
                    <Link to="/user" className="flex items-center">
                      <User size={18} />
                      <span>User View</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      );
    } else {
      // User view sidebar
      return (
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {userMainMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild data-state={location.pathname === item.url ? "active" : "inactive"}>
                      <Link to={item.url} className="flex items-center">
                        <item.icon size={18} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel>Library</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {userLibraryItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild data-state={location.pathname === item.url ? "active" : "inactive"}>
                      <Link to={item.url} className="flex items-center">
                        <item.icon size={18} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel>Browse</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {userBrowseItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild data-state={location.pathname === item.url ? "active" : "inactive"}>
                      <Link to={item.url} className="flex items-center">
                        <item.icon size={18} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel>User</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {userProfileItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild data-state={location.pathname === item.url ? "active" : "inactive"}>
                      <Link to={item.url} className="flex items-center">
                        <item.icon size={18} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          {/* Admin switch if user has admin privileges */}
          {isAdmin && (
            <SidebarGroup>
              <SidebarGroupLabel>Admin</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild data-state="inactive">
                      <Link to="/admin" className="flex items-center">
                        <Shield size={18} />
                        <span>Admin Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>
      );
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar>
        <SidebarHeader>
          <div className="flex flex-col items-center py-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary mb-2">
              <span className="text-xl font-bold">Z</span>
            </div>
            <span className="text-sm font-semibold">ZamaniVault</span>
          </div>
        </SidebarHeader>
        
        {renderSidebarContent()}
        
        <SidebarFooter>
          <div className="px-3 py-2">
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground">{user?.role}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      
      <main className="flex-1 overflow-hidden flex flex-col">
        <header className={`sticky top-0 z-40 transition-all duration-200 ${isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <SidebarTrigger />
              <div className="ml-4 text-lg font-medium">
                {isAdminRoute ? "Admin Dashboard" : "ZamaniVault"}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar 
                className="h-8 w-8 cursor-pointer" 
                onClick={() => navigate(isAdminRoute ? "/admin/users" : "/user/profile")}
              >
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

// Bell icon component from Lucide
const Bell = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

export default MainLayout;
