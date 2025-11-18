import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Video, Calendar, Mic, Camera } from "lucide-react";
import { SessionScheduling } from "./SessionScheduling";

interface VideoConsultationProps {
  sessionDate: string | null;
  studyDestination: string;
  studyYear: string;
  meetingLink: string | null;
  onBook: (date: string, time: string) => Promise<void>;
  onReschedule: () => void;
  isLoading: boolean;
}

export function VideoConsultation({
  sessionDate,
  studyDestination,
  studyYear,
  meetingLink,
  onBook,
  onReschedule,
  isLoading,
}: VideoConsultationProps) {
  const [isRescheduling, setIsRescheduling] = useState(false);
  const { toast } = useToast();

  const handleReschedule = () => {
    setIsRescheduling(true);
  };

  const handleJoinCall = () => {
    const whatsappLink = "https://call.whatsapp.com/video/mKP8xCYQCOAht4VSCmGI1L";
    
    toast({
      title: "Opening WhatsApp Video Call",
      description: "Redirecting you to the consultation...",
    });

    window.open(whatsappLink, '_blank');
  };

  const handleRescheduleSubmit = async (date: string, time: string) => {
    await onBook(date, time);
    setIsRescheduling(false);
  };

  if (isRescheduling) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Reschedule Virtual Consultation
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRescheduling(false)}
          >
            Cancel
          </Button>
        </div>
        <SessionScheduling
          currentSessionDate={sessionDate}
          studyDestination={studyDestination}
          studyYear={studyYear}
          onBook={handleRescheduleSubmit}
          isLoading={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Connect with our expert counselors online for personalized guidance
      </p>

      {sessionDate ? (
        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">Session Scheduled</span>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1">Scheduled Time:</p>
                  <p className="text-lg">
                    {new Date(sessionDate).toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Video Call Link:</p>
                  <a 
                    href="https://call.whatsapp.com/video/mKP8xCYQCOAht4VSCmGI1L" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline break-all"
                  >
                    https://call.whatsapp.com/video/mKP8xCYQCOAht4VSCmGI1L
                  </a>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleJoinCall}
                  className="flex-1"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Join WhatsApp Video Call
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReschedule}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Reschedule
                </Button>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4">
                <div className="flex items-center gap-1">
                  <Camera className="w-3 h-3" />
                  WhatsApp required
                </div>
                <div className="flex items-center gap-1">
                  <Mic className="w-3 h-3" />
                  Stable internet required
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <SessionScheduling
          currentSessionDate={sessionDate}
          studyDestination={studyDestination}
          studyYear={studyYear}
          onBook={onBook}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
