import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { ArrowRight } from "lucide-react";

export const Destinations = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language].destinations;

  const destinations = [
    { name: language === 'en' ? "United Kingdom" : "যুক্তরাজ্য", image: "🇬🇧", programs: `500+ ${t.programs}`, link: "/study-uk", color: "from-blue-600 to-blue-800" },
    { name: language === 'en' ? "United States" : "মার্কিন যুক্তরাষ্ট্র", image: "🇺🇸", programs: `800+ ${t.programs}`, link: "/study-usa", color: "from-red-600 to-red-800" },
    { name: language === 'en' ? "Canada" : "কানাডা", image: "🇨🇦", programs: `400+ ${t.programs}`, link: "/study-canada", color: "from-rose-600 to-rose-800" },
    { name: language === 'en' ? "Australia" : "অস্ট্রেলিয়া", image: "🇦🇺", programs: `350+ ${t.programs}`, link: "/study-australia", color: "from-emerald-600 to-emerald-800" },
    { name: language === 'en' ? "New Zealand" : "নিউজিল্যান্ড", image: "🇳🇿", programs: `200+ ${t.programs}`, link: "/study-new-zealand", color: "from-teal-600 to-teal-800" },
    { name: language === 'en' ? "South Korea" : "দক্ষিণ কোরিয়া", image: "🇰🇷", programs: `150+ ${t.programs}`, link: "/study-south-korea", color: "from-indigo-600 to-indigo-800" },
    { name: language === 'en' ? "Europe" : "ইউরোপ", image: "🇪🇺", programs: `600+ ${t.programs}`, link: "/study-germany", color: "from-violet-600 to-violet-800" },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container px-6">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-secondary/10 rounded-full px-4 py-2 mb-6">
            <span className="text-secondary text-sm font-semibold tracking-wide uppercase">
              {language === 'en' ? 'Destinations' : 'গন্তব্য'}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">{t.subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-7xl mx-auto">
          {destinations.map((destination, index) => (
            <Card
              key={destination.name}
              onClick={() => navigate(destination.link)}
              className="group relative overflow-hidden rounded-3xl border-0 cursor-pointer animate-scale-in hover:shadow-2xl transition-all duration-500"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${destination.color} opacity-90`} />

              <div className="relative z-10 p-7">
                <div className="text-6xl mb-5 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                  {destination.image}
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-1">
                  {destination.name}
                </h3>
                <p className="text-white/70 text-sm mb-4">{destination.programs}</p>
                <div className="flex items-center gap-2 text-white/80 group-hover:text-white text-sm font-medium transition-colors">
                  <span>{language === 'en' ? 'Explore' : 'দেখুন'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
