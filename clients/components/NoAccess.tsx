import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Logo from "./Logo";
import { Button } from "./ui/button";
import Link from "next/link"; // Added Link component

const NoAccess = ({
  details = "Log in to view your cart items and checkout. Don't miss out on your favorite products!",
}: {
  details?: string;
}) => {
  return (
    <div className="flex items-center justify-center py-12 md:py-32 bg-gray-100 p-4">
      <Card className="w-full max-w-md p-5">
        <CardHeader className="flex items-center flex-col">
          <Logo />
          <CardTitle className="text-2xl font-bold text-center">
            Welcome Back!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center font-medium text-darkColor/80">{details}</p>
          {/* Replaced Clerk SignInButton with Link */}
          <Link href="/login">
            <Button className="w-full" size="lg">
              Sign in
            </Button>
          </Link>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            Don&rsquo;t have an account?
          </div>
          {/* Replaced Clerk SignUpButton with Link */}
          <Link href="/register">
            <Button variant="outline" className="w-full" size="lg">
              Create an account
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NoAccess;