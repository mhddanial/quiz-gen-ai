'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signOutUser } from "@/lib/auth";
import {
  loadUserProfile,
  updateUserFullName,
  UserProfile,
  formatDateString,
  getUserInitials,
} from "@/lib/user";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

import AvatarCard from "@/components/profile/AvatarCard";
import ProfileForm from "@/components/profile/ProfileForm";
import QuickActions from "@/components/profile/QuickAction";
import PageShell from "@/components/layouts/PageShell";
import { toast } from "sonner";

interface EditForm {
  fullName: string;
  email: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    fullName: "",
    email: "",
  });

  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const userProfile = await loadUserProfile();
      setProfile(userProfile);
      setEditForm({
        fullName: userProfile.full_name || "",
        email: userProfile.email,
      });
    } catch (err) {
      router.push("/auth/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

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
      toast.error(err.message);
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

  const GoogleIcon = (
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
  );

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <PageShell
      title="Profile Information"
      subtitle="Manage your account details and preferences"
      breadcrumbs={[{ label: "Profile" }]}
      rightSidebar={<QuickActions onSignOut={handleSignOut} />}
    >
      <Card className="shadow-lg border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">
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
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 self-start sm:self-center"
              >
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <AvatarCard
            profile={profile}
            getInitials={(name) => getUserInitials(name, profile.email)}
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
            formatDate={formatDateString}
          />
        </CardContent>
      </Card>
    </PageShell>
  );
}
