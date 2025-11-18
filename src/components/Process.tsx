import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

export const Process = () => {
  const { language } = useLanguage();
  const t = translations[language].process;

  const steps = [
    {
      number: "01",
      title: t.step1Title,
      description: t.step1Desc,
    },
    {
      number: "02",
      title: t.step2Title,
      description: t.step2Desc,
    },
    {
      number: "03",
      title: t.step3Title,
      description: t.step3Desc,
    },
    {
      number: "04",
      title: t.step4Title,
      description: t.step4Desc,
    },
    {
      number: "05",
      title: t.step5Title,
      description: t.step5Desc,
    },
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

        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative animate-slide-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Connector Line (hidden on last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-secondary/50 to-transparent -translate-x-1/2 z-0" />
                )}

                {/* Step Card */}
                <div className="relative z-10">
                  {/* Number Badge */}
                  <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center text-primary font-display font-bold text-2xl shadow-lg">
                    {step.number}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
