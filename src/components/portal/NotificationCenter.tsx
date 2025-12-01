import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Mail, Calendar, FileText, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface NotificationCenterProps {
  messages: any[];
  application: any;
}

export function NotificationCenter({ messages, application }: NotificationCenterProps) {
  const notifications = [
    ...messages.map(msg => ({
      type: "message",
      title: msg.sender_type === "admin" ? "New message from advisor" : "Your message sent",
      description: msg.message.substring(0, 100) + (msg.message.length > 100 ? "..." : ""),
      time: new Date(msg.created_at),
      read: !!msg.read_at,
      icon: Mail,
    })),
    ...(application.session_date ? [{
      type: "session",
      title: "Consultation Scheduled",
      description: `Your consultation is scheduled for ${new Date(application.session_date).toLocaleDateString()}`,
      time: new Date(application.session_date),
      read: true,
      icon: Calendar,
    }] : []),
    ...(application.offer_letter_received ? [{
      type: "offer",
      title: "Offer Letter Received",
      description: "Congratulations! Your offer letter has been received",
      time: new Date(),
      read: true,
      icon: CheckCircle2,
    }] : []),
  ].sort((a, b) => b.time.getTime() - a.time.getTime());

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">{unreadCount}</Badge>
              )}
            </CardTitle>
            <CardDescription>Stay updated with your application progress</CardDescription>
          </div>
          <Button variant="ghost" size="sm">Mark all read</Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border transition-colors ${
                    !notification.read ? "bg-primary/5 border-primary/20" : "bg-card"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`p-2 rounded-lg h-fit ${
                      !notification.read ? "bg-primary/10" : "bg-muted"
                    }`}>
                      <notification.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm">{notification.title}</p>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {notification.time.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
