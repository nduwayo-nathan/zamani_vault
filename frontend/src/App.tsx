
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/layouts/MainLayout";
import Dashboard from "@/pages/Dashboard";
import UserDashboard from "@/pages/user/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";
import ShowDetails from "@/pages/ShowDetails";
import UserProfile from "@/pages/user/Profile";
import UserSubscription from "@/pages/user/Subscription";
import AdminUsers from "@/pages/admin/Users";
import AdminContent from "@/pages/admin/Content";
import AdminSubscriptions from "@/pages/admin/Subscriptions";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ 
  children, 
  requireAdmin = false,
  redirectTo = "/login"
}: { 
  children: JSX.Element, 
  requireAdmin?: boolean,
  redirectTo?: string
}) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && !isAdmin) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return children;
};

// Role-based redirect component
const RoleBasedRedirect = () => {
  const { isAdmin } = useAuth();
  
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  } else {
    return <Navigate to="/user" replace />;
  }
};

// AuthLayout to provide auth context to routes
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SidebarProvider>
        <AuthLayout>
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Root redirect based on role */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <RoleBasedRedirect />
                </ProtectedRoute>
              } 
            />
            
            {/* User routes */}
            <Route 
              path="/user" 
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<UserDashboard />} />
              <Route path="/user/show/:id" element={<ShowDetails />} />
              <Route path="/user/discover" element={<UserDashboard />} />
              <Route path="/user/videos" element={<UserDashboard />} />
              <Route path="/user/books" element={<UserDashboard />} />
              <Route path="/user/artifacts" element={<UserDashboard />} />
              <Route path="/user/favorites" element={<UserDashboard />} />
              <Route path="/user/watchlist" element={<UserDashboard />} />
              <Route path="/user/search" element={<UserDashboard />} />
              <Route path="/user/profile" element={<UserProfile />} />
              <Route path="/user/subscription" element={<UserSubscription />} />
              <Route path="/user/settings" element={<UserProfile />} />
            </Route>
            
            {/* Admin routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin redirectTo="/user">
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/content" element={<AdminContent />} />
              <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
              <Route path="/admin/show/:id" element={<ShowDetails />} />
            </Route>
            
            {/* Legacy routes for backward compatibility */}
            <Route path="/show/:id" element={<Navigate to="/user/show/:id" replace />} />
            <Route path="/discover" element={<Navigate to="/user/discover" replace />} />
            <Route path="/videos" element={<Navigate to="/user/videos" replace />} />
            <Route path="/books" element={<Navigate to="/user/books" replace />} />
            <Route path="/artifacts" element={<Navigate to="/user/artifacts" replace />} />
            <Route path="/favorites" element={<Navigate to="/user/favorites" replace />} />
            <Route path="/watchlist" element={<Navigate to="/user/watchlist" replace />} />
            <Route path="/search" element={<Navigate to="/user/search" replace />} />
            <Route path="/settings" element={<Navigate to="/user/settings" replace />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthLayout>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
