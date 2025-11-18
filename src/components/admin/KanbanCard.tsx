import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MessageSquare, Phone } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface KanbanCardProps {
  student: {
    id: string;
    name: string;
    email: string;
    phone: string;
    priority_level: string | null;
    study_destination: string | null;
    course_name: string | null;
  };
  onViewProfile: (studentId: string) => void;
}

export function KanbanCard({ student, onViewProfile }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: student.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="backdrop-blur-sm bg-card/80 hover:bg-card/90 border-border/50 transition-all duration-200 hover:shadow-lg cursor-grab active:cursor-grabbing">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(student.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-foreground truncate">
                {student.name}
              </h4>
              <p className="text-xs text-muted-foreground truncate">{student.email}</p>
            </div>
            {student.priority_level && (
              <Badge variant={getPriorityColor(student.priority_level)} className="shrink-0">
                {student.priority_level}
              </Badge>
            )}
          </div>

          {student.study_destination && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {student.study_destination}
              </Badge>
            </div>
          )}

          {student.course_name && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {student.course_name}
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onViewProfile(student.id);
              }}
            >
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
            <Button size="sm" variant="ghost" className="px-2">
              <MessageSquare className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" className="px-2">
              <Phone className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
