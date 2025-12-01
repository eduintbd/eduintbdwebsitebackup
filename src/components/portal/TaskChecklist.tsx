import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Square, Calendar, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface TaskChecklistProps {
  application: any;
}

export function TaskChecklist({ application }: TaskChecklistProps) {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Complete initial consultation",
      completed: application.consultation_completed,
      dueDate: application.session_date,
      priority: "high",
    },
    {
      id: 2,
      title: "Upload all required documents",
      completed: application.documents_uploaded,
      dueDate: null,
      priority: "high",
    },
    {
      id: 3,
      title: "Review offer letter",
      completed: application.offer_letter_received,
      dueDate: null,
      priority: "medium",
    },
    {
      id: 4,
      title: "Submit visa application",
      completed: application.visa_application_date !== null,
      dueDate: application.visa_application_date,
      priority: "high",
    },
    {
      id: 5,
      title: "Complete IELTS preparation",
      completed: false,
      dueDate: null,
      priority: "medium",
    },
    {
      id: 6,
      title: "Arrange accommodation",
      completed: false,
      dueDate: null,
      priority: "low",
    },
  ]);

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Task Checklist
            </CardTitle>
            <CardDescription>
              {completedCount} of {tasks.length} tasks completed
            </CardDescription>
          </div>
          <Badge variant="outline">
            {Math.round((completedCount / tasks.length) * 100)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div 
              key={task.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                task.completed 
                  ? "bg-muted/50 opacity-75" 
                  : "bg-card hover:bg-accent/5"
              }`}
            >
              <Checkbox 
                checked={task.completed}
                disabled
                className="mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className={`text-sm font-medium ${
                    task.completed ? "line-through text-muted-foreground" : ""
                  }`}>
                    {task.title}
                  </p>
                  <Badge 
                    variant={
                      task.priority === "high" ? "destructive" :
                      task.priority === "medium" ? "secondary" : "outline"
                    }
                    className="text-xs flex-shrink-0"
                  >
                    {task.priority}
                  </Badge>
                </div>
                {task.dueDate && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {pendingTasks.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                  {pendingTasks.length} pending tasks
                </p>
                <p className="text-xs text-yellow-800 dark:text-yellow-200 mt-1">
                  Complete these tasks to progress your application
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
