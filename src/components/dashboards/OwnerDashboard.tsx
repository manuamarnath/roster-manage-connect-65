
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, ClipboardList, BarChart3, Plus, CheckCircle, XCircle } from "lucide-react";
import { User } from "@/pages/Index";
import AddEmployeeForm from "../forms/AddEmployeeForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface OwnerDashboardProps {
  user: User;
}

interface LeaveRequest {
  id: string;
  user_id: string;
  type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  profiles: {
    name: string;
  } | null;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string | null;
  join_date: string;
  role: string;
}

const OwnerDashboard = ({ user }: OwnerDashboardProps) => {
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
  const [recentEmployees, setRecentEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    completedTasks: 0,
    monthlyAttendance: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch employees count
      const { count: employeeCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch pending leave requests with profile names
      const { data: leaveData } = await supabase
        .from('leave_requests')
        .select(`
          *,
          profiles!leave_requests_user_id_fkey(name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      // Fetch recent employees
      const { data: recentEmployeeData } = await supabase
        .from('profiles')
        .select('*')
        .order('join_date', { ascending: false })
        .limit(5);

      // Fetch completed tasks count (for this month)
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: completedTasksCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed')
        .gte('updated_at', startOfMonth.toISOString());

      setStats({
        totalEmployees: employeeCount || 0,
        pendingLeaves: leaveData?.length || 0,
        completedTasks: completedTasksCount || 0,
        monthlyAttendance: 92 // This would need more complex calculation
      });

      // Filter and transform leave data to ensure proper typing
      const validLeaveData = leaveData?.filter(leave => leave.profiles && typeof leave.profiles === 'object' && 'name' in leave.profiles) || [];
      setPendingLeaves(validLeaveData as LeaveRequest[]);
      setRecentEmployees(recentEmployeeData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleApproveLeave = async (leaveId: string, approved: boolean) => {
    try {
      const { error } = await supabase
        .from('leave_requests')
        .update({
          status: approved ? 'approved' : 'rejected',
          approved_by: user.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', leaveId);

      if (error) throw error;

      toast({
        title: approved ? "Leave Approved" : "Leave Rejected",
        description: `Leave request has been ${approved ? "approved" : "rejected"} successfully.`,
      });

      // Refresh data
      fetchDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update leave request",
        variant: "destructive"
      });
    }
  };

  const calculateLeaveDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  };

  const handleEmployeeAdded = () => {
    setShowAddEmployee(false);
    fetchDashboardData(); // Refresh data after adding employee
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
                {pendingLeaves.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No pending leave requests</p>
                ) : (
                  pendingLeaves.map((leave) => (
                    <div key={leave.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{leave.profiles?.name || 'Unknown User'}</h4>
                        <p className="text-sm text-gray-500">
                          {leave.type} - {calculateLeaveDays(leave.start_date, leave.end_date)} days
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(leave.start_date).toLocaleDateString()} to {new Date(leave.end_date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">{leave.reason}</p>
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
                  ))
                )}
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
                      <p className="text-sm text-gray-500">{employee.department || 'No department'}</p>
                      <p className="text-xs text-gray-400">Joined: {new Date(employee.join_date).toLocaleDateString()}</p>
                    </div>
                    <Badge variant="secondary">{employee.role}</Badge>
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
                  <p className="text-2xl font-bold text-green-600">{stats.monthlyAttendance}%</p>
                  <p className="text-sm text-gray-500">Average monthly attendance</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Task Completion</h4>
                  <p className="text-2xl font-bold text-blue-600">{stats.completedTasks}</p>
                  <p className="text-sm text-gray-500">Tasks completed this month</p>
                </div>
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
    </div>
  );
};

export default OwnerDashboard;
