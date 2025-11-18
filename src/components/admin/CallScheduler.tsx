import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, User, Mail, Video, ExternalLink, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScheduledCall {
  id: string;
  name: string;
  email: string;
  phone: string;
  session_date: string;
  meeting_link: string | null;
  study_destination: string;
  study_year: string;
}

export function CallScheduler() {
  const [calls, setCalls] = useState<ScheduledCall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadScheduledCalls();
  }, []);

  const loadScheduledCalls = async () => {
    try {
      const { data, error } = await supabase
        .from('student_applications')
        .select('*')
        .eq('session_booked', true)
        .order('session_date', { ascending: true });

      if (error) throw error;
      setCalls(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load scheduled calls.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard!",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  const groupedCalls = calls.reduce((acc, call) => {
    const dateKey = formatDate(call.session_date);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(call);
    return acc;
  }, {} as Record<string, ScheduledCall[]>);

  if (isLoading) {
    return <div>Loading calendar...</div>;
  }

  return (
    <div className="space-y-6">
      {Object.keys(groupedCalls).length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No scheduled consultations found.</p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedCalls).map(([date, dateCalls]) => (
          <Card key={date}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {date}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dateCalls.map((call) => (
                <div
                  key={call.id}
                  className={`p-4 rounded-lg border ${
                    call.meeting_link
                      ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
                      : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{formatTime(call.session_date)}</span>
                        {isUpcoming(call.session_date) ? (
                          <Badge variant="default">Upcoming</Badge>
                        ) : (
                          <Badge variant="secondary">Past</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{call.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{call.email}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2"
                          onClick={() => copyToClipboard(call.email)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        {call.study_destination} • {call.study_year}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {call.meeting_link ? (
                        <>
                          <Badge variant="default" className="bg-green-500">
                            <Video className="h-3 w-3 mr-1" />
                            Link Added
                          </Badge>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(call.meeting_link!)}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(call.meeting_link!, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Open
                            </Button>
                          </div>
                        </>
                      ) : (
                        <Badge variant="secondary" className="bg-amber-500">
                          <Clock className="h-3 w-3 mr-1" />
                          Needs Link
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}