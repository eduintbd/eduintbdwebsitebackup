import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CheckCircle2, FileText, Calendar } from "lucide-react";
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
          {/* Header */}
          <div className="mb-4 md:mb-8 p-3 md:p-6 bg-card rounded-lg md:rounded-xl shadow-sm border mx-2 md:mx-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
              <div>
                <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Welcome back, {application?.name || user?.email}
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">{todayDate}</p>
              </div>
              <Button onClick={handleLogout} variant="outline" className="w-full md:w-fit">
                Log Out
              </Button>
            </div>
          </div>

          {application && (
            <>
              {/* Progress Tracker - Horizontal Stepper */}
              <div className="mb-4 md:mb-8 bg-card/80 backdrop-blur-sm rounded-full shadow-lg border p-2 md:p-4 mx-2 md:mx-0">
                <div className="flex items-center justify-between gap-1 md:gap-4 overflow-x-auto scrollbar-hide px-1">
                  {steps.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    
                    return (
                      <div key={step.id} className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                        <div className="flex flex-col items-center gap-1 min-w-[60px] md:min-w-[80px]">
                          <div className={`
                            w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-all
                            ${isCompleted ? 'bg-secondary text-primary shadow-lg scale-110' : 
                              isCurrent ? 'bg-primary text-primary-foreground shadow-lg scale-110 ring-4 ring-primary/20' : 
                              'bg-muted text-muted-foreground'}
                          `}>
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                            ) : (
                              <span>{index + 1}</span>
                            )}
                          </div>
                          <span className={`text-[10px] md:text-xs font-medium text-center leading-tight ${
                            isCurrent ? 'text-primary' : isCompleted ? 'text-secondary' : 'text-muted-foreground'
                          }`}>
                            {step.label}
                          </span>
                        </div>
                        
                        {index < steps.length - 1 && (
                          <div className={`h-[2px] w-8 md:w-12 flex-shrink-0 rounded-full transition-all ${
                            index < currentStepIndex ? 'bg-secondary' : 'bg-muted'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Application Details */}
              <Card className="shadow-lg mx-2 md:mx-0 rounded-lg md:rounded-xl">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 p-3 md:p-6">
                  <CardTitle className="text-lg md:text-2xl">Application Details</CardTitle>
                  <CardDescription className="text-xs md:text-sm">Manage your study abroad application</CardDescription>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs bg-secondary/20 text-secondary-foreground px-2 md:px-3 py-1 rounded-full">
                      Application: {application.application_status || 'initial_inquiry'}
                    </span>
                    <span className="text-xs bg-primary/10 text-primary px-2 md:px-3 py-1 rounded-full">
                      Visa: {application.visa_status || 'not_started'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 md:pt-6 px-2 md:px-6">
                  <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 md:gap-6">
                    {/* Virtual Consultation - Shows first on mobile */}
                    <div id="schedule" className="space-y-4 order-1 lg:order-2">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="font-bold text-lg md:text-xl lg:text-2xl">Virtual Consultation</h3>
                      </div>
                      {!application.session_booked && (
                        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30 rounded-xl p-4 shadow-sm">
                          <p className="text-sm md:text-base font-semibold text-primary mb-2">📅 Book your consultation to continue</p>
                          <p className="text-xs md:text-sm text-muted-foreground mb-3">Schedule a convenient time to discuss your study abroad plans with our expert counselors.</p>
                        </div>
                      )}
                      <VideoConsultation
                        sessionDate={application.session_date}
                        studyDestination={application.study_destination}
                        studyYear={application.study_year}
                        meetingLink={application.meeting_link}
                        onBook={handleBookSession}
                        onReschedule={handleReschedule}
                        isLoading={isBooking}
                      />
                    </div>

                    {/* Left Column: Registration - Shows second on mobile */}
                    <div className="space-y-6 order-2 lg:order-1">
                      {/* Step 1: Registration */}
                      <div className="space-y-4">
                        <EditableRegistration 
                          application={application}
                          onUpdate={() => loadApplication(user.email!)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Documents & Communication - Full Width Section */}
                  <div className="space-y-4 pt-6 border-t mt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg md:text-xl lg:text-2xl">Documents & Communication</h3>
                    </div>
                    <Tabs defaultValue="communication" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 h-auto max-w-md">
                        <TabsTrigger value="communication" className="text-xs md:text-sm py-2.5">💬 Communication Center</TabsTrigger>
                        <TabsTrigger value="documents" className="text-xs md:text-sm py-2.5">📄 Documents</TabsTrigger>
                      </TabsList>

                      <TabsContent value="communication" className="mt-4 w-full">
                        <CommunicationCenter
                          studentId={application.id}
                          studentEmail={application.email}
                          studentPhone={application.phone}
                          studentName={application.name}
                          isAdmin={false}
                        />
                      </TabsContent>

                      <TabsContent value="documents" className="space-y-4 mt-4">
                        <p className="text-sm text-muted-foreground">Upload and track all necessary documents</p>
                        <DocumentUpload
                          userId={user.id}
                          userEmail={user.email!}
                          documents={application.document_urls || []}
                          onDocumentsChange={() => loadApplication(user.email!)}
                        />
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Optional Fields Section */}
                  <div className="space-y-4 pt-6 border-t">
                    <h3 className="font-semibold text-base md:text-lg">Additional Information (Optional)</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="competitors" className="text-sm md:text-base">Preferred Universities/Program/Remarks</Label>
                        <Textarea
                          id="competitors"
                          placeholder="List preferred universities, programs, or any remarks (optional)..."
                          value={competitorUniversities}
                          onChange={(e) => setCompetitorUniversities(e.target.value)}
                          className="mt-2 text-sm md:text-base"
                          rows={4}
                        />
                      </div>
                      <Button onClick={handleUpdateFields} variant="outline" className="w-full md:w-auto text-sm md:text-base">
                        Save Additional Information
                      </Button>
                    </div>
                  </div>

                  {/* Custom Fields Section */}
                  <div className="space-y-4 pt-6 border-t">
                    <StudentCustomFields 
                      studentId={application.id}
                      isAdmin={false}
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
