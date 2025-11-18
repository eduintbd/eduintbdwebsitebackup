import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Chatbot } from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { FileCheck, Search, UserCheck, Award, Clock, CheckCircle } from "lucide-react";

const Admission = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6">
              Admission Services
            </h1>
            <p className="text-xl text-muted-foreground mb-8 font-light">
              Your complete guide to securing admission in top universities worldwide
            </p>
            <Button 
              size="lg" 
              variant="golden"
              className="text-lg px-8 py-6"
              onClick={() => window.location.href = '/#contact'}
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-20 bg-background">
        <div className="container px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Comprehensive Admission Support
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
              End-to-end assistance for your university admission journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in">
              <Search className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Course & University Selection
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Expert guidance to choose the right course and university based on your profile, interests, and career goals.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <FileCheck className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Application Assistance
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Complete support with application forms, documentation, and submission to ensure error-free applications.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <UserCheck className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                SOP & LOR Writing
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Professional assistance in crafting compelling Statements of Purpose and securing strong Letters of Recommendation.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.3s" }}>
              <Award className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Profile Building
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Strategic advice on strengthening your academic and extracurricular profile to stand out from other applicants.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.4s" }}>
              <Clock className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Test Preparation
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Guidance on IELTS, TOEFL, GRE, GMAT, and other standardized tests required for your chosen universities.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.5s" }}>
              <CheckCircle className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Offer Letter Support
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Follow-up with universities and assistance in accepting offers, paying deposits, and confirming enrollment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 bg-muted/30">
        <div className="container px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Our Application Process
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              { step: "01", title: "Initial Consultation", desc: "Understand your goals, preferences, and academic background" },
              { step: "02", title: "Course Shortlisting", desc: "Identify suitable programs and universities matching your profile" },
              { step: "03", title: "Document Preparation", desc: "Gather and prepare all required documents and essays" },
              { step: "04", title: "Application Submission", desc: "Submit complete applications before deadlines" },
              { step: "05", title: "Follow-Up", desc: "Track application status and communicate with universities" },
              { step: "06", title: "Offer Acceptance", desc: "Guide you through offer acceptance and enrollment confirmation" }
            ].map((item, index) => (
              <div
                key={item.step}
                className="bg-card border border-border p-6 rounded-xl hover:border-primary/50 transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-6">
                  <div className="text-4xl font-bold text-primary/20">{item.step}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <FloatingActions />
      <Chatbot />
    </div>
  );
};

export default Admission;
