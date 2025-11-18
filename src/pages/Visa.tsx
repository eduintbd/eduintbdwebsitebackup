import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Chatbot } from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { FileText, Shield, Users, CheckCircle, Globe, Clock } from "lucide-react";

const Visa = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6">
              Visa Services
            </h1>
            <p className="text-xl text-muted-foreground mb-8 font-light">
              Expert visa guidance to make your study abroad journey smooth and stress-free
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
              Complete Visa Support
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
              We handle every aspect of your student visa application
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in">
              <FileText className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Document Checklist
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Complete list of required documents for your visa application with country-specific requirements and guidelines.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Application Assistance
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Step-by-step guidance in filling visa forms, scheduling appointments, and submitting applications correctly.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Interview Preparation
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Mock interviews and expert tips to help you confidently face your visa interview and answer questions effectively.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.3s" }}>
              <CheckCircle className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Financial Documentation
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Assistance with preparing financial statements, sponsor documents, and proof of funds as per embassy requirements.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.4s" }}>
              <Globe className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Multiple Countries
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Expertise in student visa processes for USA, UK, Canada, Australia, Germany, New Zealand, and other countries.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.5s" }}>
              <Clock className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Timely Updates
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Regular updates on your visa application status and immediate assistance with any additional requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visa Process */}
      <section className="py-20 bg-muted/30">
        <div className="container px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Our Visa Process
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              { step: "01", title: "Initial Assessment", desc: "Review your admission documents and eligibility for visa" },
              { step: "02", title: "Document Collection", desc: "Gather all required documents as per visa checklist" },
              { step: "03", title: "Application Preparation", desc: "Fill visa forms and prepare supporting documents" },
              { step: "04", title: "Interview Coaching", desc: "Practice sessions and guidance for visa interview" },
              { step: "05", title: "Submission", desc: "Submit application and schedule visa appointment" },
              { step: "06", title: "Follow-Up", desc: "Track application and assist with any queries" }
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

export default Visa;
