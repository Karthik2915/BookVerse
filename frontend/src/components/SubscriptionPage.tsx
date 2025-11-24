
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Check } from "lucide-react";

export function SubscriptionPage() {
  const subscriptionTiers = [
    {
      name: "Free",
      price: "$0",
      features: [
        "Access to free stories",
        "Limited access to new releases",
        "Community access",
      ],
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
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          Choose Your Plan
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {subscriptionTiers.map((tier) => (
            <Card key={tier.name}>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold">{tier.price}</div>
                <ul className="space-y-2">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full">
                  {tier.name === "Free" ? "Get Started" : "Subscribe"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
