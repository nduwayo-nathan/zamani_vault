
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import UserProfileButton from "@/components/UserProfileButton";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Search, 
  Home, 
  Compass, 
  Film, 
  BookOpen, 
  BookMarked,
  Heart, 
  History, 
  ShieldCheck,
  MenuIcon
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Discover",
    href: "/discover",
    icon: Compass,
  },
  {
    title: "Videos",
    href: "/videos",
    icon: Film,
  },
  {
    title: "Books",
    href: "/books",
    icon: BookOpen,
  },
  {
    title: "Artifacts",
    href: "/artifacts",
    icon: BookMarked,
  },
  {
    title: "Favorites",
    href: "/favorites",
    icon: Heart,
  },
  {
    title: "Watchlist",
    href: "/watchlist",
    icon: History,
  },
  {
    title: "Admin",
    href: "/admin",
    icon: ShieldCheck,
    adminOnly: true,
  },
];

const MainNav = () => {
  const location = useLocation();
  const { isAdmin, isAuthenticated } = useAuth();
  
  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <div className="md:hidden mr-2">
          <SidebarTrigger />
        </div>
        
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="flex items-center space-x-2">
            <BookMarked className="h-6 w-6" />
            <span className="font-bold">ZamaniVault</span>
          </Link>
        </div>
        
        {isAuthenticated && (
          <div className="hidden md:flex md:flex-1">
            <nav className="flex items-center space-x-1 text-sm font-medium">
              {navItems.filter(item => !item.adminOnly || isAdmin).map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm transition-colors hover:text-primary",
                    isActive(item.href)
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        )}
        
        <div className="ml-auto flex items-center gap-2">
          {isAuthenticated && (
            <Link to="/search">
              <Button size="icon" variant="ghost">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </Link>
          )}
          <UserProfileButton />
        </div>
      </div>
    </header>
  );
};

export default MainNav;
