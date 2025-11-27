
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface PaymentGatewayProps {
  onPaymentSuccess: () => void;
  onBack: () => void;
}

export function PaymentGateway({ onPaymentSuccess, onBack }: PaymentGatewayProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-number">Card Number</Label>
            <Input id="card-number" placeholder="**** **** **** ****" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry-date">Expiry Date</Label>
              <Input id="expiry-date" placeholder="MM/YY" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input id="cvc" placeholder="***" />
            </div>
          </div>
          <Button className="w-full" onClick={onPaymentSuccess}>
            Subscribe Now
          </Button>
          <Button variant="outline" className="w-full" onClick={onBack}>
            Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
