import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Chatbot } from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { GraduationCap, MapPin, DollarSign, Clock } from "lucide-react";

const StudyUK = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Study in UK
            </h1>
            <p className="text-xl md:text-2xl font-light mb-8">
              Experience world-renowned education in historic universities
            </p>
            <Button 
              size="lg"
              variant="golden"
              className="px-8 py-6 text-lg"
              onClick={() => window.location.href = '/#contact'}
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="py-16 bg-background">
        <div className="container px-6">
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-full mb-4">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">150+</h3>
              <p className="text-muted-foreground">Universities</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-full mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">4</h3>
              <p className="text-muted-foreground">Countries</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-full mb-4">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">£10k-38k</h3>
              <p className="text-muted-foreground">Annual Tuition</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-full mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">2 Years</h3>
              <p className="text-muted-foreground">Post-Study Work Visa</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Study in UK */}
      <section className="py-20 bg-muted/30">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12">
              Why Study in UK?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-background p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Historic Excellence
                </h3>
                <p className="text-muted-foreground">
                  Study at some of the world's oldest and most prestigious universities with centuries of academic tradition.
                </p>
              </div>
              <div className="bg-background p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Shorter Programs
                </h3>
                <p className="text-muted-foreground">
                  Complete undergraduate degrees in 3 years and master's programs in just 1 year, saving time and money.
                </p>
              </div>
              <div className="bg-background p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Graduate Route Visa
                </h3>
                <p className="text-muted-foreground">
                  Stay and work in the UK for 2 years after graduation (3 years for PhD graduates) without needing a job offer.
                </p>
              </div>
              <div className="bg-background p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Cultural Diversity
                </h3>
                <p className="text-muted-foreground">
                  Experience rich history, vibrant cities, and a truly international student community from around the globe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Universities */}
      <section className="py-20 bg-background">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12">
              Top Universities
            </h2>
            <div className="space-y-4">
              {[
                "University of Oxford",
                "University of Cambridge",
                "Imperial College London",
                "University College London (UCL)",
                "University of Edinburgh",
                "King's College London",
              ].map((uni) => (
                <div key={uni} className="bg-muted/30 p-6 rounded-xl hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-foreground">{uni}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingActions />
      <Chatbot />
    </main>
  );
};

export default StudyUK;
