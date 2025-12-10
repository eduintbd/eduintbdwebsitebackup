import { Home, FileText, Calendar, Bell, User, MessageSquare, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  const navItems = [
    { id: "overview", label: "Home", icon: Home },
    { id: "ielts", label: "IELTS", icon: GraduationCap },
    { id: "documents", label: "Docs", icon: FileText },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden">
      <nav className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-0 flex-1",
              activeTab === item.id 
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className="text-xs font-medium truncate w-full text-center">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
