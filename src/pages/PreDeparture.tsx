import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Chatbot } from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { Plane, FileCheck, CreditCard, Briefcase, MapPin, Users } from "lucide-react";

const PreDeparture = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6">
              Pre-Departure Services
            </h1>
            <p className="text-xl text-muted-foreground mb-8 font-light">
              Get ready for your journey with comprehensive pre-departure support
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
              Complete Pre-Departure Assistance
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
              Everything you need to know before you fly
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in">
              <Plane className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Travel Arrangements
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Guidance on booking flights, travel insurance, airport pickup services, and what to pack for your journey.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <FileCheck className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Documentation Checklist
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Complete list of essential documents to carry, from passport and visa to academic certificates and medical records.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <CreditCard className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Banking & Finance
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Help with opening international bank accounts, forex exchange, and understanding financial management abroad.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.3s" }}>
              <Briefcase className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Health & Insurance
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Information on health insurance requirements, vaccinations, medical check-ups, and wellness abroad.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.4s" }}>
              <MapPin className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Cultural Orientation
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Learn about local customs, cultural norms, weather conditions, and tips for adapting to your new environment.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.5s" }}>
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Orientation Sessions
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Interactive sessions with alumni and current students sharing their experiences and practical advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-Departure Checklist */}
      <section className="py-20 bg-muted/30">
        <div className="container px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Your Pre-Departure Checklist
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              { title: "Confirm Enrollment", desc: "Ensure university enrollment is confirmed and fees are paid" },
              { title: "Book Accommodation", desc: "Secure your housing before arrival" },
              { title: "Arrange Travel", desc: "Book flights and arrange airport pickup if needed" },
              { title: "Get Insurance", desc: "Purchase health and travel insurance" },
              { title: "Foreign Exchange", desc: "Exchange currency and set up international banking" },
              { title: "Pack Smart", desc: "Pack essentials based on climate and university requirements" },
              { title: "Inform Embassy", desc: "Register with your country's embassy in destination country" },
              { title: "Stay Connected", desc: "Get international SIM card or phone plan" }
            ].map((item, index) => (
              <div
                key={item.title}
                className="bg-card border border-border p-6 rounded-xl hover:border-primary/50 transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">{index + 1}</span>
                  </div>
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

export default PreDeparture;
