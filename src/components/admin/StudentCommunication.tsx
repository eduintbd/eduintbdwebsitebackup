import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  sender_email: string;
  sender_type: 'student' | 'admin';
  message: string;
  created_at: string;
  read_at: string | null;
}

interface StudentCommunicationProps {
  studentId: string;
  studentEmail: string;
  isAdmin?: boolean;
}

export function StudentCommunication({ studentId, studentEmail, isAdmin = false }: StudentCommunicationProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
    getCurrentUser();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('student-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_messages',
          filter: `student_id=eq.${studentId}`
        },
        () => {
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [studentId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      setCurrentUserEmail(user.email);
    }
  };

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('student_messages')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    setMessages((data || []) as Message[]);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      console.log('Attempting to send message...', { studentId, isAdmin, messageLength: newMessage.length });
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      console.log('Auth check:', { user: user?.email, authError });
      
      if (authError || !user?.email) {
        console.error('Authentication error:', authError);
        toast({
          title: "Authentication Error",
          description: "You must be logged in to send messages. Please refresh the page.",
          variant: "destructive",
        });
        setSending(false);
        return;
      }

      const messageData = {
        student_id: studentId,
        sender_email: user.email,
        sender_type: isAdmin ? 'admin' : 'student',
        message: newMessage.trim(),
      };
      
      console.log('Sending message with data:', messageData);

      const { data, error } = await supabase
        .from('student_messages')
        .insert(messageData)
        .select();

      console.log('Insert result:', { data, error });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      // Log activity for admin messages
      if (isAdmin && user.id) {
        await supabase
          .from('student_activities')
          .insert([{
            student_id: studentId,
            activity_type: 'note',
            activity_title: 'Internal Message Sent',
            activity_description: newMessage.trim().substring(0, 100) + (newMessage.length > 100 ? '...' : ''),
            created_by: user.id
          }]);
      }

      setNewMessage("");
      
      toast({
        title: "Message sent",
        description: "Your message has been delivered.",
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + 
           date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="flex flex-col h-[600px] w-full">
      {/* Header */}
      <div className="border-b p-4 flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <div>
          <h3 className="font-semibold">Communication</h3>
          <p className="text-sm text-muted-foreground">
            {isAdmin ? `Chat with ${studentEmail}` : 'Chat with your counselor'}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No messages yet. Start a conversation!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwnMessage = msg.sender_email === currentUserEmail;
              const isAdminMessage = msg.sender_type === 'admin';

              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        isOwnMessage
                          ? 'bg-primary text-primary-foreground'
                          : isAdminMessage
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{isAdminMessage ? 'Admin' : 'Student'}</span>
                      <span>•</span>
                      <span>{formatTime(msg.created_at)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[80px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={sending || !newMessage.trim()}
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </Card>
  );
}
