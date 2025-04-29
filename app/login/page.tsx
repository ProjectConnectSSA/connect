"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// Import createBrowserClient from @supabase/ssr
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { AuthError } from "@supabase/supabase-js";

// Define Database type if using generated types (optional but recommended)
// import type { Database } from "@/types_db";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Create the Supabase client instance using createBrowserClient from @supabase/ssr
  // This requires your NEXT_PUBLIC_ environment variables to be set correctly.
  // If using generated types: useState(() => createBrowserClient<Database>(...));
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!, // Ensure this env var is set and accessible client-side
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Ensure this env var is set and accessible client-side
    )
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;

    try {
      // signInWithPassword works the same way with the client created by createBrowserClient
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      toast.success("Signed in successfully!");
      // Option: Refresh server data if needed after successful login.
      // The middleware should handle session refresh on navigation, but an explicit
      // refresh might be needed depending on your data fetching patterns.
      // router.refresh();
      router.push("/dashboard");
    } catch (catchError) {
      const typedError = catchError as AuthError;
      console.error("Sign-in error:", typedError.message);
      setError(typedError.message || "An unexpected error occurred during sign-in.");
      toast.error(`Sign-in failed: ${typedError.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <Button
              className="w-full"
              type="submit"
              disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
