import { Award, Globe, Users, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

export const About = () => {
  const { language } = useLanguage();
  const t = translations[language].about;

  const features = [
    {
      icon: Award,
      title: t.icefTitle,
      description: t.icefDesc,
      color: "bg-blue-50 text-blue-600",
      border: "border-blue-100",
    },
    {
      icon: Globe,
      title: t.networkTitle,
      description: t.networkDesc,
      color: "bg-red-50 text-red-600",
      border: "border-red-100",
    },
    {
      icon: Users,
      title: t.teamTitle,
      description: t.teamDesc,
      color: "bg-emerald-50 text-emerald-600",
      border: "border-emerald-100",
    },
    {
      icon: TrendingUp,
      title: t.successTitle,
      description: t.successDesc,
      color: "bg-amber-50 text-amber-600",
      border: "border-amber-100",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-secondary/10 rounded-full px-4 py-2 mb-6">
              <span className="text-secondary text-sm font-semibold tracking-wide uppercase">
                {language === 'en' ? 'About Us' : 'আমাদের সম্পর্কে'}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
              {t.title}{" "}
              <span className="text-secondary">{t.titleHighlight}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`text-center p-8 rounded-3xl border ${feature.border} bg-card hover:shadow-lg transition-all duration-500 animate-slide-up group`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 mx-auto mb-5 rounded-2xl ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="bg-muted/40 rounded-3xl p-8 md:p-12 border border-border">
              <div className="flex gap-6">
                <div className="hidden md:block w-1 bg-gradient-to-b from-secondary to-secondary/20 rounded-full flex-shrink-0" />
                <div className="space-y-5">
                  <p className="text-lg text-muted-foreground leading-relaxed">{t.description2}</p>
                  <p className="text-lg text-muted-foreground leading-relaxed">{t.description3}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
