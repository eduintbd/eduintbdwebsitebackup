import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Destinations } from "@/components/Destinations";
import { Testimonials } from "@/components/Testimonials";
import { Process } from "@/components/Process";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { UniversityPartners } from "@/components/UniversityPartners";
import { About } from "@/components/About";
import { CTA } from "@/components/CTA";
import { FloatingActions } from "@/components/FloatingActions";
import { CourseSearch } from "@/components/CourseSearch";
import { Chatbot } from "@/components/Chatbot";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          const isMobile = window.innerWidth < 768;
          const offset = isMobile ? 100 : 80;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - offset,
            behavior: "smooth"
          });
        }
      }, 100);
    }
  }, [location.hash]);
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <UniversityPartners />
      <About />
      <section id="services">
        <Services />
      </section>
      <section id="destinations">
        <Destinations />
      </section>
      <CourseSearch />
      <section id="testimonials">
        <Testimonials />
      </section>
      <Process />
      <section id="consultation">
        <ContactForm />
      </section>
      <CTA />
      <Footer />
      <FloatingActions />
      <Chatbot />
    </main>
  );
};

export default Index;
