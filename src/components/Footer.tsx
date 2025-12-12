import { Facebook, MessageCircle, Instagram, Linkedin, Mail, Phone, MapPin, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-primary text-white py-16">
      <div className="container px-6">
        <div className="grid md:grid-cols-5 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-2xl font-display font-bold text-secondary">
              Education International
            </h3>
            <p className="text-white/80 text-sm leading-relaxed max-w-sm">
              Your trusted partner for international education. We're here to support you on your study abroad journey.
            </p>
            <div>
              <h5 className="text-sm font-semibold text-secondary mb-3">Let's get social</h5>
              <div className="flex gap-3">
                <a href="https://www.facebook.com/profile.php?id=61578321455931" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/company/go-abroad-bd" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/eduint_bd?igsh=MXd4N3hpOGcyOHlpOQ%3D%3D" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-secondary transition-colors" aria-label="YouTube">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="https://api.whatsapp.com/send?phone=8801898934855" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="WhatsApp">
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-secondary">Our Services</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-white/80 hover:text-secondary transition-colors text-sm hover:underline text-left"
                >
                  Education Counselling
                </button>
              </li>
              <li><Link to="/admission" className="text-white/80 hover:text-secondary transition-colors text-sm hover:underline">Application Process</Link></li>
              <li><Link to="/visa" className="text-white/80 hover:text-secondary transition-colors text-sm hover:underline">Visa Documentation</Link></li>
              <li><Link to="/scholarship" className="text-white/80 hover:text-secondary transition-colors text-sm hover:underline">Scholarship Guidance</Link></li>
            </ul>
          </div>

          {/* Study Destinations */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-secondary">Study Destinations</h4>
            <ul className="space-y-2">
              <li><Link to="/study-australia" className="text-white/80 hover:text-secondary transition-colors text-sm hover:underline">Study In Australia</Link></li>
              <li><Link to="/study-canada" className="text-white/80 hover:text-secondary transition-colors text-sm hover:underline">Study In Canada</Link></li>
              <li><Link to="/study-uk" className="text-white/80 hover:text-secondary transition-colors text-sm hover:underline">Study In UK</Link></li>
              <li><Link to="/study-usa" className="text-white/80 hover:text-secondary transition-colors text-sm hover:underline">Study In USA</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-secondary">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/80 text-sm">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>264 Elephant Road, Bata Signal, Dhaka 1205</span>
              </li>
              <li className="flex items-center gap-3 text-white/80 text-sm">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a href="tel:+8801898934855" className="hover:text-secondary transition-colors">+880 1898934855</a>
              </li>
              <li className="flex items-center gap-3 text-white/80 text-sm">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a href="mailto:info@eduintbd.com" className="hover:text-secondary transition-colors">info@eduintbd.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              © {new Date().getFullYear()} Education International. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm">
              <Link to="/privacy-policy" className="text-white/60 hover:text-secondary transition-colors">Privacy Policy</Link>
              <span className="text-white/40">|</span>
              <Link to="/terms-of-service" className="text-white/60 hover:text-secondary transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
