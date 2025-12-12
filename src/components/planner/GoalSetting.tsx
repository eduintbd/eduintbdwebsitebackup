import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { Target, Plus, CheckCircle2, Clock, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Goal {
  id: string;
  goal_type: string;
  target_value: number | null;
  target_date: string | null;
  status: string;
  description: string | null;
  module_type: string | null;
}

interface GoalSettingProps {
  user: any;
  goals: Goal[];
  onGoalsUpdate: () => void;
}

export function GoalSetting({ user, goals, onGoalsUpdate }: GoalSettingProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    goal_type: "",
    target_value: "",
    target_date: "",
    description: "",
    module_type: "",
  });
  const [saving, setSaving] = useState(false);

  const goalTypes = [
    { value: "ielts_score", label: "IELTS Target Score", icon: "🎯", hasTargetValue: true, hasModuleType: true, targetLabel: "Target Band Score", targetPlaceholder: "e.g., 7.5" },
    { value: "application_deadline", label: "Application Deadline", icon: "📝", hasTargetValue: false, hasTargetDate: true, hasDescription: true },
    { value: "visa_preparation", label: "Visa Preparation", icon: "📋", hasTargetValue: false, hasTargetDate: true, hasDescription: true },
    { value: "scholarship_applications", label: "Scholarship Applications", icon: "💰", hasTargetValue: true, targetLabel: "Number of Applications", targetPlaceholder: "e.g., 5", hasTargetDate: true },
    { value: "document_collection", label: "Document Collection", icon: "📁", hasTargetValue: true, targetLabel: "Documents to Collect", targetPlaceholder: "e.g., 10", hasTargetDate: true },
    { value: "language_practice", label: "Language Practice", icon: "🗣️", hasTargetValue: true, hasModuleType: true, targetLabel: "Hours per Week", targetPlaceholder: "e.g., 10" },
  ];

  const moduleTypes = [
    { value: "reading", label: "Reading" },
    { value: "writing", label: "Writing" },
    { value: "listening", label: "Listening" },
    { value: "speaking", label: "Speaking" },
    { value: "all", label: "All Modules" },
  ];

  const getSelectedGoalType = () => goalTypes.find(g => g.value === newGoal.goal_type);

  const resetForm = () => {
    setNewGoal({ goal_type: "", target_value: "", target_date: "", description: "", module_type: "" });
  };

  const handleCreateGoal = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to create goals",
        variant: "destructive",
      });
      return;
    }

    if (!newGoal.goal_type) {
      toast({
        title: "Select a goal type",
        description: "Please select a goal type to continue",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from('study_goals').insert({
        user_id: user.id,
        goal_type: newGoal.goal_type,
        target_value: newGoal.target_value ? parseFloat(newGoal.target_value) : null,
        target_date: newGoal.target_date || null,
        description: newGoal.description || null,
        module_type: newGoal.module_type || null,
        status: 'active',
      });

      if (error) {
        console.error("Error creating goal:", error);
        toast({
          title: "Error creating goal",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Goal created!",
          description: "Your study goal has been added.",
        });
        setIsDialogOpen(false);
        resetForm();
        onGoalsUpdate();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async (goalId: string, newStatus: string) => {
    const { error } = await supabase
      .from('study_goals')
      .update({ status: newStatus })
      .eq('id', goalId);

    if (error) {
      toast({
        title: "Error updating goal",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: newStatus === 'completed' ? "Goal completed!" : "Goal updated",
        description: newStatus === 'completed' ? "Congratulations on reaching your goal!" : "Goal status has been updated.",
      });
      onGoalsUpdate();
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    const { error } = await supabase
      .from('study_goals')
      .delete()
      .eq('id', goalId);

    if (error) {
      toast({
        title: "Error deleting goal",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Goal deleted",
        description: "The goal has been removed.",
      });
      onGoalsUpdate();
    }
  };

  const getGoalTypeInfo = (type: string) => {
    return goalTypes.find(g => g.value === type) || { label: type, icon: "🎯" };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'active': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const selectedGoalType = getSelectedGoalType();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Study Goals</h2>
          <p className="text-muted-foreground">Set and track your study abroad milestones</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription>Set a new milestone for your study abroad journey</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Goal Type <span className="text-destructive">*</span></Label>
                <Select value={newGoal.goal_type} onValueChange={(v) => setNewGoal({ ...newGoal, goal_type: v, target_value: "", module_type: "" })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a goal type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {goalTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <span className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          <span>{type.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Conditional fields based on goal type */}
              {selectedGoalType && (
                <>
                  {selectedGoalType.hasModuleType && (
                    <div className="space-y-2">
                      <Label>Module Focus</Label>
                      <Select value={newGoal.module_type} onValueChange={(v) => setNewGoal({ ...newGoal, module_type: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select module..." />
                        </SelectTrigger>
                        <SelectContent>
                          {moduleTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {selectedGoalType.hasTargetValue && (
                    <div className="space-y-2">
                      <Label>{selectedGoalType.targetLabel || "Target Value"}</Label>
                      <Input 
                        type="number" 
                        step={selectedGoalType.value === 'ielts_score' ? '0.5' : '1'}
                        min={selectedGoalType.value === 'ielts_score' ? '1' : '1'}
                        max={selectedGoalType.value === 'ielts_score' ? '9' : undefined}
                        placeholder={selectedGoalType.targetPlaceholder || "Enter target value"}
                        value={newGoal.target_value}
                        onChange={(e) => setNewGoal({ ...newGoal, target_value: e.target.value })}
                      />
                    </div>
                  )}

                  {selectedGoalType.hasTargetDate !== false && (
                    <div className="space-y-2">
                      <Label>Target Date</Label>
                      <Input 
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={newGoal.target_date}
                        onChange={(e) => setNewGoal({ ...newGoal, target_date: e.target.value })}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                      placeholder={
                        selectedGoalType.value === 'ielts_score' ? "e.g., Achieve band 7 in all modules for university admission" :
                        selectedGoalType.value === 'application_deadline' ? "e.g., Submit application to University of Toronto" :
                        selectedGoalType.value === 'visa_preparation' ? "e.g., Complete visa documentation for UK student visa" :
                        selectedGoalType.value === 'scholarship_applications' ? "e.g., Apply for Chevening and Commonwealth scholarships" :
                        selectedGoalType.value === 'document_collection' ? "e.g., Gather transcripts, recommendation letters, and certificates" :
                        selectedGoalType.value === 'language_practice' ? "e.g., Practice speaking with AI tutor 10 hours weekly" :
                        "Describe your goal..."
                      }
                      value={newGoal.description}
                      onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    />
                  </div>
                </>
              )}

              <Button onClick={handleCreateGoal} disabled={saving || !newGoal.goal_type} className="w-full">
                {saving ? "Creating..." : "Create Goal"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {!user && (
        <Card className="border-2 border-dashed">
          <CardContent className="p-8 text-center">
            <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Log in to track your goals</h3>
            <p className="text-muted-foreground mb-4">Create an account to set and monitor your study abroad milestones</p>
            <Button onClick={() => window.location.href = '/login'}>Log In / Sign Up</Button>
          </CardContent>
        </Card>
      )}

      {user && goals.length === 0 && (
        <Card className="border-2 border-dashed">
          <CardContent className="p-8 text-center">
            <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
            <p className="text-muted-foreground mb-4">Start by creating your first study goal</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal) => {
          const typeInfo = getGoalTypeInfo(goal.goal_type);
          const daysLeft = goal.target_date 
            ? Math.ceil((new Date(goal.target_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            : null;

          return (
            <Card key={goal.id} className="border-2 hover:border-primary/50 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{typeInfo.icon}</span>
                    <Badge variant="outline" className={getStatusColor(goal.status)}>
                      {goal.status}
                    </Badge>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDeleteGoal(goal.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <CardTitle className="text-lg">{typeInfo.label}</CardTitle>
                {goal.description && (
                  <CardDescription>{goal.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {goal.target_value && (
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-primary" />
                    <span>Target: {goal.target_value}</span>
                  </div>
                )}
                {goal.target_date && daysLeft !== null && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className={daysLeft < 7 ? 'text-destructive' : ''}>
                      {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Due today!' : 'Overdue'}
                    </span>
                  </div>
                )}
                {goal.status === 'active' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleUpdateStatus(goal.id, 'completed')}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark Complete
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
