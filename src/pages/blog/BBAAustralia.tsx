import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BBAAustralia = () => {
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
            BBA in Australia: How to Apply from Bangladesh
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground mb-8">
              Get a detailed roadmap for Bangladeshi students interested in BBA programs in Australia. Topics include admission requirements, student visa guidance, and tips for adapting to Australian campus life, all supported by Universal Council's consultancy team.
            </p>
          </div>
        </div>
      </article>

      <Footer />
      <FloatingActions />
    </main>
  );
};

export default BBAAustralia;
