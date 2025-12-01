import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Mail, LogIn, Eye, EyeOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email is too long"),
  phone: z.string()
    .trim()
    .regex(/^[0-9]{10,15}$/, "Phone must be 10-15 digits without spaces"),
  details: z.string()
    .max(300, "Details must be less than 300 words")
    .optional()
    .or(z.literal("")),
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signupData, setSignupData] = useState({
    name: "",
    phone: "",
    countryCode: "+880",
    destination: "",
    year: "",
    preferred_course: "",
    level: "",
    budget: "",
    reference_source: "",
    details: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/portal");
      }
    });
  }, [navigate]);


  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) throw error;

      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for the password reset link.",
      });
      setShowForgotPassword(false);
      setResetEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/portal`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Google Sign In Failed",
        description: error.message || "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Validate signup data
        const validatedData = signupSchema.parse({
          name: signupData.name,
          email: email,
          phone: signupData.phone,
          details: signupData.details,
        });

        const fullPhone = `${signupData.countryCode}${signupData.phone}`;

        // Create auth user
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/portal`,
          },
        });

        if (error) throw error;

        // Create student application record
        if (data?.user) {
          const { error: dbError } = await supabase
            .from('student_applications')
            .insert([{
              name: validatedData.name,
              email: validatedData.email,
              phone: fullPhone,
              study_destination: signupData.destination || null,
              study_year: signupData.year || null,
              preferred_course: signupData.preferred_course || null,
              level: signupData.level || null,
              budget: signupData.budget || null,
              reference_source: signupData.reference_source || null,
              details: validatedData.details || null,
            }]);

          if (dbError && dbError.code !== '23505') {
            console.error('Error creating application:', dbError);
          }

          toast({
            title: "Account Created Successfully",
            description: "Welcome! Your account has been created.",
          });
          navigate("/portal");
        } else {
          toast({
            title: "Account Created",
            description: "Check your email to verify your account.",
          });
          setEmailSent(true);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Fetch student data from student_applications table
        if (data?.user) {
          const { data: studentData, error: fetchError } = await supabase
            .from('student_applications')
            .select('*')
            .eq('email', email)
            .single();

          if (fetchError) {
            console.error('Error fetching student data:', fetchError);
          }
        }

        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
        navigate("/portal");
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Validation Error",
          description: firstError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: isSignUp ? "Sign Up Failed" : "Login Failed",
          description: error.message || "Authentication failed. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <Card className="w-full max-w-2xl shadow-xl border-2 my-8">
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="text-3xl font-bold text-center">
              {showForgotPassword ? "Reset Password" : "Welcome to EduintBD"}
            </CardTitle>
            <CardDescription className="text-center text-base">
              {showForgotPassword 
                ? "Enter your email to receive a password reset link"
                : emailSent 
                  ? "Check your email to verify your account"
                  : "Access free IELTS tools or sign up to track your progress"}
            </CardDescription>
            {!showForgotPassword && !emailSent && (
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant={!isSignUp ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setIsSignUp(false)}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
                <Button
                  type="button"
                  variant={isSignUp ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setIsSignUp(true)}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Sign Up
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {showForgotPassword ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail">Email</Label>
                  <Input
                    id="resetEmail"
                    type="email"
                    placeholder="your@email.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowForgotPassword(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : emailSent ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  We've sent a verification link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  Click the link in your email to verify your account.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEmailSent(false);
                    setEmail("");
                    setPassword("");
                  }}
                  className="w-full"
                >
                  Use Different Email
                </Button>
              </div>
            ) : (
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {isSignUp ? (
                  /* Signup Form with All Fields */
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          placeholder="Your full name"
                          value={signupData.name}
                          onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <div className="flex gap-2">
                        <Select value={signupData.countryCode} onValueChange={(value) => setSignupData({...signupData, countryCode: value})}>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-background z-50">
                            <SelectItem value="+880">+880</SelectItem>
                            <SelectItem value="+91">+91</SelectItem>
                            <SelectItem value="+1">+1</SelectItem>
                            <SelectItem value="+44">+44</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="1234567890"
                          value={signupData.phone}
                          onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                          className="flex-1"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="destination">Preferred Study Destination *</Label>
                      <Select value={signupData.destination} onValueChange={(value) => setSignupData({...signupData, destination: value})} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a destination" />
                        </SelectTrigger>
                        <SelectContent className="bg-background z-50">
                          <SelectItem value="australia">Australia</SelectItem>
                          <SelectItem value="canada">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="usa">USA</SelectItem>
                          <SelectItem value="new-zealand">New Zealand</SelectItem>
                          <SelectItem value="south-korea">South Korea</SelectItem>
                          <SelectItem value="help">Help Me Decide</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="year">Study Abroad Year *</Label>
                        <Select value={signupData.year} onValueChange={(value) => setSignupData({...signupData, year: value})} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent className="bg-background z-50">
                            <SelectItem value="2026">2026</SelectItem>
                            <SelectItem value="2027">2027</SelectItem>
                            <SelectItem value="2028">2028</SelectItem>
                            <SelectItem value="2029">2029</SelectItem>
                            <SelectItem value="2030">2030</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="level">Level</Label>
                        <Select value={signupData.level} onValueChange={(value) => setSignupData({...signupData, level: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent className="bg-background z-50">
                            <SelectItem value="undergraduate">Undergraduate</SelectItem>
                            <SelectItem value="postgraduate">Postgraduate</SelectItem>
                            <SelectItem value="phd">PhD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="preferred_course">Preferred Course</Label>
                        <Input
                          id="preferred_course"
                          placeholder="e.g., Computer Science"
                          value={signupData.preferred_course}
                          onChange={(e) => setSignupData({...signupData, preferred_course: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget</Label>
                        <Select value={signupData.budget} onValueChange={(value) => setSignupData({...signupData, budget: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                          <SelectContent className="bg-background z-50">
                            <SelectItem value="under-10000">Under $10,000</SelectItem>
                            <SelectItem value="10000-20000">$10,000 - $20,000</SelectItem>
                            <SelectItem value="20000-30000">$20,000 - $30,000</SelectItem>
                            <SelectItem value="30000-50000">$30,000 - $50,000</SelectItem>
                            <SelectItem value="above-50000">Above $50,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reference_source">How did you hear about us?</Label>
                      <Select value={signupData.reference_source} onValueChange={(value) => setSignupData({...signupData, reference_source: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent className="bg-background z-50">
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="friend">Friend</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="details">Brief Details About You (Max 300 words)</Label>
                      <Textarea
                        id="details"
                        placeholder="Include your city, preferred course, career path, study intake, latest education, IELTS score, and notable achievements..."
                        maxLength={2000}
                        value={signupData.details}
                        onChange={(e) => setSignupData({...signupData, details: e.target.value})}
                        className="min-h-[100px] resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </>
                ) : (
                  /* Login Form */
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <Button 
                      type="button" 
                      variant="link" 
                      className="px-0 h-auto text-sm text-primary"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Forgot your password?
                    </Button>
                    <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Button>
                    
                    <div className="relative my-6">
                      <Separator />
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                        OR
                      </span>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-11 text-base"
                      onClick={handleGoogleAuth}
                      disabled={isLoading}
                    >
                      <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </Button>
                    
                    <p className="text-center text-sm text-muted-foreground">
                      Need an account? Switch to sign up above
                    </p>
                  </>
                )}
              </form>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
