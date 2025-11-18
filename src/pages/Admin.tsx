import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EnhancedDashboard } from "@/components/admin/EnhancedDashboard";
import { StudentList } from "@/components/admin/StudentList";
import { CallScheduler } from "@/components/admin/CallScheduler";
import { CustomFieldsManager } from "@/components/admin/CustomFieldsManager";
import { KanbanBoard } from "@/components/admin/KanbanBoard";
import { ViewSwitcher } from "@/components/admin/ViewSwitcher";
import { SearchFilterBar, Filters } from "@/components/admin/SearchFilterBar";
import { StudentProfile } from "@/components/admin/StudentProfile";
import { AddStudentModal } from "@/components/admin/AddStudentModal";

export default function Admin() {
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"table" | "kanban">("table");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    destination: "",
    stage: "",
    status: "",
    priority: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Access Denied",
        description: "Please log in to continue.",
        variant: "destructive",
      });
      navigate("/login");
      return false;
    }

    try {
      const { data: isAdmin, error } = await supabase
        .rpc('has_role', { 
          _user_id: session.user.id, 
          _role: 'admin' 
        });

      if (error) throw error;

      if (!isAdmin) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin dashboard.",
          variant: "destructive",
        });
        navigate("/portal");
        return false;
      }

      return true;
    } catch (error: any) {
      console.error("Admin access check failed:", error);
      toast({
        title: "Error",
        description: "Failed to verify admin access.",
        variant: "destructive",
      });
      navigate("/portal");
      return false;
    }
  };

  useEffect(() => {
    const verifyAndLoad = async () => {
      const hasAccess = await checkAdminAccess();
      if (hasAccess) {
        setIsLoading(false);
      }
    };
    
    verifyAndLoad();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const handleRefresh = () => {
    setFilters({
      search: "",
      destination: "",
      stage: "",
      status: "",
      priority: "",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navigation />
      <main className="flex-1 py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin CRM</h1>
              <p className="text-slate-200">Student management & consultation system</p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="gap-2 backdrop-blur-sm bg-primary/90 hover:bg-primary"
            >
              <Plus className="h-4 w-4" />
              Add Student
            </Button>
          </div>

          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto backdrop-blur-md bg-card/50">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="fields">Custom Fields</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <EnhancedDashboard />
            </TabsContent>

            <TabsContent value="students" className="space-y-6">
              <SearchFilterBar
                onSearchChange={(search) => setFilters({ ...filters, search })}
                onFilterChange={setFilters}
                filters={filters}
              />

              <div className="flex justify-end">
                <ViewSwitcher view={view} onViewChange={setView} />
              </div>

              {view === "table" ? (
                <div className="backdrop-blur-sm bg-card/50 border border-white/20 rounded-xl overflow-hidden">
                  <StudentList />
                </div>
              ) : (
                <KanbanBoard
                  onViewProfile={setSelectedStudentId}
                  searchQuery={filters.search}
                />
              )}
            </TabsContent>

            <TabsContent value="fields" className="space-y-4">
              <div className="backdrop-blur-sm bg-card/50 border border-white/20 rounded-xl p-6">
                <CustomFieldsManager />
              </div>
            </TabsContent>

            <TabsContent value="calendar" className="space-y-4">
              <div className="backdrop-blur-sm bg-card/50 border border-white/20 rounded-xl p-6">
                <CallScheduler />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />

      {selectedStudentId && (
        <StudentProfile
          studentId={selectedStudentId}
          onClose={() => setSelectedStudentId(null)}
        />
      )}

      <AddStudentModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSuccess={handleRefresh}
      />
    </div>
  );
}