import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Chatbot } from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { GraduationCap, MapPin, DollarSign, Clock } from "lucide-react";

const StudyUSA = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Study in USA
            </h1>
            <p className="text-xl md:text-2xl font-light mb-8">
              Home to world-class universities and endless opportunities
            </p>
            <Button 
              size="lg"
              variant="golden"
              className="px-8 py-6 text-lg"
              onClick={() => window.location.href = '/#consultation'}
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
              <h3 className="text-2xl font-bold text-foreground mb-2">4,000+</h3>
              <p className="text-muted-foreground">Universities</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-full mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">50</h3>
              <p className="text-muted-foreground">States</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-full mb-4">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">$10k-60k</h3>
              <p className="text-muted-foreground">Annual Tuition</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-full mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">3 Years</h3>
              <p className="text-muted-foreground">Post-Study Work Visa</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Study in USA */}
      <section className="py-20 bg-muted/30">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12">
              Why Study in USA?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-background p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  World-Class Education
                </h3>
                <p className="text-muted-foreground">
                  Access to globally recognized universities with cutting-edge research facilities and innovative teaching methods.
                </p>
              </div>
              <div className="bg-background p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Diverse Programs
                </h3>
                <p className="text-muted-foreground">
                  Thousands of courses across all disciplines with flexible curriculum and specialization options.
                </p>
              </div>
              <div className="bg-background p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Career Opportunities
                </h3>
                <p className="text-muted-foreground">
                  Optional Practical Training (OPT) allows up to 3 years of work experience in your field of study.
                </p>
              </div>
              <div className="bg-background p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Cultural Experience
                </h3>
                <p className="text-muted-foreground">
                  Immerse yourself in a multicultural environment and build a global network of connections.
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
                "Harvard University",
                "Stanford University",
                "Massachusetts Institute of Technology (MIT)",
                "University of California, Berkeley",
                "Columbia University",
                "Yale University",
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

export default StudyUSA;
