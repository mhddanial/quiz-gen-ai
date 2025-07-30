'use client';

import PageShell from "@/components/layouts/PageShell";
import QuickActions from "@/components/profile/QuickAction";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signOutUser } from "@/lib/auth";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const router = useRouter();
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

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
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) errors.push("At least one special character");
    return errors;
  };

  const handlePasswordFormChange = (field: keyof typeof passwordForm, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
    if (field === "newPassword") {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }
  };

  const handleCancelPasswordChange = () => {
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordErrors([]);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleChangePassword = async () => {
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
      // TODO: replace this with your actual API call
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordErrors([]);
      toast.success("Password changed successfully!");
    } catch (e) {
      setPasswordErrors(["Failed to change password. Please check your current password."]);
    } finally {
      setIsPasswordSaving(false);
    }
  };

  const isPasswordFormValid =
    passwordForm.currentPassword.trim() &&
    passwordForm.newPassword.trim() &&
    passwordForm.confirmPassword.trim() &&
    passwordForm.newPassword === passwordForm.confirmPassword &&
    validatePassword(passwordForm.newPassword).length === 0;

  return (
    <PageShell
      title="Account Settings"
      subtitle="Manage your security settings here"
      breadcrumbs={[{ label: "Profile" }]}
      rightSidebar={<QuickActions onSignOut={handleSignOut} />}
    >
      <Card className="shadow-lg border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div>
            <CardTitle className="text-lg sm:text-xl">Change Password</CardTitle>
            <CardDescription className="text-blue-100">
              Update your password to keep your account secure
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <div className="space-y-4">
            {[
              { id: "currentPassword", label: "Current Password", state: showCurrentPassword, toggle: setShowCurrentPassword },
              { id: "newPassword", label: "New Password", state: showNewPassword, toggle: setShowNewPassword },
              { id: "confirmPassword", label: "Confirm New Password", state: showConfirmPassword, toggle: setShowConfirmPassword }
            ].map(({ id, label, state, toggle }) => (
              <div key={id} className="space-y-2">
                <Label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id={id}
                    type={state ? "text" : "password"}
                    value={passwordForm[id as keyof typeof passwordForm]}
                    onChange={(e) => handlePasswordFormChange(id as keyof typeof passwordForm, e.target.value)}
                    placeholder={label}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => toggle(!state)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {state ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}

            {passwordErrors.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm font-medium text-red-800 mb-1">Password requirements:</p>
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
