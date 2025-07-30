'use client';

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { getCurrentUser, signOutUser } from "@/lib/auth";
import {
  extractUserProfile,
  updateUserFullName,
  UserProfile,
} from "@/lib/user";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import AvatarCard from "@/components/profile/AvatarCard";
import ProfileForm from "@/components/profile/ProfileForm";
import QuickActions from "@/components/profile/QuickAction";
import { toast } from "sonner";

// --- Interfaces ---
interface EditForm {
  fullName: string;
  email: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    fullName: "",
    email: "",
  });

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const getInitials = useCallback(
    (fullName?: string) => {
      if (!fullName) return profile?.email?.charAt(0).toUpperCase() || "U";
      const names = fullName.trim().split(" ");
      return names.length > 1
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : names[0][0].toUpperCase();
    },
    [profile?.email]
  );

  const checkUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const supaUser = await getCurrentUser();
      setUser(supaUser);
      const userProfile = extractUserProfile(supaUser);
      setProfile(userProfile);
      setEditForm({
        fullName: userProfile.full_name || "",
        email: userProfile.email,
      });
    } catch (err) {
      toast.error("Failed to load profile information");
      router.push("/auth/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const handleSaveProfile = useCallback(async () => {
    if (!editForm.fullName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      setIsSaving(true);
      await updateUserFullName(editForm.fullName);
      setProfile((prev) =>
        prev ? { ...prev, full_name: editForm.fullName } : null
      );
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  }, [editForm.fullName]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOutUser();
      toast.success("Signed out successfully");
      router.push("/");
    } catch {
      toast.error("Error signing out");
    }
  }, [router]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    if (profile) {
      setEditForm({
        fullName: profile.full_name || "",
        email: profile.email,
      });
    }
  }, [profile]);

  const handleFormChange = useCallback(
    (field: keyof EditForm, value: string) => {
      setEditForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Profile Information
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
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
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <AvatarCard
                  profile={profile}
                  getInitials={getInitials}
                  GoogleIcon={GoogleIcon}
                />
                <ProfileForm
                  isEditing={isEditing}
                  isSaving={isSaving}
                  profile={profile}
                  editForm={editForm}
                  handleFormChange={handleFormChange}
                  handleSaveProfile={handleSaveProfile}
                  handleCancelEdit={handleCancelEdit}
                  formatDate={formatDate}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <QuickActions onSignOut={handleSignOut} />
          </div>
        </div>
      </div>
    </div>
  );
}
