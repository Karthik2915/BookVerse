
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Check, ArrowLeft } from "lucide-react";
import { PaymentGateway } from "./PaymentGateway";

export function SubscriptionPage({ onBack }: { onBack: () => void }) {
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("Free"); // Add currentPlan state

  const subscriptionTiers = [
    {
      name: "Free",
      price: "$0",
      features: [
        "Access to free stories",
        "Limited access to new releases",
        "Community access",
      ],
      isCurrent: currentPlan === "Free",
    },
    {
      name: "Premium",
      price: "$9.99",
      features: [
        "Unlimited access to all stories",
        "Early access to new releases",
        "Exclusive content",
        "Ad-free reading",
      ],
      isCurrent: currentPlan === "Premium",
      isPremium: true,
    },
  ];

  const handleSubscribeClick = () => {
    setShowPaymentGateway(true);
  };

  const handlePaymentSuccess = () => {
    console.log("Payment successful!");
    setCurrentPlan("Premium"); // Update currentPlan
    setShowPaymentGateway(false);
  };

  const handlePaymentGatewayBack = () => {
    setShowPaymentGateway(false);
  };

  if (showPaymentGateway) {
    return <PaymentGateway onPaymentSuccess={handlePaymentSuccess} onBack={handlePaymentGatewayBack} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
        </div>
        <h1 className="text-4xl font-extrabold text-center mb-4 tracking-tight">
          Choose Your Plan
        </h1>
        <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Unlock the full Storyverse experience. Choose the plan that's right for you.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {subscriptionTiers.map((tier) => (
            <Card key={tier.name} className={`transform transition-transform duration-300 hover:scale-105 ${tier.isCurrent ? 'border-2 border-purple-500' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                  {tier.isCurrent && (
                    <div className="text-xs font-semibold text-purple-600 bg-purple-100 dark:bg-purple-900/50 dark:text-purple-300 px-2 py-1 rounded-full">
                      Current Plan
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-5xl font-bold">{tier.price}<span className="text-base font-normal text-gray-500">/month</span></div>
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full text-lg py-6 font-semibold ${tier.isPremium ? 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600' : ''}`}
                  onClick={tier.isPremium && !tier.isCurrent ? handleSubscribeClick : undefined}
                  disabled={tier.isCurrent}
                >
                  {tier.isCurrent ? "Your Plan" : (tier.isPremium ? "Upgrade to Premium" : "Get Started")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
