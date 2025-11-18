import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CheckCircle2, FileText, Calendar, User, Phone, Mail, MessageCircle, Facebook, Globe, ArrowRight, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DocumentUpload } from "@/components/portal/DocumentUpload";
import { EditableRegistration } from "@/components/portal/EditableRegistration";
import { VideoConsultation } from "@/components/portal/VideoConsultation";
import { CommunicationCenter } from "@/components/portal/CommunicationCenter";
import { StudentCustomFields } from "@/components/admin/StudentCustomFields";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const steps = [
  { id: 'registration', label: 'Registration', description: 'Student details and basic registration information' },
  { id: 'consultation', label: 'Virtual Consultation', description: 'Connect with our expert counselors online for personalized guidance' },
  { id: 'documents', label: 'Documents', description: 'Upload and track all necessary documents' },
  { id: 'admission', label: 'Offer Letter & Admission', description: 'Receive offer letters from top universities' },
  { id: 'visa', label: 'Visa & Relocation Services', description: 'Complete visa assistance and relocation support' },
];

export default function Portal() {
  const [user, setUser] = useState<any>(null);
  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [competitorUniversities, setCompetitorUniversities] = useState("");
  const [isBooking, setIsBooking] = useState(false);
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
        // No application found - user needs to submit contact form first
        setApplication(null);
        toast({
          title: "No Application Found",
          description: "Please submit the contact form on the homepage to create your application.",
          variant: "destructive",
        });
        return;
      }
      
      setApplication(data);
      setCompetitorUniversities(data.competitor_universities || "");
    } catch (error: any) {
      console.error("Error loading application:", error);
      toast({
        title: "Error",
        description: "Failed to load your application data.",
        variant: "destructive",
      });
    }
  };

  const handleReschedule = () => {
    // Reschedule functionality handled in VideoConsultation component
  };

  const handleUpdateFields = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('student_applications')
        .update({
          competitor_universities: competitorUniversities,
        })
        .eq('email', user.email);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Fields updated successfully!",
      });
      await loadApplication(user.email!);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleBookSession = async (sessionDate: string, sessionTime: string) => {
    if (!user) return;

    setIsBooking(true);
    try {
      const { error: updateError } = await supabase
        .from('student_applications')
        .update({
          session_date: sessionDate,
          session_booked: true,
        })
        .eq('email', user.email);

      if (updateError) throw updateError;

      // Send booking confirmation email
      const { error: emailError } = await supabase.functions.invoke('send-booking-confirmation', {
        body: {
          email: user.email,
          name: application.name,
          phone: application.phone,
          sessionDate,
          sessionTime,
          destination: application.study_destination,
        },
      });

      if (emailError) {
        console.error("Email error:", emailError);
      }

      // Send admin notification about consultation booking
      console.log('Sending admin notification for consultation');
      const { error: adminNotificationError } = await supabase.functions.invoke('send-admin-notification', {
        body: {
          type: 'consultation',
          studentName: application.name,
          studentEmail: application.email,
          studentPhone: application.phone,
          studyDestination: application.study_destination,
          studyYear: application.study_year,
          consultationDate: new Date(sessionDate).toLocaleString(),
          meetingLink: 'To be provided 24 hours before session',
        },
      });

      if (adminNotificationError) {
        console.error('Admin notification error:', adminNotificationError);
      }

      toast({
        title: "Success",
        description: "Session booked successfully! Check your email for confirmation.",
      });
      await loadApplication(user.email!);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

const getCurrentStepIndex = () => {
  if (!application) return 0;
  // Step 1 (Registration) is complete if application exists
  if (!application.session_booked) return 1; // Step 2: Consultation
  if (!application.documents_uploaded) return 2; // Step 3: Documents
  if (!application.offer_letter_received) return 3; // Step 4: Admission
  // Step 5: Visa (remain current until approved)
  return 4;
};

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 py-20 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto max-w-4xl">
            <Card className="p-8 text-center">
              <CardHeader>
                <CardTitle>No Application Found</CardTitle>
                <CardDescription>
                  Welcome, {user?.email}! We couldn't find an application associated with your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Please submit the contact form on our homepage to create your student application.
                </p>
                <Button onClick={() => navigate("/")}>
                  Go to Homepage
                </Button>
                <div className="pt-4">
                  <Button onClick={handleLogout} variant="outline">
                    Log Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentStepIndex = getCurrentStepIndex();

  const todayDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Navigation />
      <main className="flex-1 py-6 md:py-12 px-2 md:px-4">
        <div className="container mx-auto max-w-7xl px-0 md:px-4">
          {/* Header with Profile & Quick Actions */}
          <div className="mb-4 md:mb-8 p-4 md:p-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl shadow-lg border mx-2 md:mx-0">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4 flex-1">
                <div className="hidden sm:flex h-16 w-16 rounded-full bg-primary/20 items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-1">
                    Welcome back, {application?.name || 'Student'}!
                  </h1>
                  <p className="text-sm text-muted-foreground mb-3">{todayDate}</p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="px-3 py-1 bg-background/50 rounded-full flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {user?.email}
                    </span>
                    {application?.phone && (
                      <span className="px-3 py-1 bg-background/50 rounded-full flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {application.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Quick Connect Social Links */}
              <div className="flex flex-col gap-3 w-full lg:w-auto">
                <p className="text-sm font-semibold text-muted-foreground">Quick Connect:</p>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-green-500/10 border-green-500/20 hover:bg-green-500/20"
                    onClick={() => window.open(`https://wa.me/8801885999642?text=Hi, I need assistance with my application`, '_blank')}
                  >
                    <MessageCircle className="h-4 w-4 mr-1 text-green-600" />
                    WhatsApp
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20"
                    onClick={() => window.open('https://www.facebook.com/eduintbd', '_blank')}
                  >
                    <Facebook className="h-4 w-4 mr-1 text-blue-600" />
                    Facebook
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="bg-primary/10 border-primary/20 hover:bg-primary/20"
                    onClick={() => window.location.href = 'mailto:info@eduintbd.com'}
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleLogout}
                  >
                    Log Out
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {application && (
            <>
              {/* Registration Status Highlight */}
              <div className="mb-6 mx-2 md:mx-0">
                <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-r from-primary/5 to-secondary/5">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">Registration Status</CardTitle>
                          <CardDescription>Your application is active and being processed</CardDescription>
                        </div>
                      </div>
                      <span className="px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-semibold">
                        Active
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-3 bg-background/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Study Destination</p>
                        <p className="font-semibold">{application.study_destination || 'Not specified'}</p>
                      </div>
                      <div className="p-3 bg-background/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Study Year</p>
                        <p className="font-semibold">{application.study_year || 'Not specified'}</p>
                      </div>
                      <div className="p-3 bg-background/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Application Status</p>
                        <p className="font-semibold capitalize">{application.application_status?.replace('_', ' ') || 'Initial Inquiry'}</p>
                      </div>
                      <div className="p-3 bg-background/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Visa Status</p>
                        <p className="font-semibold capitalize">{application.visa_status?.replace('_', ' ') || 'Not Started'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Navigation Tabs */}
              <div className="mx-2 md:mx-0">
                <Tabs defaultValue="overview" className="space-y-6">
                  <TabsList className="w-full grid grid-cols-2 lg:grid-cols-4 h-auto bg-card/50 backdrop-blur-sm p-1">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
                      <Globe className="h-4 w-4 mr-2" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="registration" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
                      <User className="h-4 w-4 mr-2" />
                      Registration
                    </TabsTrigger>
                    <TabsTrigger value="consultation" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
                      <Calendar className="h-4 w-4 mr-2" />
                      Consultation
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
                      <FileText className="h-4 w-4 mr-2" />
                      Documents
                    </TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {/* Quick Action Card - Schedule */}
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2" onClick={() => document.querySelector('[value="consultation"]')?.dispatchEvent(new MouseEvent('click', {bubbles: true}))}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <Calendar className="h-8 w-8 text-primary" />
                            {!application.session_booked && <AlertCircle className="h-5 w-5 text-orange-500" />}
                          </div>
                          <CardTitle className="text-lg">Virtual Consultation</CardTitle>
                          <CardDescription>
                            {application.session_booked ? 
                              `Scheduled: ${new Date(application.session_date).toLocaleDateString()}` : 
                              'Book your consultation now'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button className="w-full" variant={application.session_booked ? "outline" : "default"}>
                            {application.session_booked ? 'View Details' : 'Schedule Now'}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Quick Action Card - Documents */}
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2" onClick={() => document.querySelector('[value="documents"]')?.dispatchEvent(new MouseEvent('click', {bubbles: true}))}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <FileText className="h-8 w-8 text-primary" />
                            {!application.documents_uploaded && <AlertCircle className="h-5 w-5 text-orange-500" />}
                          </div>
                          <CardTitle className="text-lg">Documents</CardTitle>
                          <CardDescription>
                            {application.documents_uploaded ? 
                              'Documents uploaded' : 
                              'Upload your documents'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button className="w-full" variant={application.documents_uploaded ? "outline" : "default"}>
                            {application.documents_uploaded ? 'View Documents' : 'Upload Now'}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Quick Action Card - Communication */}
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2" onClick={() => document.querySelector('[value="documents"]')?.dispatchEvent(new MouseEvent('click', {bubbles: true}))}>
                        <CardHeader>
                          <MessageCircle className="h-8 w-8 text-primary" />
                          <CardTitle className="text-lg">Communication</CardTitle>
                          <CardDescription>Message your counselor</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button className="w-full" variant="outline">
                            Open Messages
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Progress Steps */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Your Journey Progress</CardTitle>
                        <CardDescription>Track your application status</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {steps.map((step, index) => {
                            const isCompleted = index < currentStepIndex;
                            const isCurrent = index === currentStepIndex;
                            return (
                              <div key={step.id} className={`p-4 rounded-lg border-2 ${
                                isCurrent ? 'bg-primary/10 border-primary' : 
                                isCompleted ? 'bg-secondary/10 border-secondary' : 
                                'bg-muted/30 border-muted'
                              }`}>
                                <div className="flex items-center gap-3">
                                  <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${
                                    isCompleted ? 'bg-secondary text-primary' : 
                                    isCurrent ? 'bg-primary text-primary-foreground' : 
                                    'bg-muted text-muted-foreground'
                                  }`}>
                                    {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold">{step.label}</h4>
                                    <p className="text-sm text-muted-foreground">{step.description}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Registration Tab */}
                  <TabsContent value="registration" className="space-y-6">
                    <EditableRegistration 
                      application={application}
                      onUpdate={() => loadApplication(user.email!)}
                    />
                    <StudentCustomFields studentId={application.id} />
                  </TabsContent>

                  {/* Consultation Tab */}
                  <TabsContent value="consultation" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          Virtual Consultation
                        </CardTitle>
                        <CardDescription>Schedule or manage your consultation session</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <VideoConsultation
                          sessionDate={application.session_date}
                          studyDestination={application.study_destination}
                          studyYear={application.study_year}
                          meetingLink={application.meeting_link}
                          onBook={handleBookSession}
                          onReschedule={handleReschedule}
                          isLoading={isBooking}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Documents Tab */}
                  <TabsContent value="documents" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Documents & Communication
                        </CardTitle>
                        <CardDescription>Upload documents and communicate with your counselor</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Tabs defaultValue="communication" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="communication">Messages</TabsTrigger>
                            <TabsTrigger value="upload">Upload Documents</TabsTrigger>
                          </TabsList>
                          <TabsContent value="communication" className="space-y-4 mt-4">
                            <CommunicationCenter 
                              studentId={application.id} 
                              studentEmail={application.email}
                              studentPhone={application.phone}
                              studentName={application.name}
                            />
                          </TabsContent>
                          <TabsContent value="upload" className="space-y-4 mt-4">
                            <DocumentUpload
                              userId={user.id}
                              userEmail={user.email!}
                              documents={application.document_urls || []}
                              onDocumentsChange={() => loadApplication(user.email!)}
                            />
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
