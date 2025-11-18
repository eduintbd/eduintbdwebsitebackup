import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

const testimonials = [
  {
    name: "Ayesha R.",
    username: "@aysha_rahman",
    text: "Choosing Eduintbd educational consultant in Dhaka was the best decision for my academic journey. The education consultancy in Dhaka guided me through every step, from finding the right universities to securing my student visa. Their overseas education consultant Dhaka team helped me successfully apply to study in the UK from Bangladesh and offered excellent SOP writing help Bangladesh that made my application stand out. I also received thorough IELTS preparation support and interview preparation for student visa, which boosted my confidence. Highly recommend their study abroad agency Bangladesh for anyone considering higher education overseas!",
    rating: 5,
  },
  {
    name: "Imran H.",
    username: "@hossain_imran",
    text: "With the help of Eduintbd, my dream to study in Canada from Bangladesh became a reality. The team provided invaluable university application assistance and guided me throughout the student visa process for UK and Canada. They also helped me find the best education loan for study abroad in USA and informed me about available scholarship for Bangladeshi students. I appreciate their continued support, especially in finding suitable accommodation for students abroad. If you want reliable guidance, this study abroad consultant in Dhaka is your go-to!",
    rating: 5,
  },
  {
    name: "Tithi Moni",
    username: "@tithibala",
    text: "Thanks to a dedicated study abroad agency Bangladesh, the process to study in Australia from Bangladesh was smooth and stress-free. Their expert student visa consultant Dhaka prepared me for my interviews and assisted with every detail, from SOP writing help Bangladesh to securing university application assistance. They offered personalized IELTS preparation support and helped me explore scholarship for Bangladeshi students. The team even helped arrange comfortable accommodation for students abroad, ensuring I felt at home in Australia.",
    rating: 5,
  },
  {
    name: "Al-hasan",
    username: "@alhasanbrma",
    text: "Overwhelmed before, but their knowledgeable consultants helped me get into Brunel University with transparency and care.",
    rating: 5,
  },
];

export const Testimonials = () => {
  const { language } = useLanguage();
  const t = translations[language].testimonials;

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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.name}
              className="bg-card border-border p-6 rounded-2xl hover:shadow-xl transition-all duration-500 animate-scale-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground mb-6 leading-relaxed text-sm">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div>
                <div className="font-semibold text-foreground">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">{testimonial.username}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
