import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, X, Loader2 } from "lucide-react";
import { UserProfile } from "@/lib/user";

interface Props {
  isEditing: boolean;
  isSaving: boolean;
  profile: UserProfile;
  editForm: { fullName: string; email: string };
  handleFormChange: (field: "fullName", value: string) => void;
  handleSaveProfile: () => void;
  handleCancelEdit: () => void;
  formatDate: (date: string) => string;
}

export default function ProfileForm({
  isEditing,
  isSaving,
  profile,
  editForm,
  handleFormChange,
  handleSaveProfile,
  handleCancelEdit,
  formatDate
}: Props) {
  
  return (
    <div className="space-y-6">
      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 w-full">
              <Label htmlFor="fullName">Name</Label>
              <Input
                id="fullName"
                value={editForm.fullName}
                onChange={(e) => handleFormChange("fullName", e.target.value)}
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
            <p className="text-xs text-gray-500">Email cannot be changed</p>
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
              <p className="text-gray-900 font-medium mt-1">{profile.email}</p>
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
  );
}
