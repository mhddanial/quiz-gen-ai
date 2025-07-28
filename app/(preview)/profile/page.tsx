'use client';

import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  LogOut,
  Shield,
  Clock,
  FileText,
  BarChart3,
  Settings,
  Loader2,
  Check,
  Upload,
} from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  provider?: string;
  created_at: string;
  last_sign_in_at?: string;
}

interface UserStats {
  totalQuizzes: number;
  totalQuestions: number;
  lastActivity: string;
}

interface EditForm {
  fullName: string;
  email: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    totalQuizzes: 0,
    totalQuestions: 0,
    lastActivity: "Never",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editForm, setEditForm] = useState<EditForm>({
    fullName: "",
    email: "",
  });

  // Memoized date formatter
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  // Memoized function to get user initials
  const getInitials = useCallback(
    (fullName?: string) => {
      if (!fullName) {
        return profile?.email?.charAt(0).toUpperCase() || "U";
      }

      const names = fullName.trim().split(" ");
      if (names.length > 1) {
        return `${names[0].charAt(0)}${names[names.length - 1].charAt(
          0
        )}`.toUpperCase();
      }
      return names[0].charAt(0).toUpperCase();
    },
    [profile?.email]
  );

  // Memoized user statistics (replace with actual API call when available)
  const loadUserStats = useCallback(async () => {
    // TODO: Replace with actual API calls to get user statistics
    // For now, using mock data
    try {
      // Example: const { data: quizzes } = await supabase.from('quizzes').select('id').eq('user_id', user.id);
      // Example: const { data: questions } = await supabase.from('questions').select('id').eq('user_id', user.id);

      setUserStats({
        totalQuizzes: 12,
        totalQuestions: 156,
        lastActivity: "2 hours ago",
      });
    } catch (error) {
      console.error("Error loading user stats:", error);
    }
  }, []);

  // Main function to check user and load profile
  const checkUser = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/auth/login");
        return;
      }

      setUser(user);

      // Extract profile information from user metadata and identities
      const profileData: UserProfile = {
        id: user.id,
        email: user.email || "",
        full_name:
          user.user_metadata?.full_name || user.user_metadata?.name || "",
        avatar_url:
          user.user_metadata?.avatar_url || user.user_metadata?.picture || "",
        provider: user.app_metadata?.provider || "email",
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
      };

      setProfile(profileData);

      // Set edit form initial values
      setEditForm({
        fullName: profileData.full_name || "",
        email: profileData.email,
      });

      // Load user statistics
      await loadUserStats();
    } catch (error) {
      console.error("Error loading profile:", error);
      setError("Failed to load profile information");
    } finally {
      setIsLoading(false);
    }
  }, [router, loadUserStats]);

  // Effect to load user data on component mount
  useEffect(() => {
    checkUser();
  }, [checkUser]);

  // Auto-clear success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Handle profile save
  const handleSaveProfile = useCallback(async () => {
    if (!editForm.fullName.trim()) {
      setError("Name cannot be empty");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: editForm.fullName.trim(),
        },
      });

      if (updateError) throw updateError;

      // Update local profile state
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              full_name: editForm.fullName.trim(),
            }
          : null
      );

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      setError(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  }, [editForm.fullName]);

  // Handle sign out
  const handleSignOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/");
    } catch (error) {
      setError("Error signing out");
    }
  }, [router]);

  // Handle edit cancel
  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setError("");
    setEditForm({
      fullName: profile?.full_name || "",
      email: profile?.email || "",
    });
  }, [profile]);

  // Handle form input changes
  const handleFormChange = useCallback(
    (field: keyof EditForm, value: string) => {
      setEditForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // Memoized Google icon component
  const GoogleIcon = useMemo(
    () => (
      <svg className="w-3 h-3" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
    []
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">
              Unable to load profile information
            </p>
            <Button onClick={() => router.push("/")}>Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="text-gray-600 hover:text-gray-900"
              >
                Back to Home
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                Profile Settings
              </h1>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      Profile Information
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      Manage your account details and preferences
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-8">
                {/* Profile Photo Section */}
                <div className="flex items-center space-x-6 mb-8">
                  <div className="relative">
                    {profile.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-100"
                        priority
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-blue-100">
                        {getInitials(profile.full_name)}
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                      <Camera className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {profile.full_name || "User"}
                    </h3>
                    <p className="text-gray-600">{profile.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary" className="capitalize">
                        {profile.provider === "google" ? (
                          <div className="flex items-center space-x-1">
                            {GoogleIcon}
                            <span>Google</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <Mail className="w-3 h-3" />
                            <span>Email</span>
                          </div>
                        )}
                      </Badge>
                      <Badge variant="outline">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="space-y-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Name</Label>
                          <Input
                            id="fullName"
                            value={editForm.fullName}
                            onChange={(e) =>
                              handleFormChange("fullName", e.target.value)
                            }
                            placeholder="Your Full Name"
                            maxLength={100}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editForm.email}
                          disabled
                          className="bg-gray-50"
                        />
                        <p className="text-xs text-gray-500">
                          Email cannot be changed
                        </p>
                      </div>

                      <div className="flex space-x-3 pt-4">
                        <Button
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancelEdit}
                          disabled={isSaving}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Full Name
                          </Label>
                          <p className="text-gray-900 font-medium mt-1">
                            {profile.full_name || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Email Address
                          </Label>
                          <p className="text-gray-900 font-medium mt-1">
                            {profile.email}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Member Since
                          </Label>
                          <p className="text-gray-900 font-medium mt-1">
                            {formatDate(profile.created_at)}
                          </p>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Last Sign In
                          </Label>
                          <p className="text-gray-900 font-medium mt-1">
                            {profile.last_sign_in_at
                              ? formatDate(profile.last_sign_in_at)
                              : "Never"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/")}
                >
                  <FileText className="h-4 w-4 mr-3" />
                  Create New Quiz
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/quizzes")}
                >
                  <BarChart3 className="h-4 w-4 mr-3" />
                  View All Quizzes
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/settings")}
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Account Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}