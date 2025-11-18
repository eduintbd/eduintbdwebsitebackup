import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Chatbot } from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { GraduationCap, MapPin, DollarSign, Clock } from "lucide-react";

const StudyCanada = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6">
              Study in Canada
            </h1>
            <p className="text-xl text-muted-foreground mb-8 font-light">
              Experience world-class education in one of the world's most welcoming countries
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

      {/* Quick Facts */}
      <section className="py-16 bg-muted/30">
        <div className="container px-6">
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center animate-fade-in">
              <GraduationCap className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold text-foreground mb-2">400+</h3>
              <p className="text-muted-foreground">Universities & Colleges</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold text-foreground mb-2">10</h3>
              <p className="text-muted-foreground">Provinces</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold text-foreground mb-2">$15K-35K</h3>
              <p className="text-muted-foreground">Annual Tuition (CAD)</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Clock className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold text-foreground mb-2">3 Years</h3>
              <p className="text-muted-foreground">Post-Study Work Permit</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Study in Canada */}
      <section className="py-20 bg-background">
        <div className="container px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Why Study in Canada?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
              Canada offers exceptional education, multicultural environment, and pathway to permanent residency
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in">
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Quality Education
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Canadian degrees are recognized globally, with universities consistently ranking among the world's best. Affordable tuition compared to USA and UK.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Work Opportunities
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Work up to 20 hours per week during studies and full-time during breaks. Post-graduation work permit up to 3 years.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Immigration Pathways
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Clear pathways to permanent residency through Express Entry and Provincial Nominee Programs. Canada welcomes international graduates.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.3s" }}>
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Safe & Multicultural
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                One of the safest countries with a welcoming multicultural society. Experience diverse cultures and make international connections.
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
              Top Universities in Canada
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {["University of Toronto", "McGill University", "University of British Columbia", "University of Alberta", "McMaster University", "University of Waterloo"].map((uni, index) => (
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

export default StudyCanada;
