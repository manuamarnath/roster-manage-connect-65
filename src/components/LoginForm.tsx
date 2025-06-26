
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, UserRole } from "@/pages/Index";

interface LoginFormProps {
  onLogin: (user: User) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("employee");

  // Mock users for demo
  const mockUsers = {
    owner: {
      id: "1",
      name: "John Smith",
      email: "owner@company.com",
      role: "owner" as UserRole,
      department: "Management",
      joinDate: "2020-01-15"
    },
    admin: {
      id: "2",
      name: "Sarah Johnson",
      email: "admin@company.com",
      role: "admin" as UserRole,
      department: "HR",
      joinDate: "2021-03-10"
    },
    employee: {
      id: "3",
      name: "Mike Davis",
      email: "employee@company.com",
      role: "employee" as UserRole,
      department: "Development",
      joinDate: "2022-06-20"
    }
  };

  const handleLogin = () => {
    const user = mockUsers[selectedRole];
    onLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Employee Management System</CardTitle>
          <CardDescription>
            Sign in to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Login as (Demo)</Label>
            <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleLogin} className="w-full">
            Sign In
          </Button>
          <div className="text-sm text-gray-500 text-center mt-4">
            <p>Demo Accounts:</p>
            <p>Owner: owner@company.com</p>
            <p>Admin: admin@company.com</p>
            <p>Employee: employee@company.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
