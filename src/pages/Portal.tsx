import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { 
  GraduationCap, 
  FileText, 
  Plane,
  Bell,
  Calendar,
  LayoutDashboard
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AdvisorConnection } from "@/components/portal/AdvisorConnection";
import { ConversationHistory } from "@/components/portal/ConversationHistory";
import { SavedResources } from "@/components/portal/SavedResources";
import { AdvisorNotes } from "@/components/portal/AdvisorNotes";
import { TimelineView } from "@/components/portal/TimelineView";
import { ProfileSection } from "@/components/portal/ProfileSection";
import { DocumentCenter } from "@/components/portal/DocumentCenter";
import { NotificationCenter } from "@/components/portal/NotificationCenter";
import { ProgressAnalytics } from "@/components/portal/ProgressAnalytics";
import { TaskChecklist } from "@/components/portal/TaskChecklist";
import { MobileNav } from "@/components/portal/MobileNav";
import { IELTSProgressDashboard } from "@/components/portal/IELTSProgressDashboard";
import { StudyPlannerSummary } from "@/components/portal/StudyPlannerSummary";
import { ProfileAvatar } from "@/components/portal/ProfileAvatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Portal() {
  const [user, setUser] = useState<any>(null);
  const [application, setApplication] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast} = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    setupAuthListener();
  }, []);

  const setupAuthListener = () => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/login");
      } else {
        setUser(session.user);
        loadApplication(session.user.email!);
      }
    });

    return () => subscription.unsubscribe();
  };

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/login");
      return;
    }

    setUser(session.user);
    await loadApplication(session.user.email!);
    setIsLoading(false);
  };

  const loadApplication = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('student_applications')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        setApplication(null);
        return;
      }
      
      setApplication(data);
      
      // Load all messages (not just 5)
      const { data: messagesData } = await supabase
        .from('student_messages')
        .select('*')
        .eq('student_id', data.id)
        .order('created_at', { ascending: false });
      
      setMessages(messagesData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load your application data.",
        variant: "destructive",
      });
    }
  };

  const handleMessageSent = () => {
    if (application) {
      loadApplication(application.email);
    }
  };

  const handleAvatarUpdate = (url: string) => {
    setApplication((prev: any) => ({ ...prev, avatar_url: url }));
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'submitted': 'secondary',
      'under_review': 'default',
      'approved': 'default',
      'rejected': 'destructive'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status?.replace('_', ' ')}</Badge>;
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>No Application Found</CardTitle>
              <CardDescription>
                You haven't submitted an application yet. Please fill out the contact form on our homepage to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/">Go to Homepage</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/20 pb-24 md:pb-0">
      <Navigation />
      
      <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-6 sm:pb-8 max-w-[1600px]">
        {/* Welcome Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
            <ProfileAvatar
              name={application.name}
              avatarUrl={application.avatar_url}
              studentId={application.id}
              onAvatarUpdate={handleAvatarUpdate}
              size="lg"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-0.5 sm:mb-1 truncate">
                Welcome back, {application.name.split(' ')[0]}!
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                Track your study abroad journey
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 space-y-0 p-2 sm:p-3 md:p-4">
              <CardTitle className="text-xs sm:text-sm font-medium">Status</CardTitle>
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 sm:p-3 md:p-4 pt-0">
              <div className="text-sm sm:text-base md:text-xl font-bold mb-0.5 sm:mb-1">{getStatusBadge(application.application_status || 'submitted')}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Current stage</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 space-y-0 p-2 sm:p-3 md:p-4">
              <CardTitle className="text-xs sm:text-sm font-medium">Destination</CardTitle>
              <Plane className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 sm:p-3 md:p-4 pt-0">
              <div className="text-sm sm:text-base md:text-xl font-bold mb-0.5 sm:mb-1 truncate">{application.study_destination || 'Not set'}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Study country</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 space-y-0 p-2 sm:p-3 md:p-4">
              <CardTitle className="text-xs sm:text-sm font-medium">Next Session</CardTitle>
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 sm:p-3 md:p-4 pt-0">
              <div className="text-sm sm:text-base md:text-xl font-bold mb-0.5 sm:mb-1 truncate">
                {application.session_date ? new Date(application.session_date).toLocaleDateString() : 'Not scheduled'}
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Consultation</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 space-y-0 p-2 sm:p-3 md:p-4">
              <CardTitle className="text-xs sm:text-sm font-medium">Messages</CardTitle>
              <Bell className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 sm:p-3 md:p-4 pt-0">
              <div className="text-sm sm:text-base md:text-xl font-bold mb-0.5 sm:mb-1">
                {messages.filter(m => !m.read_at && m.sender_type === 'admin').length}
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Unread</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation - Desktop */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="hidden md:inline-flex w-full justify-start bg-muted/50 p-1 flex-wrap gap-1">
            <TabsTrigger value="overview" className="flex items-center gap-2 text-sm">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="planner" className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              Study Planner
            </TabsTrigger>
            <TabsTrigger value="ielts" className="flex items-center gap-2 text-sm">
              <GraduationCap className="h-4 w-4" />
              IELTS Progress
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2 text-sm">
              <Bell className="h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2 text-sm">
              <GraduationCap className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <ProgressAnalytics application={application} />
                <TaskChecklist application={application} />
                <ConversationHistory
                  messages={messages}
                  studentId={application.id}
                  studentEmail={application.email}
                  onMessageSent={handleMessageSent}
                />
              </div>
              <div className="space-y-4 sm:space-y-6">
                <AdvisorConnection
                  studentPhone={application.phone}
                  studentEmail={application.email}
                  studentName={application.name}
                />
                <AdvisorNotes
                  notes={application.admin_notes}
                  sessionNotes={application.session_notes}
                />
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <CardHeader className="p-3 sm:p-4">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
                      IELTS Portal
                    </CardTitle>
                    <CardDescription className="text-xs">Access your preparation</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 pt-0">
                    <Button asChild className="w-full text-sm">
                      <Link to="/ielts-learning">Access Portal</Link>
                    </Button>
                  </CardContent>
                </Card>
                <SavedResources studentId={application.id} />
              </div>
            </div>
          </TabsContent>

          {/* Study Planner Tab */}
          <TabsContent value="planner" className="space-y-4 sm:space-y-6">
            <StudyPlannerSummary />
          </TabsContent>

          {/* IELTS Progress Tab */}
          <TabsContent value="ielts" className="space-y-4 sm:space-y-6">
            <IELTSProgressDashboard />
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <TimelineView application={application} onUpdate={() => loadApplication(user?.email)} />
              <ProgressAnalytics application={application} />
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4 sm:space-y-6">
            <DocumentCenter application={application} onUpdate={() => loadApplication(user?.email)} />
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2">
                <ConversationHistory
                  messages={messages}
                  studentId={application.id}
                  studentEmail={application.email}
                  onMessageSent={handleMessageSent}
                />
              </div>
              <div>
                <NotificationCenter messages={messages} application={application} />
              </div>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4 sm:space-y-6">
            <ProfileSection application={application} />
          </TabsContent>
        </Tabs>

        {/* Mobile Navigation */}
        <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
      </main>

      <Footer />
    </div>
  );
}
