import { Button } from "@/components/ui/button";
import { Search, GraduationCap, Building2, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

export const CourseSearch = () => {
  const { language } = useLanguage();
  const t = translations[language].courseSearch;

  return (
    <section className="py-24 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div className="space-y-6 animate-fade-in">
              <div className="inline-block bg-secondary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                {t.badge}
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground">
                {t.title}
              </h2>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                {t.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 py-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary/20 rounded-full mb-2">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">200,000+</div>
                  <div className="text-sm text-muted-foreground">{t.courses}</div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary/20 rounded-full mb-2">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">1,100+</div>
                  <div className="text-sm text-muted-foreground">{t.institutionPartners}</div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary/20 rounded-full mb-2">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">16</div>
                  <div className="text-sm text-muted-foreground">{t.countries}</div>
                </div>
              </div>

              <Button 
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-primary font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => window.open('https://www.edvoy.com', '_blank')}
              >
                <Search className="mr-2 w-5 h-5" />
                {t.button}
              </Button>
            </div>

            {/* Right side - Visual */}
            <div className="relative animate-fade-in">
              <div className="relative bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 shadow-2xl">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-secondary rounded-full opacity-20 blur-2xl" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary rounded-full opacity-20 blur-2xl" />
                
                <div className="relative space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                    <Search className="w-8 h-8 text-secondary mb-3" />
                    <h3 className="text-white font-semibold text-lg mb-2">{t.advancedSearch}</h3>
                    <p className="text-white/80 text-sm">{t.advancedSearchDesc}</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                    <GraduationCap className="w-8 h-8 text-secondary mb-3" />
                    <h3 className="text-white font-semibold text-lg mb-2">{t.instantRecommendations}</h3>
                    <p className="text-white/80 text-sm">{t.instantRecommendationsDesc}</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                    <Building2 className="w-8 h-8 text-secondary mb-3" />
                    <h3 className="text-white font-semibold text-lg mb-2">{t.directApplication}</h3>
                    <p className="text-white/80 text-sm">{t.directApplicationDesc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
