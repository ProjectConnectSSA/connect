// app/dashboard/profile/page.tsx (or your chosen path)
"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js"; // For client-side auth updates
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast, Toaster } from "sonner";
import { User, CreditCard, Shield, Loader2 } from "lucide-react";

import DashboardSidebar from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/topbar";

// Initialize Supabase client for client-side operations (like password update)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing in .env.local for client-side operations.");
}
const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

// Re-define or import this interface if it's in a shared types file
export interface ProfileApiResponse {
  id: string;
  email: string | undefined;
  fullName: string | null;
  avatarUrl: string | null;
  company: string | null;
  planId: string | null;
  subscriptionStatus: string | null;
  currentPeriodEnd: string | null;
  usage: {
    links: { current: number | null; limit: number | null };
    forms: { current: number | null; limit: number | null };
    emails: { current: number | null; limit: number | null };
    landingPages: { current: number | null; limit: number | null };
  };
}

// For editable fields in the form
interface EditableProfileForm {
  fullName: string;
  email: string; // Email is managed by auth, but displayed
  avatarUrl: string;
  company: string;
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileApiResponse | null>(null);
  const [editableForm, setEditableForm] = useState<EditableProfileForm>({
    fullName: "",
    email: "",
    avatarUrl: "",
    company: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fetchAndSetProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/profile");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to parse error response" }));
        if (response.status === 401) {
          toast.error("Authentication failed. Please log in again.");
          // Optionally redirect to login: router.push('/login');
        } else {
          toast.error(errorData.error || `HTTP error! Status: ${response.status}`);
        }
        return; // Stop further execution
      }
      const data: ProfileApiResponse = await response.json();
      console.log("Fetched Profile Data:", data);
      setProfileData(data);
      setEditableForm({
        fullName: data.fullName || "",
        email: data.email || "",
        avatarUrl: data.avatarUrl || "/placeholder-avatar.png", // Provide a fallback
        company: data.company || "",
      });
    } catch (error: any) {
      toast.error(`Failed to load profile: ${error.message}`);
      console.error("Fetch profile error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndSetProfile();
  }, [fetchAndSetProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditableForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    if (!profileData) {
      toast.error("Profile data not loaded. Cannot save.");
      return;
    }
    setIsSaving(true);

    try {
      // 1. Update auth.users user_metadata (for email, name, avatar, company)
      const { error: authUpdateError } = await supabase.auth.updateUser({
        email: editableForm.email,
        data: {
          // user_metadata
          full_name: editableForm.fullName,
          avatar_url: editableForm.avatarUrl,
          company: editableForm.company,
        },
      });
      if (authUpdateError) throw authUpdateError;

      // 2. Update public.profiles table (name, avatar_url are now primary)
      // The API / trigger should handle keeping these in sync if auth changes.
      // However, explicitly updating here ensures the client sees the change immediately
      // if there's a slight delay in the trigger or if we want to be very explicit.
      // For this setup, we rely on the fact that supabase.auth.updateUser
      // will trigger the database trigger (if set up) to update the profiles table.
      // Or, if not using an UPDATE trigger, you'd call a specific API endpoint to update the profiles table.
      // For simplicity here, we assume the user_metadata update is the source of truth for these fields.

      // We *could* also call a specific PUT /api/profile endpoint if we wanted to update profile table specifics.
      // For now, the updateUser call is enough for the editable fields we have.

      setIsEditing(false);
      toast.success("Profile updated successfully!");
      await fetchAndSetProfile(); // Re-fetch to ensure UI is up-to-date with any backend changes

      const {
        data: { user: updatedUser },
      } = await supabase.auth.getUser();
      if (updatedUser?.email !== editableForm.email && updatedUser?.new_email) {
        toast.info(`Confirmation email sent to ${updatedUser.new_email} to verify your new address.`);
      }
    } catch (error: any) {
      toast.error(`Error updating profile: ${error.message}`);
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!newPassword) {
      toast.error("New password cannot be empty.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setIsPasswordUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(`Error updating password: ${error.message}`);
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar />
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-gray-600 dark:text-gray-400">Loading Profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 flex items-center justify-center">
            <div className="text-center">
              <Shield className="h-16 w-16 mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Failed to load profile data.</h2>
              <p className="text-muted-foreground">Please try refreshing the page or logging in again.</p>
              <Button
                onClick={fetchAndSetProfile}
                className="mt-4">
                Retry
              </Button>
            </div>
          </main>
        </div>
        <Toaster
          richColors
          position="bottom-right"
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
              <p className="text-muted-foreground">Manage your account settings, plan, and security.</p>
            </div>

            <Tabs
              defaultValue="profile"
              className="space-y-4">
              <TabsList>
                <TabsTrigger
                  value="profile"
                  className="flex items-center gap-2">
                  <User className="h-4 w-4" /> Profile
                </TabsTrigger>
                <TabsTrigger
                  value="billing"
                  className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> Billing & Plan
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Security
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and preferences.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <Avatar className="h-24 w-24 sm:h-20 sm:w-20">
                        <AvatarImage
                          src={editableForm.avatarUrl}
                          alt={editableForm.fullName}
                        />
                        <AvatarFallback>{editableForm.fullName ? editableForm.fullName[0].toUpperCase() : "U"}</AvatarFallback>
                      </Avatar>
                      <div className="text-center sm:text-left">
                        <h3 className="text-xl font-semibold">{editableForm.fullName || "User Name"}</h3>
                        <p className="text-sm text-muted-foreground">{editableForm.email}</p>
                        {isEditing && (
                          <div className="mt-2 space-y-1">
                            <Label
                              htmlFor="avatarUrl"
                              className="text-xs">
                              Avatar URL
                            </Label>
                            <Input
                              id="avatarUrl"
                              placeholder="https://example.com/avatar.png"
                              value={editableForm.avatarUrl}
                              onChange={handleInputChange}
                              className="text-xs h-8"
                              disabled={isSaving}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            value={editableForm.fullName}
                            disabled={!isEditing || isSaving}
                            onChange={handleInputChange}
                            placeholder="Your full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editableForm.email}
                            disabled={!isEditing || isSaving}
                            onChange={handleInputChange}
                            placeholder="your@email.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Company (Optional)</Label>
                          <Input
                            id="company"
                            value={editableForm.company}
                            disabled={!isEditing || isSaving}
                            onChange={handleInputChange}
                            placeholder="Your company name"
                          />
                        </div>
                      </div>
                      {isEditing ? (
                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={handleSave}
                            disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsEditing(false);
                              // Revert form to last fetched state
                              if (profileData) {
                                setEditableForm({
                                  fullName: profileData.fullName || "",
                                  email: profileData.email || "",
                                  avatarUrl: profileData.avatarUrl || "/placeholder-avatar.png",
                                  company: profileData.company || "",
                                });
                              }
                            }}
                            disabled={isSaving}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="billing">
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Details</CardTitle>
                    <CardDescription>View your current plan and billing status.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50 space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Current Plan:</h4>
                        <Badge variant={profileData.planId ? "default" : "secondary"}>{profileData.planId || "N/A"}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Status:</h4>
                        <Badge variant={profileData.subscriptionStatus === "active" ? "success" : "outline"}>
                          {profileData.subscriptionStatus || "N/A"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Renews/Ends:</h4>
                        <span>{formatDate(profileData.currentPeriodEnd)}</span>
                      </div>
                    </div>
                    {/* Display Usage Stats */}
                    <div className="pt-4">
                      <h4 className="font-medium text-md mb-2">Current Usage:</h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <span>Links:</span>
                        <span className="text-right">
                          {profileData.usage.links.current ?? 0} / {profileData.usage.links.limit ?? "∞"}
                        </span>
                        <span>Forms:</span>
                        <span className="text-right">
                          {profileData.usage.forms.current ?? 0} / {profileData.usage.forms.limit ?? "∞"}
                        </span>
                        <span>Emails:</span>
                        <span className="text-right">
                          {profileData.usage.emails.current ?? 0} / {profileData.usage.emails.limit ?? "∞"}
                        </span>
                        <span>Landing Pages:</span>
                        <span className="text-right">
                          {profileData.usage.landingPages.current ?? 0} / {profileData.usage.landingPages.limit ?? "∞"}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.info("Plan management coming soon via Stripe Portal!")}>
                      Manage Subscription
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Your subscription is managed through Stripe. Click above to access the customer portal.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Update your password and manage security features.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-lg">Change Password</h4>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          disabled={isPasswordUpdating}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={isPasswordUpdating}
                        />
                      </div>
                      <Button
                        onClick={handlePasswordUpdate}
                        disabled={isPasswordUpdating}>
                        {isPasswordUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Password
                      </Button>
                    </div>
                    <div className="space-y-4 border-t pt-6 mt-6">
                      <h4 className="font-medium text-lg">Two-Factor Authentication (2FA)</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account by enabling 2FA.</p>
                      <Button
                        variant="outline"
                        onClick={() => toast.info("2FA setup coming soon!")}>
                        Enable 2FA
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Toaster
          richColors
          position="bottom-right"
        />
      </div>
    </div>
  );
}
