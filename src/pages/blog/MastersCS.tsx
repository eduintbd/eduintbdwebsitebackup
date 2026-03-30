import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const MastersCS = () => {
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
            Masters in Computer Science in USA: Admission, Scholarships, and Student Life
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground mb-8">
              Thinking of pursuing a Masters in Computer Science in the USA? Our guide covers university selection, application process, GRE/TOEFL requirements, and available scholarships for Bangladeshi students.
            </p>

            <p>
              Learn how Universal Council supports students with SOP writing, financial planning, and accommodation arrangements. Hear from alumni who share insights about campus life and career prospects post-graduation.
            </p>
          </div>
        </div>
      </article>

      <Footer />
      <FloatingActions />
    </main>
  );
};

export default MastersCS;
