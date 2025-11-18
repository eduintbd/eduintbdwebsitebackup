import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  lifecycle_stage: string | null;
  visa_status: string | null;
  priority_level: string | null;
  study_destination: string | null;
  course_name: string | null;
}

interface KanbanBoardProps {
  onViewProfile: (studentId: string) => void;
  searchQuery?: string;
}

const STAGES = [
  { id: "Lead Generation", title: "Initial Inquiry" },
  { id: "Counseling", title: "Counseling" },
  { id: "Application", title: "Application" },
  { id: "Admission & Visa", title: "Visa Process" },
  { id: "approved", title: "Approved" },
];

export function KanbanBoard({ onViewProfile, searchQuery = "" }: KanbanBoardProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    loadStudents();
  }, [searchQuery]);

  const loadStudents = async () => {
    try {
      let query = supabase
        .from("student_applications")
        .select("id, name, email, phone, lifecycle_stage, visa_status, priority_level, study_destination, course_name");

      if (searchQuery) {
        query = query.or(
          `name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error("Error loading students:", error);
      toast({
        title: "Error",
        description: "Failed to load students",
        variant: "destructive",
      });
    }
  };

  const getStudentsByStage = (stageId: string) => {
    if (stageId === "approved") {
      return students.filter((s) => s.visa_status === "approved");
    }
    return students.filter((s) => s.lifecycle_stage === stageId);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const student = students.find((s) => s.id === event.active.id);
    setActiveStudent(student || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveStudent(null);

    if (!over || active.id === over.id) return;

    const studentId = active.id as string;
    const newStage = over.id as string;

    // Optimistic update
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          if (newStage === "approved") {
            return { ...s, visa_status: "approved" };
          }
          return { ...s, lifecycle_stage: newStage };
        }
        return s;
      })
    );

    try {
      const updates: any = {};
      if (newStage === "approved") {
        updates.visa_status = "approved";
      } else {
        updates.lifecycle_stage = newStage;
        if (newStage !== "Admission & Visa") {
          updates.visa_status = null;
        }
      }

      const { error } = await supabase
        .from("student_applications")
        .update(updates)
        .eq("id", studentId);

      if (error) throw error;

      toast({
        title: "Student Updated",
        description: "Student stage updated successfully",
      });
    } catch (error) {
      console.error("Error updating student:", error);
      toast({
        title: "Error",
        description: "Failed to update student stage",
        variant: "destructive",
      });
      // Revert optimistic update
      loadStudents();
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <ScrollArea className="w-full">
        <div className="flex gap-6 pb-4">
          {STAGES.map((stage) => (
            <KanbanColumn
              key={stage.id}
              id={stage.id}
              title={stage.title}
              students={getStudentsByStage(stage.id)}
              onViewProfile={onViewProfile}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <DragOverlay>
        {activeStudent ? (
          <div className="rotate-3 scale-105 opacity-90">
            <KanbanCard student={activeStudent} onViewProfile={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
