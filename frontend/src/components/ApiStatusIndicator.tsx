
import React, { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { WifiOff, Wifi } from "lucide-react";
import { checkApiStatus } from '@/services/apiConnect';
import { toast } from '@/hooks/use-toast';

const ApiStatusIndicator = () => {
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const result = await checkApiStatus();
        setApiStatus(result.status === 'ok' ? 'online' : 'offline');
        
        if (result.status !== 'ok') {
          toast({
            title: "Backend API is offline",
            description: "Using mock data. Some features may be limited.",
            variant: "destructive"
          });
          // Enable mock data mode
          localStorage.setItem('useMockData', 'true');
        } else {
          // Disable mock data mode
          localStorage.removeItem('useMockData');
        }
      } catch (error) {
        setApiStatus('offline');
        toast({
          title: "Backend API is offline",
          description: "Using mock data. Some features may be limited.",
          variant: "destructive"
        });
        // Enable mock data mode
        localStorage.setItem('useMockData', 'true');
      }
    };
    
    checkStatus();
    
    // Check periodically
    const interval = setInterval(checkStatus, 60000); // every minute
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center">
          {apiStatus === 'checking' ? (
            <Badge variant="outline" className="gap-1 px-2 py-0 h-6">
              <span className="animate-pulse">Checking API...</span>
            </Badge>
          ) : apiStatus === 'online' ? (
            <Badge variant="outline" className="gap-1 px-2 py-0 h-6 bg-green-50 text-green-700 hover:bg-green-50">
              <Wifi className="h-3 w-3" />
              <span>API Online</span>
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1 px-2 py-0 h-6 bg-red-50 text-red-700 hover:bg-red-50">
              <WifiOff className="h-3 w-3" />
              <span>API Offline</span>
            </Badge>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {apiStatus === 'online' 
          ? "Connected to Django backend API" 
          : apiStatus === 'offline' 
            ? "Using mock data - Start the Django backend to use real data" 
            : "Checking connection to backend..."}
      </TooltipContent>
    </Tooltip>
  );
};

export default ApiStatusIndicator;
