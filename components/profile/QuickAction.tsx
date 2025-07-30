import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, BarChart3, Settings, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  onSignOut: () => void;
}

export default function QuickActions({ onSignOut }: Props) {
  const router = useRouter();

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => router.push("/profile")}
        >
          <User className="h-4 w-4 mr-3" />
          Profile Information
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => router.push("/profile/quiz-history")}
        >
          <BarChart3 className="h-4 w-4 mr-3" />
          View All Quizzes
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => router.push("/profile/settings")}
        >
          <Settings className="h-4 w-4 mr-3" />
          Account Settings
        </Button>

        <Button
          variant="outline"
          onClick={onSignOut}
          className="w-full text-red-600 border-red-200 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </CardContent>
    </Card>
  );
}
