import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Chatbot } from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { GraduationCap, MapPin, DollarSign, Clock, Briefcase, Globe, Heart, Sparkles } from "lucide-react";

const StudySouthKorea = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Study in South Korea
            </h1>
            <p className="text-xl md:text-2xl font-light mb-8">
              Experience innovation, rich culture, and world-class education in Asia's tech hub
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
              <h3 className="text-2xl font-bold text-foreground mb-2">400+</h3>
              <p className="text-muted-foreground">Universities</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-full mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Seoul</h3>
              <p className="text-muted-foreground">Capital City</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-full mb-4">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">$3k-10k</h3>
              <p className="text-muted-foreground">Annual Tuition</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-full mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">D-10 Visa</h3>
              <p className="text-muted-foreground">Job Seeking Visa</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Study in South Korea */}
      <section className="py-20 bg-muted/30">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12">
              Why Study in South Korea?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-background p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="w-6 h-6 text-secondary" />
                  <h3 className="text-xl font-semibold text-foreground">
                    Tech Innovation Hub
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  Home to Samsung, LG, Hyundai, and countless startups. Experience cutting-edge technology and innovation firsthand.
                </p>
              </div>
              <div className="bg-background p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign className="w-6 h-6 text-secondary" />
                  <h3 className="text-xl font-semibold text-foreground">
                    Affordable Education
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  Lower tuition fees compared to Western countries, with generous government scholarships like GKS (Global Korea Scholarship).
                </p>
              </div>
              <div className="bg-background p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Globe className="w-6 h-6 text-secondary" />
                  <h3 className="text-xl font-semibold text-foreground">
                    English-Taught Programs
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  Many universities offer programs entirely in English, making it accessible for international students.
                </p>
              </div>
              <div className="bg-background p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Heart className="w-6 h-6 text-secondary" />
                  <h3 className="text-xl font-semibold text-foreground">
                    Rich Cultural Experience
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  Immerse yourself in K-culture, delicious cuisine, historical sites, and the famous Korean hospitality.
                </p>
              </div>
              <div className="bg-background p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Briefcase className="w-6 h-6 text-secondary" />
                  <h3 className="text-xl font-semibold text-foreground">
                    Work Opportunities
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  Students can work part-time (20 hours/week) and apply for D-10 job-seeking visa after graduation.
                </p>
              </div>
              <div className="bg-background p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <GraduationCap className="w-6 h-6 text-secondary" />
                  <h3 className="text-xl font-semibold text-foreground">
                    World-Class Universities
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  SKY universities (Seoul National, Korea, Yonsei) and KAIST rank among Asia's top institutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scholarships */}
      <section className="py-20 bg-background">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12">
              Available Scholarships
            </h2>
            <div className="space-y-6">
              <div className="bg-muted/30 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-foreground mb-2">Global Korea Scholarship (GKS)</h3>
                <p className="text-muted-foreground mb-3">
                  Full government scholarship covering tuition, living expenses, airfare, and Korean language training.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-secondary/20 text-secondary text-sm rounded-full">Full Tuition</span>
                  <span className="px-3 py-1 bg-secondary/20 text-secondary text-sm rounded-full">Monthly Stipend</span>
                  <span className="px-3 py-1 bg-secondary/20 text-secondary text-sm rounded-full">Airfare</span>
                </div>
              </div>
              <div className="bg-muted/30 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-foreground mb-2">Korean Government Support Program</h3>
                <p className="text-muted-foreground mb-3">
                  Partial scholarships for self-funded students with excellent academic records.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-secondary/20 text-secondary text-sm rounded-full">50-100% Tuition</span>
                  <span className="px-3 py-1 bg-secondary/20 text-secondary text-sm rounded-full">Merit-Based</span>
                </div>
              </div>
              <div className="bg-muted/30 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-foreground mb-2">University-Specific Scholarships</h3>
                <p className="text-muted-foreground mb-3">
                  Many universities offer their own scholarships for international students based on academic excellence.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-secondary/20 text-secondary text-sm rounded-full">Varies by University</span>
                  <span className="px-3 py-1 bg-secondary/20 text-secondary text-sm rounded-full">Academic Excellence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Universities */}
      <section className="py-20 bg-muted/30">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12">
              Top Universities
            </h2>
            <div className="space-y-4">
              {[
                { name: "Seoul National University (SNU)", ranking: "#29 World (QS 2024)" },
                { name: "KAIST (Korea Advanced Institute of Science & Technology)", ranking: "#56 World" },
                { name: "Yonsei University", ranking: "#76 World" },
                { name: "Korea University", ranking: "#79 World" },
                { name: "Pohang University of Science and Technology (POSTECH)", ranking: "#100 World" },
                { name: "Sungkyunkwan University (SKKU)", ranking: "#145 World" },
                { name: "Hanyang University", ranking: "#164 World" },
                { name: "Kyung Hee University", ranking: "#332 World" },
              ].map((uni) => (
                <div key={uni.name} className="bg-background p-6 rounded-xl hover:shadow-md transition-shadow flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-foreground">{uni.name}</h3>
                  <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">{uni.ranking}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Living Costs */}
      <section className="py-20 bg-background">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12">
              Cost of Living
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-muted/30 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Expenses (Seoul)</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between text-muted-foreground">
                    <span>Accommodation (Dormitory)</span>
                    <span className="font-medium">$200-400</span>
                  </li>
                  <li className="flex justify-between text-muted-foreground">
                    <span>Food & Groceries</span>
                    <span className="font-medium">$300-500</span>
                  </li>
                  <li className="flex justify-between text-muted-foreground">
                    <span>Transportation</span>
                    <span className="font-medium">$50-100</span>
                  </li>
                  <li className="flex justify-between text-muted-foreground">
                    <span>Phone & Internet</span>
                    <span className="font-medium">$30-50</span>
                  </li>
                  <li className="flex justify-between text-foreground font-semibold border-t pt-3 mt-3">
                    <span>Total</span>
                    <span>$600-1,050/month</span>
                  </li>
                </ul>
              </div>
              <div className="bg-muted/30 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-foreground mb-4">Annual Tuition Fees</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between text-muted-foreground">
                    <span>Public Universities</span>
                    <span className="font-medium">$3,000-5,000</span>
                  </li>
                  <li className="flex justify-between text-muted-foreground">
                    <span>Private Universities</span>
                    <span className="font-medium">$5,000-10,000</span>
                  </li>
                  <li className="flex justify-between text-muted-foreground">
                    <span>Medical Programs</span>
                    <span className="font-medium">$8,000-15,000</span>
                  </li>
                  <li className="flex justify-between text-muted-foreground">
                    <span>Graduate Programs</span>
                    <span className="font-medium">$4,000-12,000</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Ready to Study in South Korea?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Let us guide you through the application process, visa requirements, and scholarship opportunities.
            </p>
            <Button 
              size="lg"
              variant="golden"
              className="px-8 py-6 text-lg"
              onClick={() => window.location.href = '/#contact'}
            >
              Book Free Consultation
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingActions />
      <Chatbot />
    </main>
  );
};

export default StudySouthKorea;