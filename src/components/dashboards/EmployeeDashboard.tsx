
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Calendar, ClipboardList, Plus, CheckCircle2 } from "lucide-react";
import { User } from "@/pages/Index";
import LeaveRequestForm from "../forms/LeaveRequestForm";
import WorkReportForm from "../forms/WorkReportForm";
import { useToast } from "@/hooks/use-toast";

interface EmployeeDashboardProps {
  user: User;
}

const EmployeeDashboard = ({ user }: EmployeeDashboardProps) => {
  const [showLeaveRequest, setShowLeaveRequest] = useState(false);
  const [showWorkReport, setShowWorkReport] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const { toast } = useToast();

  // Mock data
  const stats = {
    attendanceToday: "Not Checked In",
    pendingLeaves: 1,
    activeTasks: 3,
    completedTasks: 8
  };

  const myTasks = [
    { id: 1, title: "Update website content", priority: "High", dueDate: "2024-01-18", status: "In Progress" },
    { id: 2, title: "Prepare quarterly report", priority: "Medium", dueDate: "2024-01-22", status: "Pending" },
    { id: 3, title: "Team meeting preparation", priority: "Low", dueDate: "2024-01-20", status: "Pending" }
  ];

  const leaveHistory = [
    { id: 1, type: "Sick Leave", days: 2, date: "2024-01-10", status: "Approved" },
    { id: 2, type: "Vacation", days: 3, date: "2024-01-05", status: "Pending" },
    { id: 3, type: "Personal", days: 1, date: "2023-12-28", status: "Approved" }
  ];

  const workReports = [
    { id: 1, date: "2024-01-13", tasks: "Completed website updates, attended team meeting", hours: 8 },
    { id: 2, date: "2024-01-12", tasks: "Worked on quarterly report, client calls", hours: 7.5 },
    { id: 3, date: "2024-01-11", tasks: "Code review, bug fixes, documentation", hours: 8 }
  ];

  const handleAttendance = () => {
    setIsCheckedIn(!isCheckedIn);
    toast({
      title: isCheckedIn ? "Checked Out" : "Checked In",
      description: `You have successfully ${isCheckedIn ? "checked out" : "checked in"} for today.`,
    });
  };

  const handleCompleteTask = (taskId: number) => {
    toast({
      title: "Task Completed",
      description: "Task has been marked as completed.",
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h2>
        <div className="flex space-x-2">
          <Button onClick={() => setShowLeaveRequest(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Request Leave
          </Button>
          <Button onClick={() => setShowWorkReport(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Daily Report
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Mark your attendance and manage your day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button 
              onClick={handleAttendance}
              className={isCheckedIn ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
            >
              <Clock className="h-4 w-4 mr-2" />
              {isCheckedIn ? "Check Out" : "Check In"}
            </Button>
            <Badge variant={isCheckedIn ? "default" : "secondary"}>
              Status: {isCheckedIn ? "Checked In" : "Not Checked In"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Status</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{isCheckedIn ? "Checked In" : "Not Checked In"}</div>
            <p className="text-xs text-muted-foreground">Attendance status</p>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTasks}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">My Tasks</TabsTrigger>
          <TabsTrigger value="leaves">Leave History</TabsTrigger>
          <TabsTrigger value="reports">Work Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Tasks</CardTitle>
              <CardDescription>Your assigned tasks and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-gray-500">Due: {task.dueDate}</p>
                      <div className="flex space-x-2 mt-1">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge variant="outline">{task.status}</Badge>
                      </div>
                    </div>
                    {task.status !== "Completed" && (
                      <Button
                        size="sm"
                        onClick={() => handleCompleteTask(task.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaves" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leave History</CardTitle>
              <CardDescription>Your leave requests and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaveHistory.map((leave) => (
                  <div key={leave.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{leave.type}</h4>
                      <p className="text-sm text-gray-500">{leave.days} days - {leave.date}</p>
                    </div>
                    <Badge className={getStatusColor(leave.status)}>
                      {leave.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Work Reports</CardTitle>
              <CardDescription>Your daily work reports and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workReports.map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{report.date}</h4>
                      <Badge variant="outline">{report.hours} hours</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{report.tasks}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showLeaveRequest && (
        <LeaveRequestForm 
          onClose={() => setShowLeaveRequest(false)}
          onSubmit={(leaveData) => {
            console.log("Leave request:", leaveData);
            setShowLeaveRequest(false);
            toast({
              title: "Leave Request Submitted",
              description: "Your leave request has been submitted for approval.",
            });
          }}
        />
      )}

      {showWorkReport && (
        <WorkReportForm 
          onClose={() => setShowWorkReport(false)}
          onSubmit={(reportData) => {
            console.log("Work report:", reportData);
            setShowWorkReport(false);
            toast({
              title: "Work Report Submitted",
              description: "Your daily work report has been submitted successfully.",
            });
          }}
        />
      )}
    </div>
  );
};

export default EmployeeDashboard;
