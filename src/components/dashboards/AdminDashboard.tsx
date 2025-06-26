import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, ClipboardList, Plus, CheckCircle, XCircle } from "lucide-react";
import { User } from "@/pages/Index";
import AddEmployeeForm from "../forms/AddEmployeeForm";
import AssignTaskForm from "../forms/AssignTaskForm";
import { useToast } from "@/hooks/use-toast";

interface AdminDashboardProps {
  user: User;
}

const AdminDashboard = ({ user }: AdminDashboardProps) => {
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAssignTask, setShowAssignTask] = useState(false);
  const { toast } = useToast();

  // Mock data
  const stats = {
    teamMembers: 8,
    pendingLeaves: 2,
    activeTasks: 12
  };

  const pendingLeaves = [
    { id: 1, employee: "Alice Cooper", type: "Sick Leave", days: 2, date: "2024-01-15" },
    { id: 2, employee: "Bob Wilson", type: "Personal", days: 1, date: "2024-01-18" }
  ];

  const teamMembers = [
    { id: 1, name: "Alice Cooper", department: "Marketing", status: "Active", lastLogin: "2024-01-14" },
    { id: 2, name: "Bob Wilson", department: "Sales", status: "Active", lastLogin: "2024-01-14" },
    { id: 3, name: "Charlie Brown", department: "Development", status: "Active", lastLogin: "2024-01-13" },
    { id: 4, name: "Diana Prince", department: "Marketing", status: "On Leave", lastLogin: "2024-01-10" }
  ];

  const activeTasks = [
    { id: 1, title: "Marketing Campaign", assignee: "Alice Cooper", priority: "High", dueDate: "2024-01-20" },
    { id: 2, title: "Sales Report", assignee: "Bob Wilson", priority: "Medium", dueDate: "2024-01-18" },
    { id: 3, title: "Website Update", assignee: "Charlie Brown", priority: "Low", dueDate: "2024-01-25" }
  ];

  const handleApproveLeave = (leaveId: number, approved: boolean) => {
    toast({
      title: approved ? "Leave Approved" : "Leave Rejected",
      description: `Leave request has been ${approved ? "approved" : "rejected"} successfully.`,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEmployeeAdded = () => {
    setShowAddEmployee(false);
    toast({
      title: "Employee Added",
      description: "Employee has been added successfully.",
    });
  };

  const handleTaskAssigned = () => {
    setShowAssignTask(false);
    toast({
      title: "Task Assigned",
      description: "Task has been assigned successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
        <div className="flex space-x-2">
          <Button onClick={() => setShowAddEmployee(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
          <Button onClick={() => setShowAssignTask(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Assign Task
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teamMembers}</div>
            <p className="text-xs text-muted-foreground">Under your management</p>
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
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTasks}</div>
            <p className="text-xs text-muted-foreground">Currently assigned</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="leaves" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leaves">Leave Requests</TabsTrigger>
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="tasks">Active Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="leaves" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Leave Requests</CardTitle>
              <CardDescription>Review and approve team member leave requests</CardDescription>
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

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage your team members and their information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-gray-500">{member.department}</p>
                      <p className="text-xs text-gray-400">Last login: {member.lastLogin}</p>
                    </div>
                    <Badge variant={member.status === "Active" ? "default" : "secondary"}>
                      {member.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Tasks</CardTitle>
              <CardDescription>Monitor and manage assigned tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-gray-500">Assigned to: {task.assignee}</p>
                      <p className="text-xs text-gray-400">Due: {task.dueDate}</p>
                    </div>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showAddEmployee && (
        <AddEmployeeForm 
          onClose={() => setShowAddEmployee(false)}
          onSubmit={handleEmployeeAdded}
        />
      )}

      {showAssignTask && (
        <AssignTaskForm 
          onClose={() => setShowAssignTask(false)}
          onSubmit={handleTaskAssigned}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
