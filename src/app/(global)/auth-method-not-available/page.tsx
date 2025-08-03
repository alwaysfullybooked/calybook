import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthMethodNotAvailablePage() {
  return (
    <main className="container mx-auto flex min-h-[calc(100vh-14rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Authentication Method Not Available</CardTitle>
            <CardDescription>The authentication method you selected is not yet available</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This authentication method is still being implemented. Please use Google login for now.</p>
          </CardContent>
          <CardFooter>
            <Link href="/login" className="w-full">
              <Button variant="default" className="w-full gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
