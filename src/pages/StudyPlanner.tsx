import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { StudyPlannerDashboard } from "@/components/planner";

export default function StudyPlanner() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <Navigation />
      
      <main className="flex-1 pt-20 sm:pt-24">
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                Study Abroad Planner
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Your complete toolkit for planning your international education journey
              </p>
            </div>
            
            <StudyPlannerDashboard />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
