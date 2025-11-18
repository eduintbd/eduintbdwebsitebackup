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
import { Mail, LogIn } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/ielts-learning");
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

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/ielts-learning`,
          },
        });

        if (error) throw error;

        toast({
          title: "Account Created",
          description: "Check your email to verify your account.",
        });
        setEmailSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
        navigate("/ielts-learning");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: isSignUp ? "Sign Up Failed" : "Login Failed",
        description: error.message || "Authentication failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 flex items-center justify-center px-4 py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <Card className="w-full max-w-md shadow-xl border-2">
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
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  {!isSignUp && (
                    <Button 
                      type="button" 
                      variant="link" 
                      className="px-0 h-auto text-sm text-primary"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Forgot your password?
                    </Button>
                  )}
                  <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                    {isLoading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
                  </Button>
                  
                  <p className="text-center text-sm text-muted-foreground">
                    {isSignUp ? "Already have an account? Switch to login above" : "Need an account? Switch to sign up above"}
                  </p>
                 </form>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
