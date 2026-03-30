import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { useMetaPixel } from "@/hooks/use-meta-pixel";
import { Send, MapPin, Phone, Mail, MessageCircle, CheckCircle2 } from "lucide-react";

const studentApplicationSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'\-]+$/, "Name can only contain letters, spaces, hyphens and apostrophes"),
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email is too long"),
  phone: z.string()
    .trim()
    .regex(/^[0-9]{10,15}$/, "Phone must be 10-15 digits without spaces"),
  details: z.string()
    .max(2000, "Details must be less than 2000 characters")
    .optional()
    .or(z.literal("")),
});

export const ContactForm = () => {
  const { language } = useLanguage();
  const t = translations[language].contactForm;
  const { trackLead } = useMetaPixel();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+880",
    destination: "",
    year: "",
    preferred_course: "",
    level: "",
    budget: "",
    reference_source: "",
    referral_id: "",
    details: "",
    website: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (formData.website) {
        console.log("Bot detected - honeypot field filled");
        setIsSubmitting(false);
        return;
      }

      const validatedData = studentApplicationSchema.parse({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        details: formData.details,
      });

      const fullPhone = `${formData.countryCode}${formData.phone}`;

      const { error: dbError } = await supabase
        .from('student_applications')
        .insert([{
          name: validatedData.name,
          email: validatedData.email,
          phone: fullPhone,
          study_destination: formData.destination || null,
          study_year: formData.year || null,
          preferred_course: formData.preferred_course || null,
          level: formData.level || null,
          budget: formData.budget || null,
          reference_source: formData.reference_source === 'referral' && formData.referral_id
            ? `referral:${formData.referral_id}`
            : formData.reference_source || null,
          details: validatedData.details || null,
        }]);

      if (dbError) {
        if (dbError.code === '23505') {
          throw new Error("This email is already registered. Please login or use a different email.");
        }
        throw dbError;
      }

      console.log('Sending welcome email to:', validatedData.email);
      const { error: emailError } = await supabase.functions.invoke('send-confirmation-email', {
        body: {
          name: validatedData.name,
          email: validatedData.email,
          phone: fullPhone,
          studyDestination: formData.destination,
          studyYear: formData.year,
          details: validatedData.details,
        },
      });

      if (emailError) {
        console.error('Email function error:', emailError);
      }

      console.log('Sending admin notification');
      const { error: adminEmailError } = await supabase.functions.invoke('send-admin-notification', {
        body: {
          type: 'signup',
          studentName: validatedData.name,
          studentEmail: validatedData.email,
          studentPhone: fullPhone,
          studyDestination: formData.destination,
          studyYear: formData.year,
          details: validatedData.details,
        },
      });

      if (adminEmailError) {
        console.error('Admin notification error:', adminEmailError);
      }

      trackLead({
        content_name: 'Student Application',
        content_category: formData.destination,
        value: formData.year,
      });

      toast.success("Application submitted successfully! Please log in using the 'Sign up/Log in' button above to access your portal.");

      setFormData({
        name: "", email: "", phone: "", countryCode: "+880",
        destination: "", year: "", preferred_course: "",
        level: "", budget: "", reference_source: "",
        referral_id: "", details: "", website: "",
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || "Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-primary via-[hsl(215,50%,20%)] to-[hsl(215,55%,15%)] relative overflow-hidden" id="contact">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>
      <div className="absolute top-20 right-[10%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 left-[5%] w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px]" />

      <div className="container px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">

            {/* Left side - Info */}
            <div className="lg:col-span-2 text-white space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
                  <span className="text-white/80 text-sm font-semibold tracking-wide uppercase">
                    {language === 'en' ? 'Contact Us' : 'যোগাযোগ'}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
                  {t.title}
                </h2>
                <p className="text-white/70 text-lg leading-relaxed">
                  {t.subtitle}
                </p>
              </div>

              {/* Contact details */}
              <div className="space-y-5">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                    <MapPin className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">{language === 'en' ? 'Visit Our Office' : 'আমাদের অফিসে আসুন'}</p>
                    <p className="text-white/60 text-sm">Flat 3G, House 3G, Road 104<br />Gulshan 2, Dhaka 1212, Bangladesh</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                    <Phone className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">{language === 'en' ? 'Call Us' : 'কল করুন'}</p>
                    <p className="text-white/60 text-sm">+880 1749-614998</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                    <Mail className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">{language === 'en' ? 'Email Us' : 'ইমেইল করুন'}</p>
                    <p className="text-white/60 text-sm">info@universalcouncil.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                    <MessageCircle className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">WhatsApp</p>
                    <a href="https://api.whatsapp.com/send?phone=8801749614998" target="_blank" rel="noopener noreferrer" className="text-secondary text-sm hover:underline">
                      {language === 'en' ? 'Chat with us' : 'আমাদের সাথে চ্যাট করুন'}
                    </a>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3 text-white/70 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span>{language === 'en' ? '98% Visa Success Rate' : '৯৮% ভিসা সফলতার হার'}</span>
                </div>
                <div className="flex items-center gap-3 text-white/70 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span>{language === 'en' ? 'Free Consultation - No Hidden Fees' : 'বিনামূল্যে পরামর্শ - কোনো লুকানো ফি নেই'}</span>
                </div>
                <div className="flex items-center gap-3 text-white/70 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span>{language === 'en' ? 'Response within 24 hours' : '২৪ ঘন্টার মধ্যে প্রতিক্রিয়া'}</span>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Honeypot */}
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-sm font-semibold text-gray-700">{t.name} *</Label>
                      <Input
                        id="name"
                        placeholder={t.namePlaceholder}
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-secondary transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700">{t.email} *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t.emailPlaceholder}
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-secondary transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">{t.phone} *</Label>
                    <div className="flex gap-2">
                      <Select value={formData.countryCode} onValueChange={(value) => setFormData({...formData, countryCode: value})}>
                        <SelectTrigger className="h-12 w-24 rounded-xl border-gray-200 bg-gray-50/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+880">+880</SelectItem>
                          <SelectItem value="+91">+91</SelectItem>
                          <SelectItem value="+1">+1</SelectItem>
                          <SelectItem value="+44">+44</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder={t.phonePlaceholder}
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="h-12 flex-1 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-secondary transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold text-gray-700">{t.destination} *</Label>
                      <Select value={formData.destination} onValueChange={(value) => setFormData({...formData, destination: value})}>
                        <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-gray-50/50">
                          <SelectValue placeholder={t.destinationPlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="australia">{language === 'en' ? 'Australia' : 'অস্ট্রেলিয়া'}</SelectItem>
                          <SelectItem value="canada">{language === 'en' ? 'Canada' : 'কানাডা'}</SelectItem>
                          <SelectItem value="uk">{language === 'en' ? 'United Kingdom' : 'যুক্তরাজ্য'}</SelectItem>
                          <SelectItem value="usa">{language === 'en' ? 'USA' : 'মার্কিন যুক্তরাষ্ট্র'}</SelectItem>
                          <SelectItem value="new-zealand">{language === 'en' ? 'New Zealand' : 'নিউজিল্যান্ড'}</SelectItem>
                          <SelectItem value="south-korea">{language === 'en' ? 'South Korea' : 'দক্ষিণ কোরিয়া'}</SelectItem>
                          <SelectItem value="help">{language === 'en' ? 'Help Me Decide' : 'আমাকে সিদ্ধান্ত নিতে সাহায্য করুন'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold text-gray-700">{t.year} *</Label>
                      <Select value={formData.year} onValueChange={(value) => setFormData({...formData, year: value})}>
                        <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-gray-50/50">
                          <SelectValue placeholder={t.yearPlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2026">2026</SelectItem>
                          <SelectItem value="2027">2027</SelectItem>
                          <SelectItem value="2028">2028</SelectItem>
                          <SelectItem value="2029">2029</SelectItem>
                          <SelectItem value="2030">2030</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold text-gray-700">{language === 'en' ? 'Level' : 'স্তর'}</Label>
                      <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value})}>
                        <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-gray-50/50">
                          <SelectValue placeholder={language === 'en' ? 'Select level' : 'স্তর নির্বাচন করুন'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="undergraduate">{language === 'en' ? 'Undergraduate' : 'স্নাতক'}</SelectItem>
                          <SelectItem value="postgraduate">{language === 'en' ? 'Postgraduate' : 'স্নাতকোত্তর'}</SelectItem>
                          <SelectItem value="phd">{language === 'en' ? 'PhD' : 'পিএইচডি'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold text-gray-700">{language === 'en' ? 'Preferred Course' : 'পছন্দের কোর্স'}</Label>
                      <Input
                        placeholder={language === 'en' ? 'e.g., Computer Science' : 'যেমন, কম্পিউটার বিজ্ঞান'}
                        value={formData.preferred_course}
                        onChange={(e) => setFormData({...formData, preferred_course: e.target.value})}
                        className="h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-secondary transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold text-gray-700">{language === 'en' ? 'Budget' : 'বাজেট'}</Label>
                      <Select value={formData.budget} onValueChange={(value) => setFormData({...formData, budget: value})}>
                        <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-gray-50/50">
                          <SelectValue placeholder={language === 'en' ? 'Select budget' : 'বাজেট নির্বাচন করুন'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-10000">{language === 'en' ? 'Under $10,000' : '$১০,০০০ এর নিচে'}</SelectItem>
                          <SelectItem value="10000-20000">$10,000 - $20,000</SelectItem>
                          <SelectItem value="20000-30000">$20,000 - $30,000</SelectItem>
                          <SelectItem value="30000-50000">$30,000 - $50,000</SelectItem>
                          <SelectItem value="above-50000">{language === 'en' ? 'Above $50,000' : '$৫০,০০০ এর উপরে'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold text-gray-700">{language === 'en' ? 'How did you find us?' : 'আমাদের কিভাবে পেলেন?'}</Label>
                      <Select value={formData.reference_source} onValueChange={(value) => setFormData({...formData, reference_source: value, referral_id: value !== 'referral' ? '' : formData.referral_id})}>
                        <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-gray-50/50">
                          <SelectValue placeholder={language === 'en' ? 'Select source' : 'উৎস নির্বাচন করুন'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="friend">{language === 'en' ? 'Friend' : 'বন্ধু'}</SelectItem>
                          <SelectItem value="referral">{language === 'en' ? 'Referral' : 'রেফারেল'}</SelectItem>
                          <SelectItem value="other">{language === 'en' ? 'Other' : 'অন্যান্য'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {formData.reference_source === 'referral' && (
                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold text-gray-700">{language === 'en' ? 'Referral ID' : 'রেফারেল আইডি'}</Label>
                      <Input
                        placeholder={language === 'en' ? 'Enter referral ID' : 'রেফারেল আইডি লিখুন'}
                        value={formData.referral_id}
                        onChange={(e) => setFormData({...formData, referral_id: e.target.value})}
                        className="h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-secondary transition-all"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold text-gray-700">{t.details}</Label>
                    <Textarea
                      placeholder={t.detailsPlaceholder}
                      maxLength={2000}
                      value={formData.details}
                      onChange={(e) => setFormData({...formData, details: e.target.value})}
                      className="min-h-[100px] rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-secondary resize-none transition-all"
                    />
                  </div>

                  <p className="text-xs text-gray-400">{t.terms}</p>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-secondary hover:bg-secondary/90 text-white font-bold text-base rounded-2xl shadow-lg shadow-secondary/25 hover:shadow-xl hover:shadow-secondary/30 transition-all duration-300 hover:scale-[1.02]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t.submitting}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        {t.submitButton}
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
