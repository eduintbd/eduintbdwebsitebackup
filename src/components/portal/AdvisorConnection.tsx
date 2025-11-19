import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Mail } from "lucide-react";

interface AdvisorConnectionProps {
  studentPhone: string;
  studentEmail: string;
  studentName: string;
}

export function AdvisorConnection({ studentPhone, studentEmail, studentName }: AdvisorConnectionProps) {
  const openWhatsApp = () => {
    const cleanPhone = studentPhone.replace(/\D/g, '');
    const message = encodeURIComponent(`Hi, I'm ${studentName}. I'd like to discuss my application.`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const openPhone = () => {
    window.open(`tel:${studentPhone}`, '_self');
  };

  const openEmail = () => {
    const subject = encodeURIComponent(`Application Query - ${studentName}`);
    window.open(`mailto:support@eduintbd.com?subject=${subject}`, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Connect with Advisor
        </CardTitle>
        <CardDescription>Get in touch for personalized guidance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={openWhatsApp} variant="outline" className="w-full justify-start gap-2">
          <MessageCircle className="h-4 w-4" />
          Chat on WhatsApp
        </Button>
        
        <Button onClick={openPhone} variant="outline" className="w-full justify-start gap-2">
          <Phone className="h-4 w-4" />
          Call Advisor
        </Button>
        
        <Button onClick={openEmail} variant="outline" className="w-full justify-start gap-2">
          <Mail className="h-4 w-4" />
          Send Email
        </Button>
      </CardContent>
    </Card>
  );
}
