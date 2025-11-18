import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Globe, GraduationCap, DollarSign, FileCheck, TrendingUp, HeartHandshake, Compass, Calendar, Target } from "lucide-react";

export default function StudyPlanner() {
  const features = [
    {
      icon: Globe,
      title: "Explore 6+ Countries",
      description: "Compare study destinations with detailed visa, cost, and PR information"
    },
    {
      icon: Target,
      title: "Personalized Plans",
      description: "Get custom roadmaps based on your education, budget, and goals"
    },
    {
      icon: DollarSign,
      title: "Scholarship Finder",
      description: "Discover funding opportunities matching your profile"
    },
    {
      icon: FileCheck,
      title: "Visa Checklists",
      description: "Step-by-step visa application guidance for each country"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your application journey from start to finish"
    },
    {
      icon: HeartHandshake,
      title: "Expert Guidance",
      description: "Access resources and tools used by successful students"
    },
  ];

  const countries = [
    { name: "United States", flag: "🇺🇸", spots: "1M+ spots", popular: true },
    { name: "United Kingdom", flag: "🇬🇧", spots: "600K+ spots", popular: true },
    { name: "Canada", flag: "🇨🇦", spots: "800K+ spots", popular: true },
    { name: "Australia", flag: "🇦🇺", spots: "700K+ spots", popular: true },
    { name: "Germany", flag: "🇩🇪", spots: "400K+ spots", popular: false },
    { name: "New Zealand", flag: "🇳🇿", spots: "100K+ spots", popular: false },
  ];

  const steps = [
    { number: "1", title: "Choose Your Destination", desc: "Research countries based on your goals and budget" },
    { number: "2", title: "Build Your Profile", desc: "Create a comprehensive profile with your academic background" },
    { number: "3", title: "Find Programs", desc: "Discover universities and programs that match your criteria" },
    { number: "4", title: "Track Progress", desc: "Monitor applications, deadlines, and requirements in one place" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            <Badge variant="secondary" className="mb-4">
              <Compass className="w-3 h-3 mr-1" />
              Free Study Abroad Planning Tool
            </Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground">
              Your Journey to Study Abroad Starts Here
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Empowering Bangladeshi students with personalized plans, scholarships, and expert guidance to achieve their international education dreams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="text-lg px-8" asChild>
                <a href="#features">Explore Features</a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <a href="#countries">View Countries</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Countries Grid */}
        <section id="countries" className="container mx-auto px-4 py-16 bg-card/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Choose Your Study Destination
              </h2>
              <p className="text-muted-foreground text-lg">
                Compare top study destinations and find the perfect match for your goals
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-scale-in">
              {countries.map((country, idx) => (
                <Card key={idx} className="border-2 hover:border-primary transition-all hover:shadow-lg cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-5xl">{country.flag}</span>
                      {country.popular && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {country.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">{country.spots}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Everything You Need in One Place
              </h2>
              <p className="text-muted-foreground text-lg">
                From country research to visa applications, we've got you covered every step of the way
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
              {features.map((feature, idx) => (
                <Card key={idx} className="border-2 hover:border-primary/50 transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground text-lg">
                Simple steps to plan your study abroad journey
              </p>
            </div>
            <div className="space-y-6 animate-slide-up">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.desc}</p>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0 shadow-xl">
            <CardContent className="p-12 text-center space-y-6">
              <Calendar className="w-16 h-16 mx-auto opacity-90" />
              <h2 className="text-3xl md:text-4xl font-display font-bold">
                Ready to Begin Your Study Abroad Journey?
              </h2>
              <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
                Join thousands of Bangladeshi students who have successfully planned their path to international education
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
                  <a href="/#contact">Start Planning Now</a>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 border-2 border-primary-foreground/20 hover:bg-primary-foreground/10 text-primary-foreground" asChild>
                  <a href="/login">Track My Progress</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
