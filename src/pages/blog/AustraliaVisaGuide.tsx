import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AustraliaVisaGuide = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <article className="pt-32 pb-24">
        <div className="container px-6 max-w-4xl mx-auto">
          <Link to="/blog">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
            A Complete Guide to the Student Visa Process for Australia from Bangladesh
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground mb-8">
              Are you planning to study in Australia from Bangladesh? Securing a student visa is a crucial step in your academic journey. In this guide, we cover everything you need to know: eligibility requirements, documentation, financial proof, and interview preparation.
            </p>

            <p>
              Learn how Universal Council's expert consultants in Dhaka can streamline your application process, assist with SOP writing, and provide personalized interview coaching to maximize your chances of visa approval. Discover tips for successful applications and common mistakes to avoid.
            </p>

            <p>
              For more details, visit our comprehensive <Link to="/visa" className="text-primary hover:underline">visa assistance page</Link>.
            </p>
          </div>
        </div>
      </article>

      <Footer />
      <FloatingActions />
    </main>
  );
};

export default AustraliaVisaGuide;
