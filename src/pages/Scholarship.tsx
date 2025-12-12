import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Chatbot } from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { Award, Search, FileText, TrendingUp, DollarSign, BookOpen } from "lucide-react";

const Scholarship = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6">
              Scholarship Services
            </h1>
            <p className="text-xl text-muted-foreground mb-8 font-light">
              Unlock funding opportunities to make your education abroad affordable
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
              Comprehensive Scholarship Assistance
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
              Expert guidance to secure funding for your international education
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in">
              <Search className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Scholarship Search
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Access to comprehensive database of scholarships, grants, and financial aid opportunities worldwide.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <Award className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Eligibility Assessment
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Evaluate your profile against scholarship criteria to identify the best funding opportunities for you.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <FileText className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Application Support
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Complete assistance in preparing scholarship applications, essays, and required documentation.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.3s" }}>
              <TrendingUp className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Profile Enhancement
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Strategic advice to strengthen your academic and extracurricular profile for scholarship applications.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.4s" }}>
              <DollarSign className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Multiple Funding Sources
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Guidance on university scholarships, government funding, private grants, and education loans.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: "0.5s" }}>
              <BookOpen className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
                Ongoing Support
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Continuous assistance from application to scholarship disbursement and renewal processes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scholarship Types */}
      <section className="py-20 bg-muted/30">
        <div className="container px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Types of Scholarships We Help With
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              { title: "Merit-Based Scholarships", desc: "Awards based on academic excellence, test scores, and achievements" },
              { title: "Need-Based Scholarships", desc: "Financial aid for students with demonstrated financial need" },
              { title: "University Scholarships", desc: "Institutional funding offered directly by universities and colleges" },
              { title: "Government Scholarships", desc: "Funding programs sponsored by governments and public agencies" },
              { title: "Private Scholarships", desc: "Grants from private organizations, foundations, and corporations" },
              { title: "Subject-Specific Awards", desc: "Scholarships for specific fields of study or research areas" }
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

export default Scholarship;
