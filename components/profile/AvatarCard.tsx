import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Camera, Mail, Shield } from "lucide-react";
import { UserProfile } from "@/lib/user";
import React from "react";

interface Props {
  profile: UserProfile;
  getInitials: (fullName?: string) => string;
  GoogleIcon: React.ReactNode;
}

export default function AvatarCard({ profile, getInitials, GoogleIcon }: Props) {
  return (
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
  );
}
