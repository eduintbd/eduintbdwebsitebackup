import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

export const Destinations = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language].destinations;

  const destinations = [
    { name: language === 'en' ? "United Kingdom" : "যুক্তরাজ্য", image: "🇬🇧", programs: `500+ ${t.programs}`, link: "/study-uk" },
    { name: language === 'en' ? "United States" : "মার্কিন যুক্তরাষ্ট্র", image: "🇺🇸", programs: `800+ ${t.programs}`, link: "/study-usa" },
    { name: language === 'en' ? "Canada" : "কানাডা", image: "🇨🇦", programs: `400+ ${t.programs}`, link: "/study-canada" },
    { name: language === 'en' ? "Australia" : "অস্ট্রেলিয়া", image: "🇦🇺", programs: `350+ ${t.programs}`, link: "/study-australia" },
    { name: language === 'en' ? "New Zealand" : "নিউজিল্যান্ড", image: "🇳🇿", programs: `200+ ${t.programs}`, link: "/study-new-zealand" },
    { name: language === 'en' ? "South Korea" : "দক্ষিণ কোরিয়া", image: "🇰🇷", programs: `150+ ${t.programs}`, link: "/study-south-korea" },
    { name: language === 'en' ? "Europe" : "ইউরোপ", image: "🇪🇺", programs: `600+ ${t.programs}`, link: "/study-germany" },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
            {t.subtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {destinations.map((destination, index) => (
            <Card
              key={destination.name}
              onClick={() => navigate(destination.link)}
              className="group relative overflow-hidden bg-card border-border hover:border-secondary/50 p-8 rounded-2xl transition-all duration-500 hover:shadow-xl cursor-pointer animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative z-10">
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {destination.image}
                </div>
                <h3 className="text-2xl font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {destination.name}
                </h3>
                <p className="text-muted-foreground">{destination.programs}</p>
              </div>
              
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
