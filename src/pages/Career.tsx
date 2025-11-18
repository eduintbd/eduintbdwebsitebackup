import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Chatbot } from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { Briefcase, Target, Users, TrendingUp, Globe, Award } from "lucide-react";

const Career = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6">
              Career Services
            </h1>
            <p className="text-xl text-muted-foreground mb-8 font-light">
              Build your global career with expert guidance and support
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
              Comprehensive Career Support
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
              From course selection to landing your dream job
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in">
              <Target className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Career Counseling
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                One-on-one sessions to identify your strengths, interests, and align them with the right career path.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <Briefcase className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Industry Insights
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Latest information on job markets, trending careers, and industry demands in your chosen destination.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Resume Building
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Professional assistance in creating international-standard resumes and LinkedIn profiles that get noticed.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.3s" }}>
              <TrendingUp className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Interview Preparation
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Mock interviews, behavioral question practice, and tips to ace interviews with global employers.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.4s" }}>
              <Globe className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Internship Support
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Guidance on finding internships and co-op opportunities during your studies to build practical experience.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.5s" }}>
              <Award className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Networking Opportunities
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect with alumni, industry professionals, and attend career fairs to expand your professional network.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Career Paths */}
      <section className="py-20 bg-muted/30">
        <div className="container px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Popular Career Paths for International Students
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              "Technology & IT",
              "Engineering",
              "Healthcare & Medicine",
              "Business & Management",
              "Finance & Accounting",
              "Data Science & AI",
              "Marketing & Communications",
              "Hospitality & Tourism",
              "Education & Research"
            ].map((career, index) => (
              <div
                key={career}
                className="bg-card border border-border p-6 rounded-xl hover:border-primary/50 transition-colors cursor-pointer animate-fade-in text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-lg font-semibold text-foreground">{career}</h3>
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

export default Career;
