import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles, GraduationCap, Globe, DollarSign, FileText } from "lucide-react";

export default function AIAdvisor() {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { 
      text: "Hello! I'm your AI study abroad advisor. I can help you with universities, programs, scholarships, visa requirements, and more. What would you like to know?", 
      isUser: false 
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const popularQuestions = [
    { icon: DollarSign, text: "Which country is best for my budget?" },
    { icon: GraduationCap, text: "What are scholarship opportunities?" },
    { icon: FileText, text: "How long is the application process?" },
    { icon: Globe, text: "Can I work while studying?" },
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: { [key: string]: string } = {
        "budget": "For budget-conscious students, countries like Germany (free public universities), Canada (affordable with work options), and Australia (good ROI) are excellent choices. Would you like detailed cost breakdowns?",
        "scholarship": "We have access to 500+ scholarships! Popular ones include Chevening (UK), DAAD (Germany), Australia Awards, and Erasmus+ (Europe). What's your field of study?",
        "application": "Typical timeline: 6-12 months. Start researching 12 months before, apply 6-9 months before intake, visa processing 2-3 months. Need help creating your timeline?",
        "work": "Most countries allow 20 hours/week during studies: UK, Canada, Australia, Germany all permit part-time work. Post-study work visas range from 1-3 years depending on the country.",
        "default": "That's a great question! Our counselors can provide detailed guidance. For personalized advice, I recommend booking a free consultation. Would you like me to help you with specific countries or programs?"
      };

      let response = responses.default;
      const lowerInput = userMessage.toLowerCase();
      
      if (lowerInput.includes("budget") || lowerInput.includes("cost") || lowerInput.includes("cheap")) {
        response = responses.budget;
      } else if (lowerInput.includes("scholarship") || lowerInput.includes("funding")) {
        response = responses.scholarship;
      } else if (lowerInput.includes("how long") || lowerInput.includes("timeline") || lowerInput.includes("process")) {
        response = responses.application;
      } else if (lowerInput.includes("work") || lowerInput.includes("job") || lowerInput.includes("part-time")) {
        response = responses.work;
      }

      setMessages(prev => [...prev, { text: response, isUser: false }]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuestionClick = (question: string) => {
    setInput(question);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Guidance</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
              Get Instant Study Abroad Advice
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Chat with our AI-powered study abroad advisor to get personalized recommendations on universities, programs, scholarships, and visa requirements.
            </p>
          </div>

          {/* Popular Questions */}
          <Card className="border-2 animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Popular Questions
              </CardTitle>
              <CardDescription>Click on any question to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {popularQuestions.map((q, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="justify-start h-auto py-3 px-4 text-left hover:border-primary hover:bg-primary/5"
                    onClick={() => handleQuestionClick(q.text)}
                  >
                    <q.icon className="w-4 h-4 mr-3 flex-shrink-0 text-primary" />
                    <span className="text-sm">{q.text}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="border-2 shadow-xl animate-slide-up">
            <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                AI Study Advisor
              </CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Available 24/7 • Instant Responses
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {messages.map((message, idx) => (
                    <div
                      key={idx}
                      className={`flex ${message.isUser ? "justify-end" : "justify-start"} animate-fade-in`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.isUser
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-muted text-foreground rounded-bl-sm border"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start animate-fade-in">
                      <div className="bg-muted text-foreground rounded-2xl rounded-bl-sm px-4 py-3 border">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t bg-card">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask me anything about studying abroad..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSend}
                    size="icon"
                    disabled={isLoading || !input.trim()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  For personalized consultation, book a free session with our experts
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Need More Personalized Guidance?</h3>
              <p className="text-primary-foreground/90 mb-4">
                Book a free consultation with our expert counselors
              </p>
              <Button variant="secondary" size="lg" asChild>
                <a href="/#consultation">Book Free Consultation</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function MessageCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}
