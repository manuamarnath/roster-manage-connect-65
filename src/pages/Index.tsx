
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserCircle, Settings, LogOut } from "lucide-react";
import DashboardContent from "@/components/DashboardContent";
import AuthPage from "@/components/AuthPage";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

export type UserRole = "owner" | "admin" | "employee";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  joinDate: string;
}

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <AuthPage />;
  }

  const currentUser: User = {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
    department: profile.department || '',
    joinDate: profile.join_date
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "owner":
        return "bg-purple-100 text-purple-800";
      case "admin":
        return "bg-blue-100 text-blue-800";
      case "employee":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Employee Management System
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <UserCircle className="h-8 w-8 text-gray-400" />
                <div className="text-sm">
                  <p className="font-medium text-gray-700">{currentUser.name}</p>
                  <Badge className={getRoleColor(currentUser.role)}>
                    {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardContent user={currentUser} />
      </main>
    </div>
  );
};

export default Index;
