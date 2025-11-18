import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hello! I'm your AI study abroad advisor. I can help you with universities, programs, scholarships, visa requirements, and more. What would you like to know?", isUser: false },
  ]);
  const [inputValue, setInputValue] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setMessages([...messages, { text: userMessage, isUser: true }]);
    setInputValue("");

    // AI-powered response with context awareness
    setTimeout(() => {
      const responses: { [key: string]: string } = {
        budget: "For budget-conscious students, countries like Germany (free public universities), Canada (affordable with work options), and Australia (good ROI) are excellent choices. Would you like detailed cost breakdowns?",
        scholarship: "We have access to 500+ scholarships! Popular ones include Chevening (UK), DAAD (Germany), Australia Awards, and Erasmus+ (Europe). What's your field of study?",
        application: "Typical timeline: 6-12 months. Start researching 12 months before, apply 6-9 months before intake, visa processing 2-3 months. Need help creating your timeline?",
        work: "Most countries allow 20 hours/week during studies: UK, Canada, Australia, Germany all permit part-time work. Post-study work visas range from 1-3 years depending on the country.",
        visa: "Visa requirements vary by country. Generally you'll need: admission letter, financial proof, English test scores, and health insurance. Would you like specific requirements for a particular country?",
        ielts: "IELTS requirements typically range from 6.0-7.5 depending on the program and university. We offer free IELTS preparation resources! Which section do you need help with?",
        default: "That's a great question! I can help you with universities, programs, costs, scholarships, visa requirements, and more. For personalized guidance, would you like to book a free consultation with our expert counselors?"
      };

      let response = responses.default;
      const lowerInput = userMessage.toLowerCase();
      
      if (lowerInput.includes("budget") || lowerInput.includes("cost") || lowerInput.includes("cheap") || lowerInput.includes("affordable")) {
        response = responses.budget;
      } else if (lowerInput.includes("scholarship") || lowerInput.includes("funding") || lowerInput.includes("financial aid")) {
        response = responses.scholarship;
      } else if (lowerInput.includes("how long") || lowerInput.includes("timeline") || lowerInput.includes("process") || lowerInput.includes("application")) {
        response = responses.application;
      } else if (lowerInput.includes("work") || lowerInput.includes("job") || lowerInput.includes("part-time") || lowerInput.includes("employment")) {
        response = responses.work;
      } else if (lowerInput.includes("visa") || lowerInput.includes("immigration") || lowerInput.includes("permit")) {
        response = responses.visa;
      } else if (lowerInput.includes("ielts") || lowerInput.includes("toefl") || lowerInput.includes("english test")) {
        response = responses.ielts;
      }

      setMessages((prev) => [
        ...prev,
        {
          text: response,
          isUser: false,
        },
      ]);
    }, 1500);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-[280px] right-6 z-50 bg-[#1A1A1A] hover:bg-[#2A2A2A] border-2 border-white/20 text-white rounded-full p-4 transition-all duration-300 hover:scale-110 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_30px_rgba(0,0,0,0.3)] md:block hidden"
        aria-label="Open chat"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div ref={chatRef} className="fixed bottom-24 right-6 z-50 w-80 md:w-96 h-[500px] bg-card rounded-2xl shadow-elegant border border-border flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 rounded-t-2xl">
            <h3 className="font-semibold text-lg">Chat with us</h3>
            <p className="text-xs opacity-90">We typically reply in a few minutes</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    message.isUser
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-card">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                size="icon"
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
