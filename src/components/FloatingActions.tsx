import { Phone, MessageCircle, ArrowUp, FileText, Facebook, Linkedin, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useMetaPixel } from "@/hooks/use-meta-pixel";

export const FloatingActions = () => {
  const { trackContact } = useMetaPixel();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleWhatsApp = () => {
    trackContact({ contact_method: 'whatsapp' });
    window.open("https://api.whatsapp.com/send?phone=8801898934855", "_blank");
  };

  const handleCall = () => {
    trackContact({ contact_method: 'phone' });
    window.location.href = "tel:+8801898934855";
  };

  const handleEnquire = () => {
    // Check if we're already on homepage
    if (window.location.pathname === '/') {
      const contactSection = document.querySelector("#contact");
      if (contactSection) {
        const isMobile = window.innerWidth < 768;
        const offset = isMobile ? 100 : 0; // Account for mobile bottom bar
        const elementPosition = contactSection.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    } else {
      // Redirect to homepage contact section
      window.location.href = '/#contact';
    }
  };

  const handleFacebook = () => {
    window.open("https://www.facebook.com/profile.php?id=61578321455931", "_blank");
  };

  const handleLinkedIn = () => {
    window.open("https://www.linkedin.com/company/go-abroad-bd", "_blank");
  };

  return (
    <>
      {/* Mobile Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background border-t border-border shadow-lg">
        <div className="grid grid-cols-4 gap-2 p-3">
          <Button
            onClick={handleCall}
            className="bg-primary hover:bg-primary/90 text-white flex flex-col items-center gap-1 h-auto py-3 rounded-2xl shadow-md"
          >
            <Phone className="w-5 h-5" />
            <span className="text-xs">Talk</span>
          </Button>
          <Button
            onClick={handleWhatsApp}
            className="bg-green-600 hover:bg-green-700 text-white flex flex-col items-center gap-1 h-auto py-3 rounded-2xl shadow-md"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs">Chat</span>
          </Button>
          <Button
            onClick={handleFacebook}
            className="bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center gap-1 h-auto py-3 rounded-2xl shadow-md"
          >
            <Facebook className="w-5 h-5" />
            <span className="text-xs">Facebook</span>
          </Button>
          <Button
            onClick={handleEnquire}
            className="flex flex-col items-center gap-1 h-auto py-3 rounded-2xl shadow-md"
            style={{ backgroundColor: '#C9B875', color: '#1A1A1A' }}
          >
            <Hand className="w-5 h-5" />
            <span className="text-xs font-semibold">Get Started</span>
          </Button>
        </div>
      </div>

      {/* Desktop Floating Buttons */}
      <div className="hidden md:block">
        {/* Call Button */}
        <button
          onClick={handleCall}
          className="fixed bottom-[360px] right-6 z-40 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white w-16 h-16 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_30px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-110 group flex items-center justify-center"
          aria-label="Call us"
        >
          <Phone className="w-7 h-7" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Call +880 1898934855
          </span>
        </button>

        {/* Facebook Button */}
        <button
          onClick={handleFacebook}
          className="fixed bottom-[440px] right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white w-16 h-16 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_30px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-110 group flex items-center justify-center"
          aria-label="Facebook"
        >
          <Facebook className="w-7 h-7" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Follow on Facebook
          </span>
        </button>

        {/* Enquire Button */}
        <button
          onClick={handleEnquire}
          className="fixed bottom-[200px] right-6 z-40 text-[#1A1A1A] w-16 h-16 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_30px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-110 group flex items-center justify-center"
          style={{ backgroundColor: '#C9B875' }}
          aria-label="Get Started"
        >
          <Hand className="w-7 h-7" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Get Started
          </span>
        </button>

        {/* LinkedIn Button */}
        <button
          onClick={handleLinkedIn}
          className="fixed bottom-[120px] right-6 z-40 bg-blue-700 hover:bg-blue-800 text-white w-16 h-16 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_30px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-110 group flex items-center justify-center"
          aria-label="LinkedIn"
        >
          <Linkedin className="w-7 h-7" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Connect on LinkedIn
          </span>
        </button>

        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsApp}
          className="fixed bottom-[40px] right-6 z-40 bg-green-600 hover:bg-green-700 text-white w-16 h-16 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_30px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-110 group flex items-center justify-center"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-7 h-7" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Chat on WhatsApp
          </span>
        </button>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-[520px] right-6 z-40 bg-secondary hover:bg-secondary/90 text-primary w-14 h-14 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_30px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-110 animate-fade-in flex items-center justify-center"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        )}
      </div>
    </>
  );
};
