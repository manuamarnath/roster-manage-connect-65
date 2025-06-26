
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface WorkReportFormProps {
  onClose: () => void;
  onSubmit: (reportData: any) => void;
}

const WorkReportForm = ({ onClose, onSubmit }: WorkReportFormProps) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    hoursWorked: "",
    tasksCompleted: "",
    challenges: "",
    achievements: "",
    nextDayPlan: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Daily Work Report</DialogTitle>
          <DialogDescription>
            Submit your daily work report to keep your manager informed about your progress.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hoursWorked">Hours Worked</Label>
              <Input
                id="hoursWorked"
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={formData.hoursWorked}
                onChange={(e) => handleInputChange("hoursWorked", e.target.value)}
                placeholder="8"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tasksCompleted">Tasks Completed Today</Label>
            <Textarea
              id="tasksCompleted"
              value={formData.tasksCompleted}
              onChange={(e) => handleInputChange("tasksCompleted", e.target.value)}
              placeholder="List the tasks you completed today..."
              rows={3}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="achievements">Key Achievements</Label>
            <Textarea
              id="achievements"
              value={formData.achievements}
              onChange={(e) => handleInputChange("achievements", e.target.value)}
              placeholder="Highlight your key achievements and milestones..."
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="challenges">Challenges Faced</Label>
            <Textarea
              id="challenges"
              value={formData.challenges}
              onChange={(e) => handleInputChange("challenges", e.target.value)}
              placeholder="Describe any challenges or roadblocks you encountered..."
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nextDayPlan">Tomorrow's Plan</Label>
            <Textarea
              id="nextDayPlan"
              value={formData.nextDayPlan}
              onChange={(e) => handleInputChange("nextDayPlan", e.target.value)}
              placeholder="Outline your plan for tomorrow..."
              rows={2}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Submit Report
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WorkReportForm;
