
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, ClipboardList, BarChart3, Plus, CheckCircle, XCircle } from "lucide-react";
import { User } from "@/pages/Index";
import AddEmployeeForm from "../forms/AddEmployeeForm";
import { useToast } from "@/hooks/use-toast";

interface OwnerDashboardProps {
  user: User;
}

const OwnerDashboard = ({ user }: OwnerDashboardProps) => {
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const { toast } = useToast();

  // Mock data
  const stats = {
    totalEmployees: 15,
    pendingLeaves: 3,
    completedTasks: 42,
    monthlyAttendance: 92
  };

  const pendingLeaves = [
    { id: 1, employee: "Alice Cooper", type: "Sick Leave", days: 2, date: "2024-01-15" },
    { id: 2, employee: "Bob Wilson", type: "Vacation", days: 5, date: "2024-01-20" },
    { id: 3, employee: "Charlie Brown", type: "Personal", days: 1, date: "2024-01-18" }
  ];

  const recentEmployees = [
    { id: 1, name: "Alice Cooper", department: "Marketing", joinDate: "2024-01-10" },
    { id: 2, name: "Bob Wilson", department: "Sales", joinDate: "2024-01-08" },
    { id: 3, name: "Charlie Brown", department: "Development", joinDate: "2024-01-05" }
  ];

  const handleApproveLeave = (leaveId: number, approved: boolean) => {
    toast({
      title: approved ? "Leave Approved" : "Leave Rejected",
      description: `Leave request has been ${approved ? "approved" : "rejected"} successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Owner Dashboard</h2>
        <Button onClick={() => setShowAddEmployee(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Active employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Leaves</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingLeaves}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTasks}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyAttendance}%</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="leaves" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leaves">Pending Leaves</TabsTrigger>
          <TabsTrigger value="employees">Recent Employees</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="leaves" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Leave Requests</CardTitle>
              <CardDescription>Review and approve employee leave requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingLeaves.map((leave) => (
                  <div key={leave.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{leave.employee}</h4>
                      <p className="text-sm text-gray-500">{leave.type} - {leave.days} days</p>
                      <p className="text-xs text-gray-400">Requested for: {leave.date}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleApproveLeave(leave.id, true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleApproveLeave(leave.id, false)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Employees</CardTitle>
              <CardDescription>Recently added employees to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEmployees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{employee.name}</h4>
                      <p className="text-sm text-gray-500">{employee.department}</p>
                      <p className="text-xs text-gray-400">Joined: {employee.joinDate}</p>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Reports</CardTitle>
              <CardDescription>Overview of system performance and employee metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Attendance Summary</h4>
                  <p className="text-2xl font-bold text-green-600">92%</p>
                  <p className="text-sm text-gray-500">Average monthly attendance</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Task Completion</h4>
                  <p className="text-2xl font-bold text-blue-600">87%</p>
                  <p className="text-sm text-gray-500">Tasks completed on time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showAddEmployee && (
        <AddEmployeeForm 
          onClose={() => setShowAddEmployee(false)}
          onSubmit={(employeeData) => {
            console.log("New employee:", employeeData);
            setShowAddEmployee(false);
            toast({
              title: "Employee Added",
              description: `${employeeData.name} has been added successfully.`,
            });
          }}
        />
      )}
    </div>
  );
};

export default OwnerDashboard;
