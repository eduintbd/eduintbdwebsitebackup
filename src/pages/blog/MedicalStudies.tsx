import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const MedicalStudies = () => {
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
            Medical Studies Abroad for Bangladeshi Students: Admission, Visa, and Scholarships
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground mb-8">
              Learn about medical school options abroad, including entry exams, required qualifications, and student visa processes.
            </p>

            <p>
              Universal Council's guidance ensures you meet all criteria and secure the right financial aid, including scholarships for Bangladeshi students pursuing medicine.
            </p>
          </div>
        </div>
      </article>

      <Footer />
      <FloatingActions />
    </main>
  );
};

export default MedicalStudies;
