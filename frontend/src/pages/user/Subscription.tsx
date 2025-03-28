
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Info, AlertTriangle, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for subscription plans
const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Basic access to African history content with limited features.",
    features: [
      "Access to select free documentaries and articles",
      "Standard video quality",
      "Create and manage watchlist",
      "Access to public discussion forums",
      "New content updates monthly",
    ],
    recommended: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: 9.99,
    description: "Full access to all ZamaniVault content with enhanced learning features.",
    features: [
      "Full access to all documentaries, books, and artifacts",
      "HD video quality",
      "Offline downloading for mobile viewing",
      "Exclusive historian commentary tracks",
      "Interactive timelines and maps",
      "Ad-free experience",
      "Member-only content released weekly",
    ],
    recommended: true,
  },
  {
    id: "scholar",
    name: "Scholar",
    price: 19.99,
    description: "Ultimate package for serious researchers and history enthusiasts.",
    features: [
      "Everything in Premium",
      "4K Ultra HD video quality",
      "Access to primary historical sources and archives",
      "Direct Q&A sessions with historians",
      "Downloadable research materials",
      "Early access to new content",
      "Virtual tours of historical sites",
      "Certificate of completion for courses",
    ],
    recommended: false,
  },
];

// Mock data for subscription details
const subscriptionDetails = {
  plan: "premium",
  status: "active",
  nextBillingDate: "December 15, 2023",
  lastBilled: "November 15, 2023",
  paymentMethod: {
    type: "card",
    last4: "4242",
    expiry: "06/25",
    name: "Jane Doe",
  },
  billingHistory: [
    {
      id: "inv_1",
      date: "November 15, 2023",
      amount: 9.99,
      status: "paid",
    },
    {
      id: "inv_2",
      date: "October 15, 2023",
      amount: 9.99,
      status: "paid",
    },
    {
      id: "inv_3",
      date: "September 15, 2023",
      amount: 9.99,
      status: "paid",
    },
  ],
};

const Subscription = () => {
  const { toast } = useToast();

  const handlePlanChange = (planId: string) => {
    toast({
      title: "Plan update requested",
      description: `You're changing to the ${plans.find(p => p.id === planId)?.name} plan. This will take effect on your next billing date.`,
    });
  };

  const handleCancelSubscription = () => {
    toast({
      title: "Cancellation requested",
      description: "Your subscription will remain active until the end of your current billing period.",
      variant: "destructive",
    });
  };

  const handleUpdatePayment = () => {
    toast({
      title: "Payment method update",
      description: "Your payment method has been updated successfully.",
    });
  };

  // Get the current subscription plan
  const currentPlan = plans.find(plan => plan.id === subscriptionDetails.plan);

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your ZamaniVault Subscription</h1>
        <Button variant="outline" className="gap-2">
          <Info className="h-4 w-4" />
          Need Help?
        </Button>
      </div>

      {/* Current Subscription */}
      <section>
        <Card className="bg-card/50">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>
                  Manage your subscription and billing details
                </CardDescription>
              </div>
              <Badge variant={subscriptionDetails.status === "active" ? "default" : "secondary"}>
                {subscriptionDetails.status === "active" ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{currentPlan?.name} Plan</h3>
                  <p className="text-sm text-muted-foreground">{currentPlan?.description}</p>
                </div>
                
                <div className="bg-secondary/40 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Next billing date</span>
                    <span className="text-sm">{subscriptionDetails.nextBillingDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Monthly charge</span>
                    <span className="text-sm">${currentPlan?.price}/month</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={() => handleCancelSubscription()} variant="outline" className="flex-1">
                    Cancel Subscription
                  </Button>
                  <Button onClick={() => toast({ title: "Coming soon", description: "This feature is not available yet." })} className="flex-1">
                    Update Plan
                  </Button>
                </div>
              </div>
              
              <div>
                <div className="space-y-2 mb-4">
                  <h3 className="text-lg font-medium">Payment Method</h3>
                  <div className="flex items-center gap-2 p-3 bg-secondary/40 rounded-lg">
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <p className="text-sm font-medium">•••• •••• •••• {subscriptionDetails.paymentMethod.last4}</p>
                      <p className="text-xs text-muted-foreground">
                        Expires {subscriptionDetails.paymentMethod.expiry}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Button 
                    onClick={handleUpdatePayment} 
                    variant="outline" 
                    className="w-full"
                  >
                    Update Payment Method
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Billing History */}
      <section>
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>
              View your previous payments and invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-medium">Date</th>
                    <th className="text-left py-3 px-2 text-sm font-medium">Amount</th>
                    <th className="text-left py-3 px-2 text-sm font-medium">Status</th>
                    <th className="text-right py-3 px-2 text-sm font-medium">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptionDetails.billingHistory.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-border">
                      <td className="py-3 px-2 text-sm">{invoice.date}</td>
                      <td className="py-3 px-2 text-sm">${invoice.amount}</td>
                      <td className="py-3 px-2 text-sm">
                        <Badge variant={invoice.status === "paid" ? "outline" : "secondary"}>
                          {invoice.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-sm text-right">
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Available Plans */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative overflow-hidden transition-all duration-300 ${
                plan.id === subscriptionDetails.plan 
                  ? "ring-2 ring-primary shadow-lg" 
                  : plan.recommended 
                    ? "ring-1 ring-primary/40" 
                    : ""
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0">
                  <Badge className="rounded-bl-lg rounded-tr-lg rounded-br-none rounded-tl-none">
                    Recommended
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="mb-4">
                  {plan.price === 0 ? (
                    <span className="text-3xl font-bold">Free</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </>
                  )}
                </div>
                
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <Separator />
              
              <CardFooter className="pt-4">
                {plan.id === subscriptionDetails.plan ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button 
                    variant={plan.recommended ? "default" : "outline"} 
                    className="w-full"
                    onClick={() => handlePlanChange(plan.id)}
                  >
                    {plan.price === 0 ? "Switch to Free" : `Upgrade to ${plan.name}`}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Educational Value Notice */}
      <section>
        <Card className="bg-card/20 border-muted">
          <CardContent className="pt-6">
            <div className="flex gap-4 items-start">
              <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">About ZamaniVault Subscriptions</h3>
                <p className="text-sm text-muted-foreground">
                  Your subscription helps us continue to preserve and share African history with the world. 
                  A portion of all subscription fees goes directly to conservation efforts and historical 
                  research projects across the African continent.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Subscription;
