import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Video, 
  FileText, 
  AlertCircle,
  Plus,
  Clock
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Activity {
  id: string;
  activity_type: string;
  activity_title: string;
  activity_description: string;
  activity_metadata: any;
  created_at: string;
  created_by: string;
}

interface StudentActivityTimelineProps {
  studentId: string;
}

export function StudentActivityTimeline({ studentId }: StudentActivityTimelineProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    activity_type: "note",
    activity_title: "",
    activity_description: ""
  });

  useEffect(() => {
    loadActivities();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('student-activities')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_activities',
          filter: `student_id=eq.${studentId}`
        },
        () => {
          loadActivities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [studentId]);

  const loadActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('student_activities')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (error: any) {
      console.error("Error loading activities:", error);
    }
  };

  const handleAddActivity = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('student_activities')
        .insert([{
          student_id: studentId,
          activity_type: formData.activity_type,
          activity_title: formData.activity_title,
          activity_description: formData.activity_description,
          created_by: user.id
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Activity added successfully",
      });

      setIsDialogOpen(false);
      setFormData({
        activity_type: "note",
        activity_title: "",
        activity_description: ""
      });
      
      loadActivities();
    } catch (error: any) {
      console.error("Error adding activity:", error);
      toast({
        title: "Error",
        description: "Failed to add activity",
        variant: "destructive",
      });
    }
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      call: Phone,
      email: Mail,
      whatsapp: MessageCircle,
      meeting: Video,
      note: FileText,
      status_change: AlertCircle,
      document_upload: FileText
    };
    
    const Icon = icons[type as keyof typeof icons] || FileText;
    return <Icon className="w-5 h-5" />;
  };

  const getActivityColor = (type: string) => {
    const colors = {
      call: "text-blue-500",
      email: "text-purple-500",
      whatsapp: "text-green-500",
      meeting: "text-orange-500",
      note: "text-gray-500",
      status_change: "text-yellow-500",
      document_upload: "text-indigo-500"
    };
    
    return colors[type as keyof typeof colors] || "text-gray-500";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Activity Timeline</CardTitle>
            <CardDescription>Complete history of interactions and updates</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Activity</DialogTitle>
                <DialogDescription>Record a new interaction or update</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="activity_type">Activity Type</Label>
                  <Select value={formData.activity_type} onValueChange={(value) => setFormData({ ...formData, activity_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">Phone Call</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="note">Note</SelectItem>
                      <SelectItem value="status_change">Status Change</SelectItem>
                      <SelectItem value="document_upload">Document Upload</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activity_title">Title</Label>
                  <Input
                    id="activity_title"
                    value={formData.activity_title}
                    onChange={(e) => setFormData({ ...formData, activity_title: e.target.value })}
                    placeholder="Brief description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activity_description">Details</Label>
                  <Textarea
                    id="activity_description"
                    value={formData.activity_description}
                    onChange={(e) => setFormData({ ...formData, activity_description: e.target.value })}
                    placeholder="Full details of the activity..."
                    rows={4}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddActivity}>
                    Add Activity
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No activities recorded yet
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
              
              {activities.map((activity, index) => (
                <div key={activity.id} className="relative flex gap-4 pb-8">
                  <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-background border-2 ${getActivityColor(activity.activity_type)}`}>
                    {getActivityIcon(activity.activity_type)}
                  </div>
                  
                  <div className="flex-1 pt-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{activity.activity_title}</h4>
                        <p className="text-sm text-muted-foreground capitalize">{activity.activity_type.replace('_', ' ')}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatDate(activity.created_at)}
                      </div>
                    </div>
                    {activity.activity_description && (
                      <p className="mt-2 text-sm text-muted-foreground">{activity.activity_description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
