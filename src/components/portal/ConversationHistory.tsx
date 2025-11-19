import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  message: string;
  sender_type: string;
  sender_email: string;
  created_at: string;
  read_at: string | null;
}

interface ConversationHistoryProps {
  messages: Message[];
  studentId: string;
  studentEmail: string;
  onMessageSent: () => void;
}

export function ConversationHistory({ messages, studentId, studentEmail, onMessageSent }: ConversationHistoryProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      const { error } = await supabase
        .from('student_messages')
        .insert([{
          student_id: studentId,
          message: newMessage,
          sender_type: 'student',
          sender_email: studentEmail
        }]);

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "Your advisor will respond soon.",
      });

      setNewMessage("");
      onMessageSent();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Conversation History
        </CardTitle>
        <CardDescription>Chat with your education advisor</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[300px] pr-4">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No messages yet. Start a conversation with your advisor!
            </p>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg ${
                    msg.sender_type === 'admin'
                      ? 'bg-primary/5 border-l-4 border-primary'
                      : 'bg-muted ml-4'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-medium">
                      {msg.sender_type === 'admin' ? 'Advisor' : 'You'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="space-y-2">
          <Textarea
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="min-h-[100px]"
          />
          <Button
            onClick={sendMessage}
            disabled={isSending || !newMessage.trim()}
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            {isSending ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
