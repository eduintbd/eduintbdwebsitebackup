import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const UKUndergraduate = () => {
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
            Undergraduate Programs in UK: Step-by-Step Application Guide
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground mb-8">
              Discover how Bangladeshi students can apply for undergraduate degrees in the UK. We detail UCAS procedures, required documents, English language tests, and key deadlines.
            </p>

            <p>
              Universal Council consultants in Dhaka provide expert advice on course selection and offer tailored support for your application, including personal statement review and interview preparation.
            </p>
          </div>
        </div>
      </article>

      <Footer />
      <FloatingActions />
    </main>
  );
};

export default UKUndergraduate;
