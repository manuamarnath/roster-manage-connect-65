
import { useState } from "react";
import { User } from "@/pages/Index";
import OwnerDashboard from "./dashboards/OwnerDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";
import EmployeeDashboard from "./dashboards/EmployeeDashboard";

interface DashboardContentProps {
  user: User;
}

const DashboardContent = ({ user }: DashboardContentProps) => {
  switch (user.role) {
    case "owner":
      return <OwnerDashboard user={user} />;
    case "admin":
      return <AdminDashboard user={user} />;
    case "employee":
      return <EmployeeDashboard user={user} />;
    default:
      return <div>Invalid user role</div>;
  }
};

export default DashboardContent;
