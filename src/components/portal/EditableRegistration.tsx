import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Edit2, Save, X } from "lucide-react";

interface EditableRegistrationProps {
  application: any;
  onUpdate: () => void;
}

export function EditableRegistration({ application, onUpdate }: EditableRegistrationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: application.name || "",
    phone: application.phone || "",
    study_destination: application.study_destination || "",
    study_year: application.study_year || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('student_applications')
        .update({
          name: formData.name,
          phone: formData.phone,
          study_destination: formData.study_destination,
          study_year: formData.study_year,
        })
        .eq('email', application.email);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Registration information updated successfully!",
      });
      setIsEditing(false);
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: application.name || "",
      phone: application.phone || "",
      study_destination: application.study_destination || "",
      study_year: application.study_year || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Registration</h3>
        {!isEditing ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        Student details and basic registration information
      </p>

      <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
        <div>
          <Label className="text-muted-foreground">Full Name</Label>
          {isEditing ? (
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1"
            />
          ) : (
            <p className="font-medium mt-1">{application.name}</p>
          )}
        </div>
        <div>
          <Label className="text-muted-foreground">Email</Label>
          <p className="font-medium mt-1">{application.email}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Phone</Label>
          {isEditing ? (
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1"
            />
          ) : (
            <p className="font-medium mt-1">{application.phone}</p>
          )}
        </div>
        <div>
          <Label className="text-muted-foreground">Application Date</Label>
          <p className="font-medium mt-1">
            {new Date(application.created_at).toLocaleDateString()}
          </p>
        </div>
        <div>
          <Label className="text-muted-foreground">
            Study Destination <span className="text-destructive">*</span>
          </Label>
          {isEditing ? (
            <Input
              value={formData.study_destination}
              onChange={(e) =>
                setFormData({ ...formData, study_destination: e.target.value })
              }
              className="mt-1"
            />
          ) : (
            <p className="font-medium mt-1">
              {application.study_destination || "Not specified"}
            </p>
          )}
        </div>
        <div>
          <Label className="text-muted-foreground">
            Study Abroad Year <span className="text-destructive">*</span>
          </Label>
          {isEditing ? (
            <Input
              value={formData.study_year}
              onChange={(e) =>
                setFormData({ ...formData, study_year: e.target.value })
              }
              className="mt-1"
            />
          ) : (
            <p className="font-medium mt-1">
              {application.study_year || "Not specified"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
