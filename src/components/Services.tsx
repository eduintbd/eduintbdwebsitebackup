import {
  MessageCircle, FileCheck, FileText, Monitor, Stamp, Briefcase,
  Home, PlaneTakeoff, Building2, ScrollText, Landmark, ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

export const Services = () => {
  const { language } = useLanguage();
  const t = translations[language].services;

  const services = [
    {
      icon: MessageCircle,
      title: language === 'en' ? "Free Consultation" : "বিনামূল্যে পরামর্শ",
      bg: "bg-pink-50",
      iconColor: "text-pink-500",
      link: "/admission",
    },
    {
      icon: FileCheck,
      title: language === 'en' ? "Admission Services" : "ভর্তি সেবা",
      bg: "bg-sky-50",
      iconColor: "text-sky-600",
      link: "/admission",
    },
    {
      icon: FileText,
      title: language === 'en' ? "Guiding Students with Support Documents" : "সহায়ক ডকুমেন্ট গাইডেন্স",
      bg: "bg-rose-50",
      iconColor: "text-rose-500",
      link: "/admission",
    },
    {
      icon: Monitor,
      title: language === 'en' ? "Interview Preparation" : "ইন্টারভিউ প্রস্তুতি",
      bg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      link: "/visa",
    },
    {
      icon: Stamp,
      title: language === 'en' ? "Visa Submission Assistance" : "ভিসা জমা সহায়তা",
      bg: "bg-amber-50",
      iconColor: "text-amber-500",
      link: "/visa",
    },
    {
      icon: Briefcase,
      title: language === 'en' ? "Pre-Departure Briefing" : "প্রি-ডিপার্চার ব্রিফিং",
      bg: "bg-violet-50",
      iconColor: "text-violet-500",
      link: "/pre-departure",
    },
    {
      icon: Home,
      title: language === 'en' ? "Accommodation Arrangements" : "থাকার ব্যবস্থা",
      bg: "bg-pink-50",
      iconColor: "text-pink-500",
      link: "/accommodation",
    },
    {
      icon: PlaneTakeoff,
      title: language === 'en' ? "Airport Pick-Up" : "এয়ারপোর্ট পিক-আপ",
      bg: "bg-blue-50",
      iconColor: "text-blue-500",
      link: "/pre-departure",
    },
    {
      icon: Building2,
      title: language === 'en' ? "Institution Change Processing" : "প্রতিষ্ঠান পরিবর্তন প্রক্রিয়া",
      bg: "bg-orange-50",
      iconColor: "text-orange-500",
      link: "/admission",
    },
    {
      icon: ScrollText,
      title: language === 'en' ? "Study Permit Extension & Post-Graduation Work Permit" : "স্টাডি পারমিট এক্সটেনশন ও পোস্ট-গ্র্যাজুয়েশন ওয়ার্ক পারমিট",
      bg: "bg-teal-50",
      iconColor: "text-teal-500",
      link: "/visa",
    },
    {
      icon: Landmark,
      title: language === 'en' ? "Helping Students with PR (Permanent Residency) Process" : "পিআর (স্থায়ী বাসিন্দা) প্রক্রিয়ায় সহায়তা",
      bg: "bg-sky-100",
      iconColor: "text-white",
      highlight: true,
      link: "/career",
    },
  ];

  return (
    <section className="py-24 bg-white" id="services">
      <div className="container px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-3">
            {language === 'en' ? 'Services' : 'সেবাসমূহ'}
          </h2>
          {/* Underline decoration */}
          <div className="flex justify-center mb-6">
            <svg width="80" height="16" viewBox="0 0 80 16" fill="none">
              <path d="M5 11C20 3 60 3 75 11" stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-light">
            {language === 'en'
              ? 'Our service provides the full guidance for the student from free consulting to accommodation support and many more.'
              : 'আমাদের সেবা শিক্ষার্থীদের বিনামূল্যে পরামর্শ থেকে থাকার ব্যবস্থা এবং আরও অনেক কিছু সহ সম্পূর্ণ গাইডেন্স প্রদান করে।'}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <Link
              key={service.title}
              to={service.link}
              className={`group flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-scale-in ${
                service.highlight
                  ? 'bg-sky-500 border-sky-500 text-white'
                  : 'bg-white border-gray-100 hover:border-secondary/30'
              }`}
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                service.highlight ? 'bg-white/20' : service.bg
              }`}>
                <service.icon className={`w-7 h-7 ${service.highlight ? 'text-white' : service.iconColor}`} strokeWidth={1.8} />
              </div>
              <h3 className={`text-sm font-bold leading-snug ${
                service.highlight ? 'text-white' : 'text-foreground'
              }`}>
                {service.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
