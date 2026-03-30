import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { MessageCircle, FileText, Settings, Award, Plane } from "lucide-react";

export const Process = () => {
  const { language } = useLanguage();
  const t = translations[language].process;

  const steps = [
    { number: "01", title: t.step1Title, description: t.step1Desc, icon: MessageCircle },
    { number: "02", title: t.step2Title, description: t.step2Desc, icon: FileText },
    { number: "03", title: t.step3Title, description: t.step3Desc, icon: Settings },
    { number: "04", title: t.step4Title, description: t.step4Desc, icon: Award },
    { number: "05", title: t.step5Title, description: t.step5Desc, icon: Plane },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-primary via-[hsl(215,50%,20%)] to-[hsl(215,55%,15%)] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="container px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
            <span className="text-white/80 text-sm font-semibold tracking-wide uppercase">
              {language === 'en' ? 'How It Works' : 'প্রক্রিয়া'}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-white/60 max-w-3xl mx-auto font-light">{t.subtitle}</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative animate-slide-up group"
                style={{ animationDelay: `${index * 0.12}s` }}
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(50%+2rem)] w-[calc(100%-2rem)] h-[2px] bg-gradient-to-r from-secondary/50 to-white/10 z-0" />
                )}

                <div className="relative z-10 text-center">
                  {/* Number + Icon */}
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-2xl bg-secondary/20 rotate-6 group-hover:rotate-12 transition-transform duration-300" />
                    <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-lg shadow-secondary/20">
                      <step.icon className="w-9 h-9 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white text-primary text-xs font-bold flex items-center justify-center shadow-md">
                      {step.number}
                    </div>
                  </div>

                  <h3 className="text-lg font-display font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-white/50 leading-relaxed text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
