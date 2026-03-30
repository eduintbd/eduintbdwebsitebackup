import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PublicUniversities = () => {
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
            Public University Admission Abroad: Key Considerations
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground mb-8">
              Applying to public universities overseas? This post highlights differences in admission criteria, tuition fees, and scholarship availability.
            </p>

            <p>
              Universal Council offers tailored support to help Bangladeshi students navigate the complexities of international university applications.
            </p>
          </div>
        </div>
      </article>

      <Footer />
      <FloatingActions />
    </main>
  );
};

export default PublicUniversities;
