import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { useState, useEffect } from "react";

const countries = [
  { name: "Canada", flag: "🇨🇦" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "United States", flag: "🇺🇸" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "New Zealand", flag: "🇳🇿" },
  { name: "South Korea", flag: "🇰🇷" },
];

export const Hero = () => {
  const { language } = useLanguage();
  const t = translations[language].hero;
  const [currentCountry, setCurrentCountry] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentCountry((prev) => (prev + 1) % countries.length);
        setIsAnimating(false);
      }, 400);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#F5F0E8]">
      {/* Subtle wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60C240 120 480 0 720 60C960 120 1200 0 1440 60V120H0V60Z" fill="white" fillOpacity="0.6" />
        </svg>
      </div>

      <div className="container relative z-10 px-6 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6 animate-fade-in max-w-xl">
            <p className="text-lg text-foreground/70 font-medium font-display italic">
              Universal Council is here for{" "}
              <span className="underline decoration-secondary decoration-2 underline-offset-4">
                {language === 'en' ? 'Pre-departure to Post-arrival' : 'প্রি-ডিপার্চার থেকে পোস্ট-অ্যারাইভাল'}
              </span>
            </p>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary leading-[1.2]">
              START Your Study Abroad Journey with Universal Council for
            </h1>

            {/* Animated country name */}
            <div className="h-14 flex items-center">
              <span
                className={`text-3xl md:text-4xl lg:text-5xl font-display font-bold text-secondary transition-all duration-400 ${
                  isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                }`}
              >
                {countries[currentCountry].name} {countries[currentCountry].flag}
              </span>
            </div>

            <p className="text-lg text-foreground/60 leading-relaxed max-w-md">
              {t.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-6 text-base rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Contact Us
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Right Side - World Map */}
          <div className="hidden lg:flex items-center justify-center relative">
            <div className="relative w-full max-w-[580px]">
              {/* Real world map SVG */}
              <svg viewBox="0 0 1000 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                {/* Ocean ellipse bg */}
                <ellipse cx="500" cy="250" rx="480" ry="240" fill="#CBD5E1" opacity="0.15" />
                <ellipse cx="500" cy="250" rx="460" ry="225" fill="#94A3B8" opacity="0.12" />

                {/* ===== CONTINENTS ===== */}
                {/* North America */}
                <path d="M120 100 L155 80 L190 75 L220 82 L245 95 L260 85 L275 90 L280 105 L270 120 L258 115 L250 125 L260 140 L255 155 L240 168 L225 175 L215 185 L200 195 L195 210 L180 225 L165 230 L150 222 L140 210 L130 195 L115 180 L105 160 L100 140 L108 120 L120 100Z"
                  fill="hsl(var(--primary))" opacity="0.35" />
                {/* Greenland */}
                <path d="M270 55 L300 48 L320 52 L325 65 L315 78 L295 80 L275 72 L270 55Z"
                  fill="hsl(var(--primary))" opacity="0.3" />
                {/* Central America */}
                <path d="M165 230 L175 235 L185 245 L180 255 L170 260 L160 250 L158 240 L165 230Z"
                  fill="hsl(var(--primary))" opacity="0.35" />
                {/* South America */}
                <path d="M195 270 L210 260 L225 265 L235 280 L240 300 L245 325 L240 350 L230 375 L215 395 L200 405 L190 395 L185 375 L180 350 L178 325 L180 300 L185 280 L195 270Z"
                  fill="hsl(var(--primary))" opacity="0.35" />

                {/* Europe */}
                <path d="M430 80 L445 72 L460 68 L475 72 L490 78 L500 88 L505 100 L498 110 L488 115 L480 108 L470 112 L458 108 L448 100 L440 92 L430 80Z"
                  fill="hsl(var(--primary))" opacity="0.35" />
                {/* UK/Ireland */}
                <path d="M415 78 L425 72 L430 80 L426 88 L418 90 L413 84 L415 78Z"
                  fill="hsl(var(--primary))" opacity="0.4" />
                {/* Scandinavia */}
                <path d="M460 45 L470 38 L478 42 L482 55 L480 68 L475 72 L465 65 L458 52 L460 45Z"
                  fill="hsl(var(--primary))" opacity="0.3" />

                {/* Africa */}
                <path d="M445 155 L465 148 L485 150 L505 158 L520 170 L530 190 L535 215 L530 245 L520 275 L508 300 L495 318 L480 330 L465 332 L450 325 L440 308 L435 285 L430 260 L428 235 L430 210 L435 190 L440 170 L445 155Z"
                  fill="hsl(var(--primary))" opacity="0.35" />

                {/* Asia - main body */}
                <path d="M510 60 L540 50 L575 48 L610 52 L650 58 L690 55 L720 60 L750 68 L770 80 L780 95 L785 110 L780 130 L770 145 L755 155 L740 162 L720 165 L700 168 L680 172 L660 170 L640 165 L620 155 L605 148 L590 140 L575 135 L555 130 L540 120 L525 110 L515 98 L508 85 L510 60Z"
                  fill="hsl(var(--primary))" opacity="0.35" />
                {/* India subcontinent */}
                <path d="M630 165 L645 170 L655 185 L660 205 L655 225 L645 240 L630 248 L620 240 L615 225 L612 205 L618 185 L625 172 L630 165Z"
                  fill="hsl(var(--primary))" opacity="0.35" />
                {/* Bangladesh - HIGHLIGHTED */}
                <path d="M652 192 L660 188 L666 192 L668 200 L665 208 L658 212 L652 208 L650 200 L652 192Z"
                  fill="#F59E0B" opacity="0.9" />
                {/* Glow around Bangladesh */}
                <circle cx="659" cy="200" r="18" fill="#F59E0B" opacity="0.15" />
                <circle cx="659" cy="200" r="28" fill="#F59E0B" opacity="0.06" />
                {/* Southeast Asia */}
                <path d="M700 170 L715 175 L725 188 L730 205 L720 215 L708 210 L700 198 L695 185 L700 170Z"
                  fill="hsl(var(--primary))" opacity="0.35" />
                {/* China/East Asia */}
                <path d="M700 95 L730 88 L755 92 L770 105 L775 120 L768 135 L750 145 L735 150 L720 148 L705 140 L695 128 L690 112 L695 100 L700 95Z"
                  fill="hsl(var(--primary))" opacity="0.35" />
                {/* Japan */}
                <path d="M790 100 L798 95 L802 100 L800 115 L795 125 L788 120 L785 108 L790 100Z"
                  fill="hsl(var(--primary))" opacity="0.35" />
                {/* Korea */}
                <path d="M775 100 L782 96 L786 102 L784 112 L778 116 L774 110 L775 100Z"
                  fill="hsl(var(--primary))" opacity="0.4" />

                {/* Indonesia/Malaysia */}
                <path d="M720 225 L740 220 L760 222 L775 228 L780 238 L770 242 L755 240 L738 235 L725 232 L720 225Z"
                  fill="hsl(var(--primary))" opacity="0.3" />

                {/* Australia */}
                <path d="M760 310 L790 298 L820 295 L850 300 L870 315 L878 335 L875 358 L862 375 L840 385 L815 388 L790 380 L770 365 L758 345 L755 325 L760 310Z"
                  fill="hsl(var(--primary))" opacity="0.35" />
                {/* New Zealand */}
                <path d="M895 370 L902 365 L906 372 L904 385 L898 390 L893 382 L895 370Z"
                  fill="hsl(var(--primary))" opacity="0.3" />

                {/* Russia top */}
                <path d="M520 40 L560 32 L610 30 L660 32 L710 35 L750 40 L780 48 L790 55 L785 65 L770 68 L750 62 L720 55 L690 50 L650 48 L610 45 L570 42 L530 45 L520 40Z"
                  fill="hsl(var(--primary))" opacity="0.25" />

                {/* ===== FLIGHT PATHS FROM BANGLADESH ===== */}
                {/* BD to UK */}
                <path d="M659 198 Q560 120 422 82" stroke="#3B82F6" strokeWidth="2" strokeDasharray="6 4" fill="none" opacity="0.5">
                  <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="2s" repeatCount="indefinite" />
                </path>
                {/* BD to Canada */}
                <path d="M659 198 Q400 80 185 140" stroke="#3B82F6" strokeWidth="2" strokeDasharray="6 4" fill="none" opacity="0.5">
                  <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="2.5s" repeatCount="indefinite" />
                </path>
                {/* BD to USA */}
                <path d="M659 198 Q380 140 170 185" stroke="#3B82F6" strokeWidth="2" strokeDasharray="6 4" fill="none" opacity="0.4">
                  <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="2.2s" repeatCount="indefinite" />
                </path>
                {/* BD to Australia */}
                <path d="M659 200 Q730 280 810 340" stroke="#3B82F6" strokeWidth="2" strokeDasharray="6 4" fill="none" opacity="0.5">
                  <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="2s" repeatCount="indefinite" />
                </path>
                {/* BD to S.Korea */}
                <path d="M659 198 Q720 140 778 108" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="5 4" fill="none" opacity="0.4">
                  <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="1.5s" repeatCount="indefinite" />
                </path>

                {/* ===== AIRPLANE ===== */}
                <g transform="translate(380, 85) rotate(-30) scale(2)">
                  <path d="M0 5 L18 0 L20 2.5 L6 5.5 L7 9 L4 8 L2.5 5.5Z" fill="hsl(var(--primary))" />
                  <path d="M8 1.5 L15 0 L18 1 L11 3.5Z" fill="#F5F0E8" opacity="0.6" />
                  <path d="M2 5.5 L0.5 8 L4 8Z" fill="hsl(var(--primary))" opacity="0.6" />
                </g>

                {/* ===== LOCATION PINS ===== */}
                {/* Bangladesh - Origin (large orange pin) */}
                <circle cx="659" cy="200" r="10" fill="#F59E0B" stroke="white" strokeWidth="3.5" />
                <circle cx="659" cy="200" r="4" fill="white" />

                {/* Canada */}
                <circle cx="185" cy="140" r="7" fill="#3B82F6" stroke="white" strokeWidth="2.5" />
                <circle cx="185" cy="140" r="2.5" fill="white" />

                {/* USA */}
                <circle cx="170" cy="185" r="7" fill="#3B82F6" stroke="white" strokeWidth="2.5" />
                <circle cx="170" cy="185" r="2.5" fill="white" />

                {/* UK */}
                <circle cx="422" cy="82" r="7" fill="#3B82F6" stroke="white" strokeWidth="2.5" />
                <circle cx="422" cy="82" r="2.5" fill="white" />

                {/* Germany */}
                <circle cx="470" cy="85" r="5.5" fill="#3B82F6" stroke="white" strokeWidth="2" />
                <circle cx="470" cy="85" r="2" fill="white" />

                {/* Australia */}
                <circle cx="810" cy="340" r="7" fill="#3B82F6" stroke="white" strokeWidth="2.5" />
                <circle cx="810" cy="340" r="2.5" fill="white" />

                {/* South Korea */}
                <circle cx="778" cy="108" r="5.5" fill="#3B82F6" stroke="white" strokeWidth="2" />
                <circle cx="778" cy="108" r="2" fill="white" />

                {/* ===== LABELS ===== */}
                <text x="659" y="178" textAnchor="middle" fill="#F59E0B" fontSize="14" fontWeight="800" fontFamily="Inter, sans-serif">Bangladesh</text>
                <text x="185" y="128" textAnchor="middle" fill="hsl(var(--primary))" fontSize="11" fontWeight="700" fontFamily="Inter, sans-serif" opacity="0.65">Canada</text>
                <text x="155" y="208" textAnchor="start" fill="hsl(var(--primary))" fontSize="11" fontWeight="700" fontFamily="Inter, sans-serif" opacity="0.65">USA</text>
                <text x="422" y="72" textAnchor="middle" fill="hsl(var(--primary))" fontSize="11" fontWeight="700" fontFamily="Inter, sans-serif" opacity="0.65">UK</text>
                <text x="810" y="365" textAnchor="middle" fill="hsl(var(--primary))" fontSize="11" fontWeight="700" fontFamily="Inter, sans-serif" opacity="0.65">Australia</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
          <div className="text-center p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm">
            <div className="text-2xl md:text-3xl font-bold text-primary">200K+</div>
            <div className="text-foreground/50 text-sm mt-1">{t.courses}</div>
          </div>
          <div className="text-center p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm">
            <div className="text-2xl md:text-3xl font-bold text-primary">1,100+</div>
            <div className="text-foreground/50 text-sm mt-1">{t.partners}</div>
          </div>
          <div className="text-center p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm">
            <div className="text-2xl md:text-3xl font-bold text-primary">14</div>
            <div className="text-foreground/50 text-sm mt-1">{t.countries}</div>
          </div>
          <div className="text-center p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm">
            <div className="text-2xl md:text-3xl font-bold text-secondary">98%</div>
            <div className="text-foreground/50 text-sm mt-1">{language === 'en' ? 'Visa Success' : 'ভিসা সফলতা'}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
