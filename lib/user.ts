import { User } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  provider?: string;
  created_at: string;
  last_sign_in_at?: string;
}

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

export async function updateUserFullName(fullName: string) {
  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: fullName.trim(),
    },
  });
  if (error) throw error;
}
