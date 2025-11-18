import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Chatbot } from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { GraduationCap, MapPin, DollarSign, Clock } from "lucide-react";

const StudyGermany = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6">
              Study in Germany
            </h1>
            <p className="text-xl text-muted-foreground mb-8 font-light">
              Experience world-class education with low or no tuition fees in Europe's powerhouse
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
              <p className="text-muted-foreground">Universities</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold text-foreground mb-2">16</h3>
              <p className="text-muted-foreground">States</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold text-foreground mb-2">Free-€3K</h3>
              <p className="text-muted-foreground">Annual Tuition (EUR)</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Clock className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold text-foreground mb-2">18 Months</h3>
              <p className="text-muted-foreground">Job Search Visa</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Study in Germany */}
      <section className="py-20 bg-background">
        <div className="container px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Why Study in Germany?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
              Affordable education, strong economy, and excellent career prospects
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in">
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Tuition-Free Education
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Public universities charge little to no tuition fees, even for international students. Only pay semester contribution of around €300.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Engineering Excellence
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                World-renowned for engineering and technology programs. Learn from leaders in automotive, manufacturing, and innovation.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Strong Job Market
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Europe's largest economy with excellent career opportunities. 18-month job search visa after graduation to find work.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.3s" }}>
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Gateway to Europe
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Strategic location in the heart of Europe. Travel easily to neighboring countries and experience diverse cultures.
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
              Top Universities in Germany
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {["Technical University of Munich", "Ludwig Maximilian University", "Heidelberg University", "Humboldt University of Berlin", "RWTH Aachen University", "University of Freiburg"].map((uni, index) => (
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

export default StudyGermany;
