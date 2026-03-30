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
  LayoutDashboard,
  TrendingUp,
  Clock
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
import { ProUpgradeCard } from "@/components/portal/ProUpgradeCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Portal() {
  const [user, setUser] = useState<any>(null);
  const [application, setApplication] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
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
    const config: Record<string, { variant: any; label: string }> = {
      'submitted': { variant: 'secondary', label: 'Submitted' },
      'under_review': { variant: 'default', label: 'Under Review' },
      'approved': { variant: 'default', label: 'Approved' },
      'rejected': { variant: 'destructive', label: 'Rejected' },
    };
    const c = config[status] || { variant: 'secondary', label: status?.replace('_', ' ') || 'Unknown' };
    return <Badge variant={c.variant}>{c.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary/10 flex items-center justify-center animate-pulse">
            <GraduationCap className="w-8 h-8 text-secondary" />
          </div>
          <p className="text-muted-foreground text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center px-4">
          <Card className="max-w-md rounded-3xl border-border/50 shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <FileText className="w-8 h-8 text-secondary" />
              </div>
              <CardTitle className="text-2xl font-display">No Application Found</CardTitle>
              <CardDescription className="text-base">
                You haven't submitted an application yet. Fill out the contact form on our homepage to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full rounded-xl h-12 bg-secondary hover:bg-secondary/90 text-white">
                <Link to="/">Go to Homepage</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const unreadCount = messages.filter(m => !m.read_at && m.sender_type === 'admin').length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20 pb-24 md:pb-0">
      <Navigation />

      <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-6 sm:pb-8 max-w-[1600px]">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary to-[hsl(215,50%,20%)] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full blur-[60px]" />

            <div className="relative z-10 flex items-center gap-4 sm:gap-6">
              <ProfileAvatar
                name={application.name}
                avatarUrl={application.avatar_url}
                studentId={application.id}
                onAvatarUpdate={handleAvatarUpdate}
                size="lg"
              />
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold mb-1 truncate">
                  Welcome back, {application.name.split(' ')[0]}!
                </h1>
                <p className="text-white/70 text-sm sm:text-base">
                  Track your study abroad journey with Universal Council
                </p>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl">
                  <Link to="/ielts-learning">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    IELTS Portal
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="rounded-2xl border-border/50 hover:shadow-md transition-all duration-300 overflow-hidden group">
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="mb-1">{getStatusBadge(application.application_status || 'submitted')}</div>
              <p className="text-xs text-muted-foreground mt-1">Application Status</p>
            </div>
          </Card>

          <Card className="rounded-2xl border-border/50 hover:shadow-md transition-all duration-300 overflow-hidden group">
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plane className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="text-lg font-bold truncate">{application.study_destination || 'Not set'}</div>
              <p className="text-xs text-muted-foreground mt-1">Destination</p>
            </div>
          </Card>

          <Card className="rounded-2xl border-border/50 hover:shadow-md transition-all duration-300 overflow-hidden group">
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              <div className="text-lg font-bold truncate">
                {application.session_date ? new Date(application.session_date).toLocaleDateString() : 'TBD'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Next Session</p>
            </div>
          </Card>

          <Card className="rounded-2xl border-border/50 hover:shadow-md transition-all duration-300 overflow-hidden group">
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Bell className="h-5 w-5 text-emerald-600" />
                </div>
                {unreadCount > 0 && (
                  <span className="w-6 h-6 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="text-lg font-bold">{unreadCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Unread Messages</p>
            </div>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="hidden md:inline-flex w-full justify-start bg-card border border-border/50 p-1.5 rounded-2xl flex-wrap gap-1">
            <TabsTrigger value="overview" className="flex items-center gap-2 text-sm rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="planner" className="flex items-center gap-2 text-sm rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
              <Calendar className="h-4 w-4" />
              Study Planner
            </TabsTrigger>
            <TabsTrigger value="ielts" className="flex items-center gap-2 text-sm rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
              <GraduationCap className="h-4 w-4" />
              IELTS Progress
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2 text-sm rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
              <Calendar className="h-4 w-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2 text-sm rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2 text-sm rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
              <Bell className="h-4 w-4" />
              Messages
              {unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center ml-1">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2 text-sm rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
              <GraduationCap className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <ProgressAnalytics application={application} />
                <TaskChecklist application={application} />
                <ConversationHistory
                  messages={messages}
                  studentId={application.id}
                  studentEmail={application.email}
                  onMessageSent={handleMessageSent}
                />
              </div>
              <div className="space-y-6">
                <AdvisorConnection
                  studentPhone={application.phone}
                  studentEmail={application.email}
                  studentName={application.name}
                />
                <AdvisorNotes
                  notes={application.admin_notes}
                  sessionNotes={application.session_notes}
                />
                <Card className="rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <CardHeader className="p-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <GraduationCap className="h-5 w-5 text-secondary" />
                      IELTS Portal
                    </CardTitle>
                    <CardDescription className="text-xs">Access your preparation materials</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Button asChild className="w-full text-sm rounded-xl bg-secondary hover:bg-secondary/90 text-white">
                      <Link to="/ielts-learning">Access Portal</Link>
                    </Button>
                  </CardContent>
                </Card>
                <SavedResources studentId={application.id} />
                <ProUpgradeCard />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="planner" className="space-y-6">
            <StudyPlannerSummary />
          </TabsContent>

          <TabsContent value="ielts" className="space-y-6">
            <IELTSProgressDashboard />
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TimelineView application={application} onUpdate={() => loadApplication(user?.email)} />
              <ProgressAnalytics application={application} />
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <DocumentCenter application={application} onUpdate={() => loadApplication(user?.email)} />
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

          <TabsContent value="profile" className="space-y-6">
            <ProfileSection application={application} />
          </TabsContent>
        </Tabs>

        <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
      </main>

      <Footer />
    </div>
  );
}
