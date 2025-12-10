import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Chatbot = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/ai-advisor");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-[280px] right-6 z-50 bg-[#1A1A1A] hover:bg-[#2A2A2A] border-2 border-white/20 text-white rounded-full p-4 transition-all duration-300 hover:scale-110 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_30px_rgba(0,0,0,0.3)] md:block hidden"
      aria-label="Open AI Advisor"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
};
