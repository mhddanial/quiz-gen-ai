'use client';

import PageShell from "@/components/layouts/PageShell";
import QuickActions from "@/components/profile/QuickAction";
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
import { signOutUser } from "@/lib/auth";
import { changePasswordSecure, loadUserProfile, UserProfile } from "@/lib/user";
import { supabase } from "@/lib/supabaseClient";
import { Eye, EyeOff, Loader2, Lock, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    loadUserProfile().then(setUserProfile);
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await signOutUser();
      toast.success("Signed out successfully");
      router.push("/");
    } catch {
      toast.error("Error signing out");
    }
  }, [router]);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) errors.push("At least 8 characters long");
    if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("At least one lowercase letter");
    if (!/\d/.test(password)) errors.push("At least one number");
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password))
      errors.push("At least one special character");
    return errors;
  };

  const handlePasswordFormChange = (
    field: keyof typeof passwordForm,
    value: string
  ) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
    if (field === "newPassword") {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }
  };

  const handleCancelPasswordChange = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordErrors([]);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleChangePassword = async () => {
    const isEmailUser = userProfile?.provider === "email";

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordErrors(["Passwords do not match"]);
      return;
    }

    const validationErrors = validatePassword(passwordForm.newPassword);
    if (validationErrors.length > 0) {
      setPasswordErrors(validationErrors);
      return;
    }

    setIsPasswordSaving(true);
    try {
      if (isEmailUser) {
        await changePasswordSecure(
          passwordForm.currentPassword,
          passwordForm.newPassword
        );
      } else {
        const { error } = await supabase.auth.updateUser({
          password: passwordForm.newPassword,
        });
        if (error) throw error;
      }

      toast.success("Password changed successfully! Logging out...", {
        duration: 1200,
      });
      setTimeout(() => {
        router.push("/auth/login");  
      },2000)
      await signOutUser();
      
    } catch (e: any) {
      setPasswordErrors([e.message || "Failed to change password"]);
    } finally {
      setIsPasswordSaving(false);
    }
  };

  const isEmailUser = userProfile?.provider === "email";

  const isPasswordFormValid =
    (!isEmailUser || passwordForm.currentPassword.trim()) &&
    passwordForm.newPassword.trim() &&
    passwordForm.confirmPassword.trim() &&
    passwordForm.newPassword === passwordForm.confirmPassword &&
    validatePassword(passwordForm.newPassword).length === 0;

  return (
    <PageShell
      title="Account Settings"
      subtitle="Manage your security settings here"
      breadcrumbs={[
        { label: "Profile", href: "/profile" },
        { label: "Settings" },
      ]}
      rightSidebar={<QuickActions onSignOut={handleSignOut} />}
    >
      <Card className="shadow-lg border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div>
            <CardTitle className="text-lg sm:text-xl">
              Change Password
            </CardTitle>
            <CardDescription className="text-blue-100">
              Update your password to keep your account secure
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <div className="space-y-4">
            {isEmailUser && (
              <div className="space-y-2">
                <Label
                  htmlFor="currentPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  Current Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      handlePasswordFormChange(
                        "currentPassword",
                        e.target.value
                      )
                    }
                    placeholder="Current Password"
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {["newPassword", "confirmPassword"].map((field) => {
              const isNew = field === "newPassword";
              const state = isNew ? showNewPassword : showConfirmPassword;
              const toggle = isNew
                ? setShowNewPassword
                : setShowConfirmPassword;
              const label = isNew ? "New Password" : "Confirm New Password";

              return (
                <div key={field} className="space-y-2">
                  <Label
                    htmlFor={field}
                    className="text-sm font-medium text-gray-700"
                  >
                    {label}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id={field}
                      type={state ? "text" : "password"}
                      value={passwordForm[field as keyof typeof passwordForm]}
                      onChange={(e) =>
                        handlePasswordFormChange(
                          field as keyof typeof passwordForm,
                          e.target.value
                        )
                      }
                      placeholder={label}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggle(!state)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {state ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}

            {passwordErrors.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm font-medium text-red-800 mb-1">
                  Password requirements:
                </p>
                <ul className="text-sm text-red-700 space-y-1">
                  {passwordErrors.map((error, index) => (
                    <li key={index} className="flex items-center">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleChangePassword}
                disabled={isPasswordSaving || !isPasswordFormValid}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
              >
                {isPasswordSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" /> Change Password
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancelPasswordChange}
                disabled={isPasswordSaving}
                className="border-gray-300 hover:bg-gray-50"
              >
                <X className="h-4 w-4 mr-2" /> Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
