
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Check, Pencil, User, Lock, Eye, EyeOff, Clock, PlayCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Form schemas
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Mock user data
const userData = {
  id: "u123",
  name: "Jane Doe",
  email: "jane@example.com",
  username: "janedoe",
  avatar: "/lovable-uploads/0b3ca943-d2ab-4e06-8fe6-99e4123cf894.png",
  plan: "Premium",
  joined: "March 2023",
  watchtime: "125 hours",
  favorites: 32,
  watchlist: 14,
};

// Mock watch history
const watchHistory = [
  {
    id: "1",
    title: "Arcane",
    episode: "S1:E3 - The Base Violence Necessary for Change",
    thumbnail: "/lovable-uploads/0b3ca943-d2ab-4e06-8fe6-99e4123cf894.png",
    watched: "Yesterday",
    progress: 75,
  },
  {
    id: "2",
    title: "The Witcher",
    episode: "S2:E1 - A Grain of Truth",
    thumbnail: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=200&h=120&auto=format&fit=crop",
    watched: "3 days ago",
    progress: 100,
  },
  {
    id: "3",
    title: "Stranger Things",
    episode: "S4:E7 - The Massacre at Hawkins Lab",
    thumbnail: "https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=200&h=120&auto=format&fit=crop",
    watched: "Last week",
    progress: 100,
  },
];

const Profile = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  // Profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: userData.name,
      email: userData.email,
      username: userData.username,
    },
  });
  
  // Password form
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  // Handle profile form submission
  const onProfileSubmit = (data: z.infer<typeof profileFormSchema>) => {
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
    console.log(data);
  };
  
  // Handle password form submission
  const onPasswordSubmit = (data: z.infer<typeof passwordFormSchema>) => {
    toast({
      title: "Password changed",
      description: "Your password has been changed successfully.",
    });
    console.log(data);
    passwordForm.reset();
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };
  
  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
      <section>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* User Card */}
          <Card className="w-full md:w-80 bg-card/50">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4 border-4 border-primary/20">
                    <AvatarImage src={userData.avatar} alt={userData.name} />
                    <AvatarFallback>
                      <User className="h-12 w-12" />
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-center">{userData.name}</CardTitle>
                  <CardDescription className="text-center">@{userData.username}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-center pb-3">
              <Badge className="mb-2">{userData.plan} Plan</Badge>
              <p className="text-sm text-muted-foreground">Member since {userData.joined}</p>
            </CardContent>
            <Separator />
            <CardFooter className="py-4 flex-col gap-3">
              <div className="grid grid-cols-3 w-full">
                <div className="flex flex-col items-center">
                  <span className="text-lg font-semibold">{userData.watchtime}</span>
                  <span className="text-xs text-muted-foreground">Watch time</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-semibold">{userData.favorites}</span>
                  <span className="text-xs text-muted-foreground">Favorites</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-semibold">{userData.watchlist}</span>
                  <span className="text-xs text-muted-foreground">Watchlist</span>
                </div>
              </div>
            </CardFooter>
          </Card>
          
          {/* Settings Tabs */}
          <div className="flex-1">
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="account" className="flex-1">Account</TabsTrigger>
                <TabsTrigger value="security" className="flex-1">Security</TabsTrigger>
                <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="account" className="mt-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                      Update your account information and email address.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter your name" 
                                  {...field} 
                                  className="bg-background/50"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter your email" 
                                  type="email"
                                  {...field} 
                                  className="bg-background/50"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter your username" 
                                  {...field} 
                                  className="bg-background/50"
                                />
                              </FormControl>
                              <FormDescription>
                                This is your public username.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="gap-2">
                          <Check className="h-4 w-4" />
                          Save Changes
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Avatar</CardTitle>
                    <CardDescription>
                      Change your profile picture.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20 border-2 border-border">
                        <AvatarImage src={userData.avatar} alt={userData.name} />
                        <AvatarFallback>
                          <User className="h-10 w-10" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-2">
                        <Button size="sm">Upload New</Button>
                        <Button size="sm" variant="outline">Remove</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your password for added security.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Password</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input 
                                    placeholder="Enter your current password" 
                                    type={showPassword.current ? "text" : "password"}
                                    {...field} 
                                    className="bg-background/50 pr-10"
                                  />
                                </FormControl>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-10 w-10"
                                  onClick={() => togglePasswordVisibility('current')}
                                >
                                  {showPassword.current ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input 
                                    placeholder="Enter your new password" 
                                    type={showPassword.new ? "text" : "password"}
                                    {...field} 
                                    className="bg-background/50 pr-10"
                                  />
                                </FormControl>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-10 w-10"
                                  onClick={() => togglePasswordVisibility('new')}
                                >
                                  {showPassword.new ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm New Password</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input 
                                    placeholder="Confirm your new password" 
                                    type={showPassword.confirm ? "text" : "password"}
                                    {...field} 
                                    className="bg-background/50 pr-10"
                                  />
                                </FormControl>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-10 w-10"
                                  onClick={() => togglePasswordVisibility('confirm')}
                                >
                                  {showPassword.confirm ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="gap-2">
                          <Lock className="h-4 w-4" />
                          Update Password
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Watch History</CardTitle>
                    <CardDescription>
                      View your recent viewing activity.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {watchHistory.map((item) => (
                        <div key={item.id} className="flex gap-4 p-2 rounded-md hover:bg-card transition-colors">
                          <div className="relative w-32 h-20 rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={item.thumbnail} 
                              alt={item.title} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50">
                              <PlayCircle className="h-8 w-8" />
                            </div>
                            {item.progress < 100 && (
                              <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary">
                                <div 
                                  className="h-full bg-primary" 
                                  style={{ width: `${item.progress}%` }} 
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.episode}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">Watched {item.watched}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 self-start flex-shrink-0">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View Full History</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
