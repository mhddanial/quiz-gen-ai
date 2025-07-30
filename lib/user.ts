import { User } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";
import { getCurrentUser } from "./auth";

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  provider?: string;
  created_at: string;
  last_sign_in_at?: string;
}

// Extract user info from Supabase user object
export function extractUserProfile(user: User): UserProfile {
  return {
    id: user.id,
    email: user.email || "",
    full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
    avatar_url:
      user.user_metadata?.avatar_url || user.user_metadata?.picture || "",
    provider: user.app_metadata?.provider || "email",
    created_at: user.created_at,
    last_sign_in_at: user.last_sign_in_at,
  };
}

// Load current user and extract profile
export async function loadUserProfile(): Promise<UserProfile> {
  const user = await getCurrentUser();
  return extractUserProfile(user);
}

// Format date as string
export function formatDateString(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Generate user initials
export function getUserInitials(
  fullName?: string,
  fallbackEmail?: string
): string {
  if (!fullName) return fallbackEmail?.charAt(0).toUpperCase() || "U";
  const names = fullName.trim().split(" ");
  return names.length > 1
    ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    : names[0][0].toUpperCase();
}

// Update user full name
export async function updateUserFullName(fullName: string) {
  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: fullName.trim(),
    },
  });
  if (error) throw error;
}

// Change password directly (not secure if frontend only)
export async function changeUserPassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) throw error;
}

// Verify password by re-login
export async function verifyCurrentPassword(
  email: string,
  currentPassword: string
) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });
  if (error) {
    throw new Error("Current password is incorrect");
  }
  return true;
}

// Change password securely with re-verification
export async function changePasswordSecure(
  currentPassword: string,
  newPassword: string
) {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("User not authenticated");

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });
    if (verifyError) throw new Error("Current password is incorrect");

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    throw error;
  }
}
