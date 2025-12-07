import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

export const Hero = () => {
  const { language } = useLanguage();
  const t = translations[language].hero;
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>
      
      {/* Gradient Orbs - Simplified for better performance */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-secondary/20 rounded-full blur-2xl md:blur-3xl opacity-50" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-secondary/10 rounded-full blur-2xl md:blur-3xl opacity-50" />

      <div className="container relative z-10 px-6 py-20">
        <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 sm:px-6 py-2 sm:py-3">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
            <span className="text-white text-sm sm:text-base font-medium select-none">{t.badge}</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight select-none">
            {t.title} <span className="text-secondary select-none">{t.titleHighlight}</span>
          </h1>
          
          <p className="text-base md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto font-light leading-relaxed select-none">
            {t.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button 
              size="lg" 
              className="bg-secondary hover:bg-secondary/90 text-primary font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t.cta}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Floating Stats Cards - Optimized for low-end devices */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 sm:p-6 transition-transform duration-300 hover:scale-105">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary mb-2">200,000+</div>
              <div className="text-white/90 text-xs sm:text-sm font-medium">{t.courses}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 sm:p-6 transition-transform duration-300 hover:scale-105">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary mb-2">1,100+</div>
              <div className="text-white/90 text-xs sm:text-sm font-medium">{t.partners}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 sm:p-6 transition-transform duration-300 hover:scale-105">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary mb-2">16</div>
              <div className="text-white/90 text-xs sm:text-sm font-medium">{t.countries}</div>
            </div>
          </div>

          {/* End-to-end Badge */}
          <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 sm:px-6 py-2 sm:py-3 mt-8">
            <span className="text-white text-sm sm:text-base font-medium select-none">{t.endToEnd} </span>
            <span className="text-secondary text-sm sm:text-base font-bold select-none">{t.forFree}</span>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
