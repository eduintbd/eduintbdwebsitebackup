import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { StudentInfoGrid } from "./StudentInfoGrid";
import { StudentCommunicationPanel } from "./StudentCommunicationPanel";
import { DocumentUpload } from "../portal/DocumentUpload";
import { StudentLifecycleView } from "./StudentLifecycleView";
import { StudentIELTSProgress } from "./StudentIELTSProgress";
import { StudentStudyPlanner } from "./StudentStudyPlanner";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

interface StudentProfileProps {
  studentId: string;
  onClose: () => void;
}

export function StudentProfile({ studentId, onClose }: StudentProfileProps) {
  const [student, setStudent] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    loadStudent();
  }, [studentId]);

  const loadStudent = async () => {
    const { data } = await supabase
      .from("student_applications")
      .select("*")
      .eq("id", studentId)
      .single();

    if (data) {
      setStudent(data);
      setAdminNotes(data.admin_notes || "");
    }
  };

  const saveNotes = async () => {
    await supabase
      .from("student_applications")
      .update({ admin_notes: adminNotes })
      .eq("id", studentId);
  };

  if (!student) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex justify-end animate-in slide-in-from-right duration-300">
      <div className="w-full lg:w-3/5 h-full bg-gradient-to-br from-card via-card to-card/95 border-l border-border shadow-2xl">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="backdrop-blur-xl bg-primary/10 border-b border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
                    {getInitials(student.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{student.name}</h2>
                  <p className="text-sm text-muted-foreground">{student.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">{student.lifecycle_stage || "Unknown"}</Badge>
              {student.priority_level && (
                <Badge
                  variant={
                    student.priority_level === "high"
                      ? "destructive"
                      : student.priority_level === "medium"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {student.priority_level} priority
                </Badge>
              )}
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1">
            <div className="p-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="flex flex-wrap gap-1 h-auto p-1 mb-6 sm:grid sm:grid-cols-4 lg:grid-cols-7">
                  <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 py-1.5">Overview</TabsTrigger>
                  <TabsTrigger value="ielts" className="text-xs sm:text-sm px-2 py-1.5">IELTS</TabsTrigger>
                  <TabsTrigger value="planner" className="text-xs sm:text-sm px-2 py-1.5">Planner</TabsTrigger>
                  <TabsTrigger value="communications" className="text-xs sm:text-sm px-2 py-1.5">Comms</TabsTrigger>
                  <TabsTrigger value="documents" className="text-xs sm:text-sm px-2 py-1.5">Docs</TabsTrigger>
                  <TabsTrigger value="notes" className="text-xs sm:text-sm px-2 py-1.5">Notes</TabsTrigger>
                  <TabsTrigger value="lifecycle" className="text-xs sm:text-sm px-2 py-1.5">Lifecycle</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <StudentInfoGrid student={student} />
                </TabsContent>

                <TabsContent value="ielts" className="space-y-6">
                  <StudentIELTSProgress studentEmail={student.email} />
                </TabsContent>

                <TabsContent value="planner" className="space-y-6">
                  <StudentStudyPlanner studentEmail={student.email} />
                </TabsContent>

                <TabsContent value="communications">
                  <StudentCommunicationPanel
                    student={{
                      id: student.id,
                      email: student.email,
                      phone: student.phone,
                      name: student.name,
                    }}
                  />
                </TabsContent>

                <TabsContent value="documents">
                  <DocumentUpload 
                    userId={student.id}
                    userEmail={student.email}
                    documents={student.document_urls || []}
                    onDocumentsChange={loadStudent}
                    studentName={student.name}
                  />
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Admin Notes
                    </label>
                    <Textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      onBlur={saveNotes}
                      placeholder="Add internal notes about this student..."
                      rows={10}
                      className="bg-background/50"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="lifecycle">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b">
                      <Badge variant="default" className="text-lg px-4 py-2">
                        {student.lifecycle_stage || 'Lead Generation'}
                      </Badge>
                    </div>
                    <StudentInfoGrid student={student} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
