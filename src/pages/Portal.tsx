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
  MessageSquare, 
  Settings, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  BookOpen,
  Brain,
  Plane,
  Bell,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
      
      // Load messages
      const { data: messagesData } = await supabase
        .from('student_messages')
        .select('*')
        .eq('student_id', data.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      setMessages(messagesData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load your application data.",
        variant: "destructive",
      });
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

  const handleReschedule = () => {
    // Reschedule functionality handled in VideoConsultation component
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
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16 bg-primary text-primary-foreground">
              <AvatarFallback>{getInitials(application.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {application.name.split(' ')[0]}!</h1>
              <p className="text-muted-foreground">Track your study abroad journey</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Application Status</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{getStatusBadge(application.application_status || 'submitted')}</div>
              <p className="text-xs text-muted-foreground">Current stage</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Destination</CardTitle>
              <Plane className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{application.study_destination || 'Not set'}</div>
              <p className="text-xs text-muted-foreground">Study country</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Next Session</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">
                {application.session_date ? new Date(application.session_date).toLocaleDateString() : 'Not scheduled'}
              </div>
              <p className="text-xs text-muted-foreground">Consultation date</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">New Messages</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">
                {messages.filter(m => !m.read_at && m.sender_type === 'admin').length}
              </div>
              <p className="text-xs text-muted-foreground">Unread updates</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Registration Data */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Registration Information
                  </CardTitle>
                  <CardDescription>Your personal and application details</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" /> Full Name
                  </p>
                  <p className="font-medium">{application.name}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email
                  </p>
                  <p className="font-medium">{application.email}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Phone
                  </p>
                  <p className="font-medium">{application.phone}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Destination
                  </p>
                  <p className="font-medium">{application.study_destination || 'Not specified'}</p>
                </div>

                {application.preferred_course && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" /> Preferred Course
                    </p>
                    <p className="font-medium">{application.preferred_course}</p>
                  </div>
                )}

                {application.level && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <BookOpen className="h-4 w-4" /> Level
                    </p>
                    <p className="font-medium">{application.level}</p>
                  </div>
                )}

                {application.budget && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-medium">{application.budget}</p>
                  </div>
                )}

                {application.intake_semester && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Intake Semester</p>
                    <p className="font-medium">{application.intake_semester}</p>
                  </div>
                )}
              </div>

              {application.admin_notes && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Admin Notes</p>
                    <p className="text-sm text-muted-foreground">{application.admin_notes}</p>
                  </div>
                </>
              )}

              <Separator />
              
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold">Application Progress</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {application.consultation_completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      )}
                      <span className="text-sm">Consultation Completed</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {application.documents_uploaded ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      )}
                      <span className="text-sm">Documents Uploaded</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {application.offer_letter_received ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      )}
                      <span className="text-sm">Offer Letter Received</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {application.visa_status === 'approved' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      )}
                      <span className="text-sm">Visa Status: {application.visa_status || 'not_started'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Advisor Updates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Advisor Updates
                </CardTitle>
                <CardDescription>Latest messages from your counselor</CardDescription>
              </CardHeader>
              <CardContent>
                {messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No messages yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {messages.slice(0, 3).map((message) => (
                      <div key={message.id} className={`p-3 rounded-lg border ${!message.read_at && message.sender_type === 'admin' ? 'bg-primary/5 border-primary/20' : 'bg-muted/50'}`}>
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-medium">
                            {message.sender_type === 'admin' ? 'Advisor' : 'You'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(message.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {message.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Access Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Tools & Resources
                </CardTitle>
                <CardDescription>Quick access to essential tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/ielts-learning">
                    <BookOpen className="h-4 w-4 mr-2" />
                    IELTS Learning Platform
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/study-planner">
                    <Calendar className="h-4 w-4 mr-2" />
                    Study Abroad Planner
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/ai-advisor">
                    <Brain className="h-4 w-4 mr-2" />
                    AI Education Advisor
                  </Link>
                </Button>

                <Separator className="my-4" />

                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/accommodation">
                    <MapPin className="h-4 w-4 mr-2" />
                    Find Accommodation
                  </Link>
                </Button>

                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/visa">
                    <FileText className="h-4 w-4 mr-2" />
                    Visa Assistance
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
