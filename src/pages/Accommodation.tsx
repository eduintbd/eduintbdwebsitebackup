import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Chatbot } from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { Home, Building2, Users, MapPin, Shield, DollarSign } from "lucide-react";

const Accommodation = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6">
              Accommodation Services
            </h1>
            <p className="text-xl text-muted-foreground mb-8 font-light">
              Find safe, comfortable, and affordable housing near your university
            </p>
            <Button 
              size="lg" 
              variant="golden"
              className="text-lg px-8 py-6"
              onClick={() => window.location.href = '/#consultation'}
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
              Complete Accommodation Support
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
              We help you find the perfect home away from home
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in">
              <Home className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                On-Campus Housing
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Assistance with university dormitories, residence halls, and on-campus accommodation applications.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <Building2 className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Off-Campus Rentals
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Help finding apartments, shared housing, and private rentals near your university campus.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Homestay Options
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect with verified host families for an immersive cultural experience and comfortable living.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.3s" }}>
              <MapPin className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Location Guidance
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Advice on safe neighborhoods, proximity to campus, public transport, and local amenities.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.4s" }}>
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Verification Support
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Help with lease agreements, security deposits, and ensuring accommodation meets safety standards.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.5s" }}>
              <DollarSign className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Budget Planning
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Assistance with understanding costs, comparing options, and finding accommodation within your budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Accommodation Types */}
      <section className="py-20 bg-muted/30">
        <div className="container px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Types of Accommodation
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              { title: "University Dormitories", desc: "On-campus housing with meal plans, close to classes and campus facilities" },
              { title: "Shared Apartments", desc: "Cost-effective option sharing with other students, split rent and utilities" },
              { title: "Studio Apartments", desc: "Private living space with kitchen and bathroom, more independence" },
              { title: "Homestays", desc: "Live with local families, meals included, cultural immersion experience" },
              { title: "Purpose-Built Student Accommodations", desc: "Modern facilities designed for students with amenities and social spaces" },
              { title: "Private Rentals", desc: "Independent apartments or houses, maximum privacy and flexibility" }
            ].map((item, index) => (
              <div
                key={item.title}
                className="bg-card border border-border p-8 rounded-2xl hover:border-primary/50 transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
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

export default Accommodation;
