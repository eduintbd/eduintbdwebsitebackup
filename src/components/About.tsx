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
    },
    {
      icon: Globe,
      title: t.networkTitle,
      description: t.networkDesc,
    },
    {
      icon: Users,
      title: t.teamTitle,
      description: t.teamDesc,
    },
    {
      icon: TrendingUp,
      title: t.successTitle,
      description: t.successDesc,
    },
  ];
  return (
    <section className="py-24 bg-background">
      <div className="container px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
              {t.title}{" "}
              <span className="bg-gradient-to-r from-secondary via-secondary/80 to-secondary bg-clip-text text-transparent">
                {t.titleHighlight}
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t.description}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary/10 flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {t.description2}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t.description3}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
