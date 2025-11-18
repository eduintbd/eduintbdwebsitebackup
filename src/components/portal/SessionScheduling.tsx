import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMetaPixel } from "@/hooks/use-meta-pixel";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock, Video } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface SessionSchedulingProps {
  currentSessionDate?: string | null;
  studyDestination?: string | null;
  studyYear?: string | null;
  onBook: (date: string, time: string) => Promise<void>;
  isLoading?: boolean;
}

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
  "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM"
];

export function SessionScheduling({ 
  currentSessionDate, 
  studyDestination, 
  studyYear, 
  onBook,
  isLoading = false 
}: SessionSchedulingProps) {
  const { trackSchedule } = useMetaPixel();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    currentSessionDate ? new Date(currentSessionDate) : undefined
  );
  const [selectedTime, setSelectedTime] = useState<string>("");

  const handleBookSession = async () => {
    if (!selectedDate || !selectedTime) return;
    
    const isoDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      parseInt(selectedTime.split(':')[0]) + (selectedTime.includes('PM') && !selectedTime.startsWith('12') ? 12 : 0),
      parseInt(selectedTime.split(':')[1])
    ).toISOString();
    
    // Track Meta Pixel Schedule event
    trackSchedule({
      content_name: 'Virtual Consultation',
      content_category: studyDestination,
      value: studyYear,
    });
    
    await onBook(isoDateTime, selectedTime);
    setSelectedDate(undefined);
    setSelectedTime("");
  };

  const hasRequiredFields = studyDestination && studyYear;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Video className="h-5 w-5 text-primary" />
          <CardTitle>Schedule Virtual Consultation</CardTitle>
        </div>
        <CardDescription>
          Book a one-on-one session with our expert education counselors
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!hasRequiredFields && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <p className="text-sm text-warning-foreground">
              <strong>Required:</strong> Please complete your study destination and study year in the Basic Information section before booking a session.
            </p>
          </div>
        )}

        {currentSessionDate && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm font-medium text-primary mb-1">Current Session Scheduled</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(currentSessionDate), "EEEE, MMMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Select Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                  disabled={!hasRequiredFields || isLoading}
                >
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Select Time
            </Label>
            <Select 
              value={selectedTime} 
              onValueChange={setSelectedTime}
              disabled={!selectedDate || !hasRequiredFields || isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-secondary/10 rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-sm">What to Expect:</h4>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>30-minute personalized consultation session</li>
            <li>Expert guidance on university selection</li>
            <li>Application strategy and timeline discussion</li>
            <li>Q&A about visa and scholarship opportunities</li>
          </ul>
        </div>

        <Button 
          onClick={handleBookSession}
          disabled={!selectedDate || !selectedTime || !hasRequiredFields || isLoading}
          className="w-full"
        >
          {isLoading ? "Booking..." : currentSessionDate ? "Reschedule Session" : "Book Session"}
        </Button>
      </CardContent>
    </Card>
  );
}
