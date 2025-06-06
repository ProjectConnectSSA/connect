// app/dashboard/profile/page.tsx (Updated with subscription management)
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast, Toaster } from "sonner";
import { User, CreditCard, Shield, Loader2 } from "lucide-react";
import { ModeToggle } from "@/components/settings/mode-toggle";
import DashboardSidebar from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/topbar";
import SubscriptionManagement from "@/components/subscription/subscription-management";

// Initialize Supabase client for client-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient();

// Updated interface to include subscription fields
export interface ProfileApiResponse {
  id: string;
  email: string | undefined;
  fullName: string | null;
  avatarUrl: string | null;
  company: string | null;
  planId: string | null;
  currentPlan: string | null;
  subscriptionStatus: string | null;
  currentPeriodEnd: string | null;
  stripeCustomerId: string | null;
  subscriptionId: string | null;
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
  email: string;
  avatarUrl: string;
  company: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  // Handle success/cancel from Stripe checkout
  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");

    if (success) {
      toast.success("Subscription activated successfully!");
      // Clean up URL
      router.replace("/dashboard/profile");
    } else if (canceled) {
      toast.info("Subscription checkout was canceled.");
      // Clean up URL
      router.replace("/dashboard/profile");
    }
  }, [searchParams, router]);

  const fetchAndSetProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/profile");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to parse error response" }));
        if (response.status === 401) {
          toast.error("Authentication failed. Please log in again.");
        } else {
          toast.error(errorData.error || `HTTP error! Status: ${response.status}`);
        }
        return;
      }
      const data: ProfileApiResponse = await response.json();
      console.log("Fetched Profile Data:", data);
      setProfileData(data);
      setEditableForm({
        fullName: data.fullName || "",
        email: data.email || "",
        avatarUrl: data.avatarUrl || "/placeholder-avatar.png",
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
      const { error: authUpdateError } = await supabase.auth.updateUser({
        email: editableForm.email,
        data: {
          full_name: editableForm.fullName,
          avatar_url: editableForm.avatarUrl,
          company: editableForm.company,
        },
      });
      if (authUpdateError) throw authUpdateError;

      setIsEditing(false);
      toast.success("Profile updated successfully!");
      await fetchAndSetProfile();

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
                    <div>
                      <div className="flex flex-1 items-center justify-end space-x-4">
                        <ModeToggle />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="billing">
                <div className="space-y-6">
                  {/* Current Usage Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Usage</CardTitle>
                      <CardDescription>Your current usage limits and subscription status.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{profileData.usage.links.current ?? 0}</div>
                          <div className="text-sm text-muted-foreground">
                            / {profileData.usage.links.limit === -1 ? "∞" : profileData.usage.links.limit} Links
                          </div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{profileData.usage.forms.current ?? 0}</div>
                          <div className="text-sm text-muted-foreground">
                            / {profileData.usage.forms.limit === -1 ? "∞" : profileData.usage.forms.limit} Forms
                          </div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">{profileData.usage.emails.current ?? 0}</div>
                          <div className="text-sm text-muted-foreground">
                            / {profileData.usage.emails.limit === -1 ? "∞" : profileData.usage.emails.limit} Emails
                          </div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">{profileData.usage.landingPages.current ?? 0}</div>
                          <div className="text-sm text-muted-foreground">
                            / {profileData.usage.landingPages.limit === -1 ? "∞" : profileData.usage.landingPages.limit} Pages
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Subscription Management */}
                  <SubscriptionManagement
                    currentPlan={profileData.currentPlan}
                    subscriptionStatus={profileData.subscriptionStatus}
                    userId={profileData.id}
                    onSubscriptionChange={fetchAndSetProfile}
                  />
                </div>
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
