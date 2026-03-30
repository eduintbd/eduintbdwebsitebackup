import { Facebook, MessageCircle, Instagram, Linkedin, Mail, Phone, MapPin, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden">
      {/* Our Global Branches Section */}
      <div className="bg-primary text-white py-20 relative">
        {/* World map background */}
        <div className="absolute inset-0 opacity-[0.06]">
          <svg viewBox="0 0 1200 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
            <ellipse cx="600" cy="250" rx="550" ry="220" fill="white" />
            <path d="M200 160 Q220 120 280 110 Q330 105 370 120 Q400 140 390 180 Q380 210 340 220 Q290 230 250 215 Q210 195 200 160Z" fill="white" opacity="0.4" />
            <path d="M320 230 Q340 215 360 225 Q380 250 370 290 Q355 320 330 330 Q315 320 310 285 Q305 250 320 230Z" fill="white" opacity="0.4" />
            <path d="M530 120 Q555 105 580 115 Q595 125 600 145 Q590 165 570 170 Q550 165 540 145 Q530 130 530 120Z" fill="white" opacity="0.4" />
            <path d="M555 175 Q570 168 585 175 Q600 195 595 240 Q585 275 565 285 Q550 278 547 240 Q544 200 555 175Z" fill="white" opacity="0.4" />
            <path d="M640 110 Q690 95 745 100 Q800 115 830 150 Q850 180 830 215 Q795 235 750 225 Q700 210 675 185 Q645 155 640 125 Q638 115 640 110Z" fill="white" opacity="0.4" />
            <path d="M800 270 Q830 262 850 275 Q865 290 858 310 Q845 322 825 318 Q805 312 798 295 Q794 280 800 270Z" fill="white" opacity="0.4" />
          </svg>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-10 right-20 w-32 h-32 border border-white/10 rounded-full" />
        <div className="absolute top-5 right-14 w-44 h-44 border border-white/5 rounded-full" />
        <div className="absolute bottom-10 left-10 w-24 h-24 border border-white/10 rounded-full" />

        <div className="container px-6 relative z-10">
          {/* Title */}
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white italic mb-3">
              Our Office
            </h2>
            <div className="flex justify-center">
              <svg width="80" height="16" viewBox="0 0 80 16" fill="none">
                <path d="M5 11C20 3 60 3 75 11" stroke="white" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-10 items-start">
            {/* Dhaka Office - Left Side */}
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Logo size={42} className="text-white" />
                <div>
                  <h3 className="text-2xl font-display font-bold text-white">
                    Universal Council
                  </h3>
                  <p className="text-xs font-semibold text-white/60 tracking-widest uppercase mt-0.5">
                    International Education Consultancy
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="flex items-center gap-2 text-lg font-display font-bold text-white">
                  <MapPin className="w-5 h-5 text-secondary" />
                  Dhaka Office
                </h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  Flat 3G, House 3G, Road 104,<br />
                  Gulshan 2, Dhaka - 1212, Bangladesh
                </p>
                <p className="text-white/60 text-sm">
                  <a href="tel:+8801749614998" className="hover:text-white transition-colors">+880 1749-614998</a>
                </p>
                <p className="text-white/60 text-sm">
                  <a href="mailto:info@universalcouncil.com" className="hover:text-white transition-colors">info@universalcouncil.com</a>
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <a href="https://www.facebook.com/share/1E1eN62AQw/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Facebook">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://www.facebook.com/share/1E1eN62AQw/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="https://www.instagram.com/universalcouncil" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="YouTube">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* About Text - Right Side */}
            <div className="lg:col-span-2">
              <p className="text-white/70 text-sm leading-relaxed max-w-lg">
                Universal Council is a leading education consultancy based in Dhaka, Bangladesh, dedicated to guiding international students in pursuing higher education abroad. From free consultation to visa processing, accommodation, and post-arrival support — we are with you every step of the way.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-[hsl(215,50%,10%)] py-5">
        <div className="container px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-white/50 text-sm">
              © {new Date().getFullYear()} Universal Council. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm">
              <Link to="/privacy-policy" className="text-white/50 hover:text-white transition-colors">Privacy Policy</Link>
              <span className="text-white/30">|</span>
              <Link to="/terms-of-service" className="text-white/50 hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
