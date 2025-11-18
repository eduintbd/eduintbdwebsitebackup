import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Chatbot } from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { GraduationCap, MapPin, DollarSign, Clock } from "lucide-react";

const StudyAustralia = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6">
              Study in Australia
            </h1>
            <p className="text-xl text-muted-foreground mb-8 font-light">
              Discover world-renowned universities and an exceptional lifestyle down under
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
              <h3 className="text-3xl font-bold text-foreground mb-2">43</h3>
              <p className="text-muted-foreground">Universities</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold text-foreground mb-2">8</h3>
              <p className="text-muted-foreground">States & Territories</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold text-foreground mb-2">$20K-45K</h3>
              <p className="text-muted-foreground">Annual Tuition (AUD)</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Clock className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold text-foreground mb-2">2-4 Years</h3>
              <p className="text-muted-foreground">Post-Study Work Visa</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Study in Australia */}
      <section className="py-20 bg-background">
        <div className="container px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Why Study in Australia?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
              Combine quality education with an unbeatable lifestyle and career opportunities
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in">
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Top-Ranked Universities
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                7 Australian universities rank in the global top 100. Experience innovative teaching methods and cutting-edge research facilities.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Work While Studying
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Work up to 48 hours per fortnight during semester and unlimited hours during breaks. Gain valuable Australian work experience.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Post-Study Work Visa
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Temporary Graduate Visa (subclass 485) allows you to work for 2-4 years after graduation, depending on your qualification.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.3s" }}>
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Exceptional Lifestyle
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Enjoy beautiful beaches, vibrant cities, and a high quality of life. Perfect climate and outdoor lifestyle year-round.
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
              Top Universities in Australia
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {["Australian National University", "University of Melbourne", "University of Sydney", "University of Queensland", "Monash University", "UNSW Sydney"].map((uni, index) => (
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

export default StudyAustralia;
