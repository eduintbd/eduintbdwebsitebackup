import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Chatbot } from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { GraduationCap, MapPin, DollarSign, Clock } from "lucide-react";

const StudyNewZealand = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6">
              Study in New Zealand
            </h1>
            <p className="text-xl text-muted-foreground mb-8 font-light">
              World-class education in breathtaking natural surroundings
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

      {/* Quick Facts */}
      <section className="py-16 bg-muted/30">
        <div className="container px-6">
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center animate-fade-in">
              <GraduationCap className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold text-foreground mb-2">8</h3>
              <p className="text-muted-foreground">Universities</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold text-foreground mb-2">2</h3>
              <p className="text-muted-foreground">Main Islands</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold text-foreground mb-2">$22K-32K</h3>
              <p className="text-muted-foreground">Annual Tuition (NZD)</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Clock className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold text-foreground mb-2">3 Years</h3>
              <p className="text-muted-foreground">Post-Study Work Visa</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Study in New Zealand */}
      <section className="py-20 bg-background">
        <div className="container px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Why Study in New Zealand?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
              Innovative education system, stunning landscapes, and welcoming communities
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in">
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Quality Education
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                All 8 universities rank in the top 3% globally. Focus on practical, research-led teaching with small class sizes.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Work Opportunities
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Work up to 20 hours per week during studies. Post-study work visa available for up to 3 years after graduation.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Safe & Peaceful
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Ranked as one of the world's safest countries. Welcoming, multicultural society with strong student support systems.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.3s" }}>
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Natural Beauty
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Experience spectacular landscapes, from mountains to beaches. Perfect for outdoor enthusiasts and adventure seekers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Universities */}
      <section className="py-20 bg-muted/30">
        <div className="container px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Top Universities in New Zealand
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {["University of Auckland", "University of Otago", "Victoria University of Wellington", "University of Canterbury", "Massey University", "Auckland University of Technology"].map((uni, index) => (
              <div
                key={uni}
                className="bg-card border border-border p-6 rounded-xl hover:border-primary/50 transition-colors cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-lg font-semibold text-foreground">{uni}</h3>
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

export default StudyNewZealand;
