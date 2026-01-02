import { useState, useRef, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles, GraduationCap, Globe, DollarSign, FileText, MapPin, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  text: string;
  isUser: boolean;
}

export default function AIAdvisor() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: "Hello! I'm your AI Study Abroad Advisor. I have detailed knowledge about studying in the **UK, USA, Canada, Australia, Germany, New Zealand, and South Korea**.\n\nAsk me about:\n• 🎓 Universities & programs\n• 💰 Tuition fees & living costs\n• 📋 Visa requirements & processes\n• 🎯 Scholarships & funding\n• 💼 Work rights & post-study options\n\nWhat would you like to know?", 
      isUser: false 
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const popularQuestions = [
    { icon: MapPin, text: "Tell me about studying in UK" },
    { icon: DollarSign, text: "Which country is cheapest for studying?" },
    { icon: GraduationCap, text: "Best scholarships for Bangladeshi students?" },
    { icon: Globe, text: "Compare Canada vs Australia for PR" },
    { icon: Briefcase, text: "Which country has best work opportunities?" },
    { icon: FileText, text: "How to apply for Germany student visa?" },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInput("");
    setIsLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text
      }));
      
      // Add current message
      conversationHistory.push({ role: "user", content: userMessage });

      const { data, error } = await supabase.functions.invoke("ai-study-advisor", {
        body: { messages: conversationHistory }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { text: data.response, isUser: false }]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast.error("Failed to get response. Please try again.");
      setMessages(prev => [...prev, { 
        text: "I apologize, I'm having trouble connecting right now. Please try again or book a free consultation with our experts for personalized guidance.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    setInput(question);
  };

  const formatMessage = (text: string) => {
    // Convert markdown-style formatting to HTML
    return text
      .split('\n')
      .map((line, i) => {
        // Handle headers
        if (line.startsWith('### ')) {
          return <h4 key={i} className="font-semibold text-primary mt-3 mb-1">{line.replace('### ', '')}</h4>;
        }
        if (line.startsWith('## ')) {
          return <h3 key={i} className="font-bold text-primary mt-3 mb-2">{line.replace('## ', '')}</h3>;
        }
        // Handle bullet points
        if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
          const content = line.replace(/^[•\-\*]\s/, '');
          return <li key={i} className="ml-4 list-disc">{formatInlineStyles(content)}</li>;
        }
        // Handle numbered lists
        if (/^\d+\.\s/.test(line)) {
          return <li key={i} className="ml-4 list-decimal">{formatInlineStyles(line.replace(/^\d+\.\s/, ''))}</li>;
        }
        // Empty lines
        if (!line.trim()) {
          return <br key={i} />;
        }
        // Regular paragraphs
        return <p key={i} className="mb-1">{formatInlineStyles(line)}</p>;
      });
  };

  const formatInlineStyles = (text: string) => {
    // Split by bold markers and reconstruct with styled spans
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => 
      i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
    );
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
              Chat with our AI advisor for detailed, country-specific information on universities, costs, visas, scholarships, and more.
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
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                Available 24/7 • Country-Specific Knowledge • Instant Responses
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[450px] p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((message, idx) => (
                    <div
                      key={idx}
                      className={`flex ${message.isUser ? "justify-end" : "justify-start"} animate-fade-in`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          message.isUser
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-muted text-foreground rounded-bl-sm border"
                        }`}
                      >
                        <div className="text-sm leading-relaxed">
                          {message.isUser ? message.text : formatMessage(message.text)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start animate-fade-in">
                      <div className="bg-muted text-foreground rounded-2xl rounded-bl-sm px-4 py-3 border">
                        <div className="flex gap-1 items-center">
                          <span className="text-sm text-muted-foreground mr-2">Analyzing your question...</span>
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
                    placeholder="Ask about any country, program, visa, or scholarship..."
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
                  Try asking: "What are the costs for studying in Canada?" or "Compare UK vs USA for MBA"
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Need More Personalized Guidance?</h3>
              <p className="text-primary-foreground/90 mb-4">
                Book a free consultation with our expert counselors for tailored advice
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
