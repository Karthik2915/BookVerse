
import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

const Subscription: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Subscription Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>Basic access to all free stories.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$0/month</p>
            <ul className="list-disc list-inside mt-4">
              <li>Read all free stories</li>
              <li>Write and publish your own stories</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button disabled>Current Plan</Button>
          </CardFooter>
        </Card>
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Premium</CardTitle>
            <CardDescription>Unlock all premium content and support authors.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$5/month</p>
            <ul className="list-disc list-inside mt-4">
              <li>Read all premium stories</li>
              <li>Support your favorite authors</li>
              <li>Ad-free experience</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button>Subscribe</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Premium Plus</CardTitle>
            <CardDescription>Get exclusive content and early access.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$10/month</p>
            <ul className="list-disc list-inside mt-4">
              <li>All premium benefits</li>
              <li>Early access to new releases</li>
              <li>Exclusive content from authors</li>
            </ul>
          </Content>
          <CardFooter>
            <Button variant="outline">Subscribe</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Subscription;
