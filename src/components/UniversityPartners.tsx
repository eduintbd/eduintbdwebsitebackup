import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

export const UniversityPartners = () => {
  const { language } = useLanguage();
  const t = translations[language].universityPartners;

  const partners = [
    { name: "Harvard University", color: "bg-secondary", textColor: "text-foreground", url: "https://www.harvard.edu/" },
    { name: "University of Toronto", color: "bg-primary", textColor: "text-primary-foreground", url: "https://www.utoronto.ca/" },
    { name: "University of Oxford", color: "bg-secondary", textColor: "text-foreground", url: "https://www.ox.ac.uk/" },
    { name: "University of Cambridge", color: "bg-primary", textColor: "text-primary-foreground", url: "https://www.cam.ac.uk/" },
    { name: "University of Melbourne", color: "bg-secondary", textColor: "text-foreground", url: "https://www.unimelb.edu.au/" },
    { name: "University of Sydney", color: "bg-primary", textColor: "text-primary-foreground", url: "https://www.sydney.edu.au/" },
    { name: "Australian National University", color: "bg-secondary", textColor: "text-foreground", url: "https://www.anu.edu.au/" },
  ];

  return (
    <section className="py-16 bg-background border-y border-border">
      <div className="container px-6">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest text-muted-foreground/60 mb-3 font-light">
            {t.subtitle}
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-normal text-foreground">
            {t.title}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6 max-w-7xl mx-auto items-stretch">
          {partners.map((partner, index) => (
            <a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center animate-fade-in hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`${partner.color} rounded-lg p-4 w-full h-32 flex items-center justify-center shadow-md`}>
                <p className={`text-sm text-center ${partner.textColor} font-semibold leading-tight`}>
                  {partner.name}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
