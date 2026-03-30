import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  MessageCircle, 
  Mail, 
  Facebook, 
  Send
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StudentCommunication } from "@/components/admin/StudentCommunication";

interface CommunicationCenterProps {
  studentId: string;
  studentEmail: string;
  studentPhone: string;
  studentName: string;
  isAdmin?: boolean;
}

export function CommunicationCenter({
  studentId,
  studentEmail,
  studentPhone,
  studentName,
  isAdmin = false
}: CommunicationCenterProps) {
  const [channels, setChannels] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadChannels();
  }, [studentId]);

  const loadChannels = async () => {
    try {
      const { data, error } = await supabase
        .from('communication_channels')
        .select('*')
        .eq('student_id', studentId);

      if (error) throw error;
      setChannels(data || []);
    } catch (error: any) {
      console.error("Error loading channels:", error);
    }
  };

  const openWhatsApp = async () => {
    const cleanPhone = studentPhone.replace(/\D/g, '');
    const message = encodeURIComponent(`Hi ${studentName}, this is Universal Council. How can we assist you today?`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
    
    // Log activity
    if (isAdmin) {
      await logActivity('whatsapp', 'WhatsApp Message Sent', `Opened WhatsApp chat with ${studentName}`);
    }
  };

  const openZohoMail = async () => {
    const subject = encodeURIComponent(`Universal Council - Your Study Abroad Application`);
    const body = encodeURIComponent(`Dear ${studentName},\n\nThank you for choosing Universal Council for your study abroad journey.\n\nBest regards,\nUniversal Council Team\nsupport@universalcouncil.com\nWhatsApp: +880 1749-614998`);
    window.open(`mailto:${studentEmail}?subject=${subject}&body=${body}`, '_blank');
    
    // Log activity
    if (isAdmin) {
      await logActivity('email', 'Email Sent', `Opened email client to send message to ${studentName}`);
    }
  };

  const openFacebook = async () => {
    window.open(`https://www.facebook.com/share/1E1eN62AQw/`, '_blank');
    
    // Log activity
    if (isAdmin) {
      await logActivity('note', 'Facebook Message', `Opened Facebook Messenger for ${studentName}`);
    }
    
    toast({
      title: "Facebook Messenger",
      description: "Opening Facebook Messenger. Please search for the student's name to continue the conversation.",
    });
  };

  const openMessenger = async () => {
    window.open(`https://www.messenger.com/`, '_blank');
    
    // Log activity
    if (isAdmin) {
      await logActivity('note', 'Messenger', `Opened Messenger for ${studentName}`);
    }
    
    toast({
      title: "Messenger",
      description: "Opening Messenger. Please search for the student's name to continue the conversation.",
    });
  };

  const logActivity = async (type: string, title: string, description: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('student_activities')
        .insert([{
          student_id: studentId,
          activity_type: type,
          activity_title: title,
          activity_description: description,
          created_by: user.id
        }]);
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };

  const isChannelActive = (channelType: string) => {
    return channels.some(ch => ch.channel_type === channelType && ch.is_active);
  };

  return (
    <div className="space-y-6">
      {/* Communication Channels - Only visible for admins */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Communication Channels</CardTitle>
            <CardDescription>Choose your preferred communication method</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* WhatsApp */}
              <Card className="border-green-500/20 hover:border-green-500/40 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">WhatsApp</h4>
                        <p className="text-xs text-muted-foreground">Two-way messaging</p>
                      </div>
                    </div>
                    {isChannelActive('whatsapp') && (
                      <Badge variant="secondary" className="bg-green-500/20 text-green-700">
                        Active
                      </Badge>
                    )}
                  </div>
                  <Button 
                    onClick={openWhatsApp} 
                    className="w-full bg-green-500 hover:bg-green-600"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Open WhatsApp
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    {studentPhone}
                  </p>
                </CardContent>
              </Card>

              {/* Zoho Mail */}
              <Card className="border-blue-500/20 hover:border-blue-500/40 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Zoho Mail</h4>
                        <p className="text-xs text-muted-foreground">Email communication</p>
                      </div>
                    </div>
                    {isChannelActive('zoho_mail') && (
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-700">
                        Active
                      </Badge>
                    )}
                  </div>
                  <Button 
                    onClick={openZohoMail} 
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 truncate">
                    {studentEmail}
                  </p>
                </CardContent>
              </Card>

              {/* Facebook */}
              <Card className="border-[#1877F2]/20 hover:border-[#1877F2]/40 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center">
                        <Facebook className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Facebook</h4>
                        <p className="text-xs text-muted-foreground">Social messaging</p>
                      </div>
                    </div>
                    {isChannelActive('facebook') && (
                      <Badge variant="secondary" className="bg-[#1877F2]/20 text-[#1877F2]">
                        Active
                      </Badge>
                    )}
                  </div>
                  <Button 
                    onClick={openFacebook} 
                    className="w-full"
                    style={{ backgroundColor: '#1877F2' }}
                  >
                    <Facebook className="w-4 h-4 mr-2" />
                    Open Facebook
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    via Facebook Messages
                  </p>
                </CardContent>
              </Card>

              {/* Messenger */}
              <Card className="border-purple-500/20 hover:border-purple-500/40 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Send className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Messenger</h4>
                        <p className="text-xs text-muted-foreground">Direct messaging</p>
                      </div>
                    </div>
                    {isChannelActive('messenger') && (
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-700">
                        Active
                      </Badge>
                    )}
                  </div>
                  <Button 
                    onClick={openMessenger} 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Open Messenger
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    via Messenger app
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      {/* In-Platform Messages */}
      <Card>
        <CardHeader>
          <CardTitle>In-Platform Messages</CardTitle>
          <CardDescription>Direct communication within the portal</CardDescription>
        </CardHeader>
        <CardContent>
          <StudentCommunication
            studentId={studentId}
            studentEmail={studentEmail}
            isAdmin={isAdmin}
          />
        </CardContent>
      </Card>
    </div>
  );
}
