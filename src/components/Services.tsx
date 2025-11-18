import { GraduationCap, FileCheck, Plane, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

export const Services = () => {
  const { language } = useLanguage();
  const t = translations[language].services;

  const services = [
    {
      icon: GraduationCap,
      title: t.counsellingTitle,
      description: t.counsellingDesc,
      link: "/admission",
    },
    {
      icon: FileCheck,
      title: t.applicationTitle,
      description: t.applicationDesc,
      link: "/admission",
    },
    {
      icon: Plane,
      title: t.visaTitle,
      description: t.visaDesc,
      link: "/visa",
    },
    {
      icon: Award,
      title: t.scholarshipTitle,
      description: t.scholarshipDesc,
      link: "/scholarship",
    },
  ];
  return (
    <section className="py-24 bg-background">
      <div className="container px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
            {t.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <Link
              key={service.title}
              to={service.link}
              className="group relative bg-card rounded-2xl p-8 border border-border hover:border-secondary/50 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_hsl(var(--secondary)/0.3)] animate-scale-in block"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Icon */}
              <div className="w-16 h-16 mb-6 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-all duration-300">
                <service.icon className="w-8 h-8 text-secondary" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>

              {/* Hover gradient effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-secondary/0 via-secondary/0 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
