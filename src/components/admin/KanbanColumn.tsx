import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Badge } from "@/components/ui/badge";
import { KanbanCard } from "./KanbanCard";

interface KanbanColumnProps {
  id: string;
  title: string;
  students: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    priority_level: string | null;
    study_destination: string | null;
    course_name: string | null;
  }>;
  onViewProfile: (studentId: string) => void;
}

export function KanbanColumn({ id, title, students, onViewProfile }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex-shrink-0 w-80">
      <div
        className={`backdrop-blur-sm bg-card/30 border border-border/50 rounded-xl p-4 transition-all duration-200 ${
          isOver ? "ring-2 ring-primary shadow-xl" : ""
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <Badge variant="secondary" className="ml-2">
            {students.length}
          </Badge>
        </div>

        <SortableContext
          id={id}
          items={students.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div ref={setNodeRef} className="space-y-3 min-h-[200px]">
            {students.map((student) => (
              <KanbanCard
                key={student.id}
                student={student}
                onViewProfile={onViewProfile}
              />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
