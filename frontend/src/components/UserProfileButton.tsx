
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Settings, CreditCard, ShieldCheck } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

const UserProfileButton = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;
  
  // Generate initials from user name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Get subscription badge
  const getSubscriptionBadge = (subscription: string) => {
    switch (subscription) {
      case 'premium':
        return <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-sm">Premium</span>;
      case 'scholar':
        return <span className="text-xs bg-indigo-600 text-white px-1.5 py-0.5 rounded-sm">Scholar</span>;
      default:
        return <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-sm">Free</span>;
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-none" aria-label="User menu">
          <Avatar className="h-8 w-8 ring-2 ring-border hover:ring-muted-foreground transition-all cursor-pointer">
            <AvatarImage 
              src={user.avatar} 
              alt={user.name} 
            />
            <AvatarFallback>
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            <div className="mt-1.5">{getSubscriptionBadge(user.subscription)}</div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/user/profile')}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/user/subscription')}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Subscription</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate('/admin')}>
                <ShieldCheck className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileButton;
