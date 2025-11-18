import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { useMetaPixel } from "@/hooks/use-meta-pixel";

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
    details: "",
    website: "", // Honeypot field - bots will fill this, humans won't see it
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Honeypot check - if filled, it's a bot
      if (formData.website) {
        console.log("Bot detected - honeypot field filled");
        // Silently fail for bots - don't give them feedback
        setIsSubmitting(false);
        return;
      }

      // Validate input
      const validatedData = studentApplicationSchema.parse({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        details: formData.details,
      });

      const fullPhone = `${formData.countryCode}${formData.phone}`;
      
      // Save to database
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
          reference_source: formData.reference_source || null,
          details: validatedData.details || null,
        }]);

      if (dbError) {
        if (dbError.code === '23505') {
          throw new Error("This email is already registered. Please login or use a different email.");
        }
        throw dbError;
      }

      // Send welcome email
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
      } else {
        console.log('Confirmation email sent successfully');
      }

      // Send admin notification
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

      // Track Meta Pixel Lead event
      trackLead({
        content_name: 'Student Application',
        content_category: formData.destination,
        value: formData.year,
      });

      toast.success("Application submitted successfully! Please log in using the 'Sign up/Log in' button above to access your portal.");

      setFormData({
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
        details: "",
        website: "", // Reset honeypot field
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast.error(firstError.message);
      } else {
        toast.error(error.message || "Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-background" id="contact">
      <div className="container px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card border-border p-8 md:p-12 rounded-3xl shadow-xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
                {t.title}
              </h2>
              <p className="text-lg text-muted-foreground font-light">
                {t.subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot field - hidden from humans, but bots will fill it */}
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                style={{ 
                  position: 'absolute', 
                  left: '-9999px', 
                  width: '1px', 
                  height: '1px',
                  opacity: 0,
                  pointerEvents: 'none'
                }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground font-medium">{t.name} *</Label>
                  <Input 
                    id="name" 
                    placeholder={t.namePlaceholder}
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="h-12 rounded-xl border-border focus:border-secondary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">{t.email} *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder={t.emailPlaceholder}
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="h-12 rounded-xl border-border focus:border-secondary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground font-medium">{t.phone} *</Label>
                <div className="flex gap-2">
                  <Select value={formData.countryCode} onValueChange={(value) => setFormData({...formData, countryCode: value})}>
                    <SelectTrigger className="h-12 w-24 rounded-xl border-border">
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
                    className="h-12 flex-1 rounded-xl border-border focus:border-secondary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination" className="text-foreground font-medium">{t.destination} *</Label>
                <Select value={formData.destination} onValueChange={(value) => setFormData({...formData, destination: value})}>
                  <SelectTrigger className="h-12 rounded-xl border-border focus:border-secondary">
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

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="year" className="text-foreground font-medium">{t.year} *</Label>
                  <Select value={formData.year} onValueChange={(value) => setFormData({...formData, year: value})}>
                    <SelectTrigger className="h-12 rounded-xl border-border focus:border-secondary">
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

                <div className="space-y-2">
                  <Label htmlFor="level" className="text-foreground font-medium">{language === 'en' ? 'Level' : 'স্তর'}</Label>
                  <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value})}>
                    <SelectTrigger className="h-12 rounded-xl border-border focus:border-secondary">
                      <SelectValue placeholder={language === 'en' ? 'Select level' : 'স্তর নির্বাচন করুন'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="undergraduate">{language === 'en' ? 'Undergraduate' : 'স্নাতক'}</SelectItem>
                      <SelectItem value="postgraduate">{language === 'en' ? 'Postgraduate' : 'স্নাতকোত্তর'}</SelectItem>
                      <SelectItem value="phd">{language === 'en' ? 'PhD' : 'পিএইচডি'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="preferred_course" className="text-foreground font-medium">{language === 'en' ? 'Preferred Course' : 'পছন্দের কোর্স'}</Label>
                  <Input 
                    id="preferred_course" 
                    placeholder={language === 'en' ? 'e.g., Computer Science' : 'যেমন, কম্পিউটার বিজ্ঞান'}
                    value={formData.preferred_course}
                    onChange={(e) => setFormData({...formData, preferred_course: e.target.value})}
                    className="h-12 rounded-xl border-border focus:border-secondary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-foreground font-medium">{language === 'en' ? 'Budget' : 'বাজেট'}</Label>
                  <Select value={formData.budget} onValueChange={(value) => setFormData({...formData, budget: value})}>
                    <SelectTrigger className="h-12 rounded-xl border-border focus:border-secondary">
                      <SelectValue placeholder={language === 'en' ? 'Select budget range' : 'বাজেট পরিসীমা নির্বাচন করুন'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-10000">{language === 'en' ? 'Under $10,000' : '$১০,০০০ এর নিচে'}</SelectItem>
                      <SelectItem value="10000-20000">{language === 'en' ? '$10,000 - $20,000' : '$১০,০০০ - $২০,০০০'}</SelectItem>
                      <SelectItem value="20000-30000">{language === 'en' ? '$20,000 - $30,000' : '$২০,০০০ - $৩০,০০০'}</SelectItem>
                      <SelectItem value="30000-50000">{language === 'en' ? '$30,000 - $50,000' : '$৩০,০০০ - $৫০,০০০'}</SelectItem>
                      <SelectItem value="above-50000">{language === 'en' ? 'Above $50,000' : '$৫০,০০০ এর উপরে'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reference_source" className="text-foreground font-medium">{language === 'en' ? 'How did you hear about us?' : 'আপনি আমাদের সম্পর্কে কীভাবে জানলেন?'}</Label>
                <Select value={formData.reference_source} onValueChange={(value) => setFormData({...formData, reference_source: value})}>
                  <SelectTrigger className="h-12 rounded-xl border-border focus:border-secondary">
                    <SelectValue placeholder={language === 'en' ? 'Select source' : 'উৎস নির্বাচন করুন'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facebook">{language === 'en' ? 'Facebook' : 'ফেসবুক'}</SelectItem>
                    <SelectItem value="whatsapp">{language === 'en' ? 'WhatsApp' : 'হোয়াটসঅ্যাপ'}</SelectItem>
                    <SelectItem value="friend">{language === 'en' ? 'Friend' : 'বন্ধু'}</SelectItem>
                    <SelectItem value="other">{language === 'en' ? 'Other' : 'অন্যান্য'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="details" className="text-foreground font-medium">
                  {t.details}
                </Label>
                <Textarea
                  id="details"
                  placeholder={t.detailsPlaceholder}
                  maxLength={2000}
                  value={formData.details}
                  onChange={(e) => setFormData({...formData, details: e.target.value})}
                  className="min-h-[120px] rounded-xl border-border focus:border-secondary resize-none"
                />
              </div>

              <div className="text-sm text-muted-foreground">
                {t.terms} *
              </div>

              <Button 
                type="submit" 
                size="lg"
                disabled={isSubmitting}
                className="w-full h-14 bg-secondary hover:bg-secondary/90 text-primary font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isSubmitting ? t.submitting : t.submitButton}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};
