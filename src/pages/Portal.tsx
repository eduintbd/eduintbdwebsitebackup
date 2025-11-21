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
  CheckCircle2, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  BookOpen,
  Plane,
  Bell,
  Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AdvisorConnection } from "@/components/portal/AdvisorConnection";
import { ConversationHistory } from "@/components/portal/ConversationHistory";
import { SavedResources } from "@/components/portal/SavedResources";
import { AdvisorNotes } from "@/components/portal/AdvisorNotes";

export default function Portal() {
  const [user, setUser] = useState<any>(null);
  const [application, setApplication] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
        toast({
          title: "No Application Found",
          description: "Please submit the contact form on the homepage to create your application.",
          variant: "destructive",
        });
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/20">
      <Navigation />
      
      <main className="flex-1 w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 max-w-[1400px]">
        {/* Welcome Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 bg-primary text-primary-foreground flex-shrink-0">
              <AvatarFallback className="text-xs sm:text-sm md:text-base">{getInitials(application.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 overflow-hidden">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold truncate">Welcome back, {application.name.split(' ')[0]}!</h1>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground truncate">Track your study abroad journey</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-3 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium truncate pr-2">Application Status</CardTitle>
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="text-base sm:text-xl md:text-2xl font-bold mb-1">{getStatusBadge(application.application_status || 'submitted')}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Current stage</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-3 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium truncate pr-2">Destination</CardTitle>
              <Plane className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="text-base sm:text-xl md:text-2xl font-bold mb-1 truncate">{application.study_destination || 'Not set'}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Study country</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-3 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium truncate pr-2">Next Session</CardTitle>
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="text-base sm:text-xl md:text-2xl font-bold mb-1 truncate">
                {application.session_date ? new Date(application.session_date).toLocaleDateString() : 'Not scheduled'}
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Consultation date</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-3 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium truncate pr-2">New Messages</CardTitle>
              <Bell className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="text-base sm:text-xl md:text-2xl font-bold mb-1">
                {messages.filter(m => !m.read_at && m.sender_type === 'admin').length}
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Unread updates</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {/* Left Column - Registration & Progress */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6 min-w-0">
            {/* Registration Data */}
            <Card className="overflow-hidden">
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="truncate">Registration Information</span>
                    </CardTitle>
                    <CardDescription className="text-[10px] sm:text-xs md:text-sm truncate">Your personal and application details</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 md:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <div className="space-y-1 min-w-0 overflow-hidden">
                    <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" /> <span>Full Name</span>
                    </p>
                    <p className="font-medium text-xs sm:text-sm md:text-base break-words">{application.name}</p>
                  </div>

                  <div className="space-y-1 min-w-0 overflow-hidden">
                    <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" /> <span>Email</span>
                    </p>
                    <p className="font-medium text-xs sm:text-sm md:text-base break-all">{application.email}</p>
                  </div>

                  <div className="space-y-1 min-w-0 overflow-hidden">
                    <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
                      <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" /> <span>Phone</span>
                    </p>
                    <p className="font-medium text-xs sm:text-sm md:text-base break-words">{application.phone}</p>
                  </div>

                  <div className="space-y-1 min-w-0 overflow-hidden">
                    <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" /> <span>Destination</span>
                    </p>
                    <p className="font-medium text-xs sm:text-sm md:text-base break-words">{application.study_destination || 'Not specified'}</p>
                  </div>

                  {application.preferred_course && (
                    <div className="space-y-1 min-w-0 overflow-hidden">
                      <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
                        <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" /> <span>Preferred Course</span>
                      </p>
                      <p className="font-medium text-xs sm:text-sm md:text-base break-words">{application.preferred_course}</p>
                    </div>
                  )}

                  {application.level && (
                    <div className="space-y-1 min-w-0 overflow-hidden">
                      <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
                        <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" /> <span>Level</span>
                      </p>
                      <p className="font-medium text-xs sm:text-sm md:text-base break-words">{application.level}</p>
                    </div>
                  )}
                </div>

                <Separator className="my-3 sm:my-4" />
                
                <div className="flex flex-col gap-2">
                  <h3 className="text-xs sm:text-sm md:text-base font-semibold">Application Progress</h3>
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {application.consultation_completed ? (
                        <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="text-[10px] sm:text-xs md:text-sm">Consultation Completed</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {application.documents_uploaded ? (
                        <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="text-[10px] sm:text-xs md:text-sm">Documents Uploaded</span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {application.offer_letter_received ? (
                        <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="text-[10px] sm:text-xs md:text-sm">Offer Letter Received</span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {application.visa_status === 'approved' ? (
                        <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="text-[10px] sm:text-xs md:text-sm break-words">Visa Status: {application.visa_status || 'not_started'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conversation History */}
            <ConversationHistory
              messages={messages}
              studentId={application.id}
              studentEmail={application.email}
              onMessageSent={handleMessageSent}
            />
          </div>

          {/* Right Column - Advisor & Resources */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6 min-w-0">
            {/* Advisor Connection */}
            <AdvisorConnection
              studentPhone={application.phone}
              studentEmail={application.email}
              studentName={application.name}
            />

            {/* Advisor Notes */}
            <AdvisorNotes
              notes={application.admin_notes}
              sessionNotes={application.session_notes}
            />

            {/* IELTS Portal Quick Access */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 overflow-hidden">
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="truncate">IELTS Portal</span>
                </CardTitle>
                <CardDescription className="text-[10px] sm:text-xs md:text-sm truncate">Access your IELTS preparation</CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
                <Button asChild className="w-full text-xs sm:text-sm md:text-base h-8 sm:h-9 md:h-10">
                  <Link to="/ielts-learning">
                    Access IELTS Portal
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Saved Resources */}
            <SavedResources studentId={application.id} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
