import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save } from "lucide-react";

interface CustomField {
  id: string;
  field_name: string;
  field_label: string;
  field_type: string;
  field_options?: any;
  is_required: boolean;
  is_visible_to_student: boolean;
  is_editable_by_student: boolean;
  field_category: string;
}

interface FieldValue {
  field_id: string;
  field_value: string;
}

interface StudentCustomFieldsProps {
  studentId: string;
  isAdmin?: boolean;
}

export function StudentCustomFields({ studentId, isAdmin = false }: StudentCustomFieldsProps) {
  const [fields, setFields] = useState<CustomField[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [currentLifecycleStage, setCurrentLifecycleStage] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    loadFieldsAndValues();
  }, [studentId]);

  const loadFieldsAndValues = async () => {
    try {
      // Load student's current lifecycle stage
      const { data: studentData, error: studentError } = await supabase
        .from('student_applications')
        .select('lifecycle_stage')
        .eq('id', studentId)
        .single();

      if (studentError) throw studentError;
      setCurrentLifecycleStage(studentData?.lifecycle_stage || "");

      // Load field definitions
      const fieldsQuery = supabase
        .from('custom_fields')
        .select('*')
        .order('display_order', { ascending: true });

      if (!isAdmin) {
        fieldsQuery.eq('is_visible_to_student', true);
      }

      const { data: fieldsData, error: fieldsError } = await fieldsQuery;
      if (fieldsError) throw fieldsError;

      setFields(fieldsData || []);

      // Load field values
      const { data: valuesData, error: valuesError } = await supabase
        .from('student_field_values')
        .select('*')
        .eq('student_id', studentId);

      if (valuesError) throw valuesError;

      const valuesMap: Record<string, string> = {};
      valuesData?.forEach((v: FieldValue) => {
        valuesMap[v.field_id] = v.field_value;
      });
      setValues(valuesMap);
    } catch (error: any) {
      console.error("Error loading fields:", error);
      toast({
        title: "Error",
        description: "Failed to load custom fields",
        variant: "destructive",
      });
    }
  };

  const handleSaveField = async (fieldId: string, value: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('student_field_values')
        .upsert({
          student_id: studentId,
          field_id: fieldId,
          field_value: value,
          updated_by: user.id
        }, {
          onConflict: 'student_id,field_id'
        });

      if (error) throw error;

      setValues(prev => ({ ...prev, [fieldId]: value }));

      toast({
        title: "Success",
        description: "Field updated successfully",
      });
    } catch (error: any) {
      console.error("Error saving field:", error);
      toast({
        title: "Error",
        description: "Failed to save field",
        variant: "destructive",
      });
    }
  };

  const renderField = (field: CustomField) => {
    const value = values[field.id] || "";
    const canEdit = isAdmin || field.is_editable_by_student;

    switch (field.field_type) {
      case 'text':
        return (
          <Input
            value={value}
            onChange={(e) => setValues(prev => ({ ...prev, [field.id]: e.target.value }))}
            onBlur={() => handleSaveField(field.id, value)}
            disabled={!canEdit}
          />
        );
      
      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => setValues(prev => ({ ...prev, [field.id]: e.target.value }))}
            onBlur={() => handleSaveField(field.id, value)}
            disabled={!canEdit}
          />
        );
      
      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => setValues(prev => ({ ...prev, [field.id]: e.target.value }))}
            onBlur={() => handleSaveField(field.id, value)}
            disabled={!canEdit}
          />
        );
      
      case 'select':
        return (
          <Select
            value={value}
            onValueChange={(v) => {
              setValues(prev => ({ ...prev, [field.id]: v }));
              handleSaveField(field.id, v);
            }}
            disabled={!canEdit}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.field_options?.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => setValues(prev => ({ ...prev, [field.id]: e.target.value }))}
            onBlur={() => handleSaveField(field.id, value)}
            disabled={!canEdit}
            rows={3}
          />
        );
      
      case 'boolean':
        return (
          <Switch
            checked={value === 'true'}
            onCheckedChange={(checked) => {
              const newValue = checked.toString();
              setValues(prev => ({ ...prev, [field.id]: newValue }));
              handleSaveField(field.id, newValue);
            }}
            disabled={!canEdit}
          />
        );
      
      default:
        return <Input value={value} disabled />;
    }
  };

  const groupedFields = fields.reduce((acc, field) => {
    if (!acc[field.field_category]) {
      acc[field.field_category] = [];
    }
    acc[field.field_category].push(field);
    return acc;
  }, {} as Record<string, CustomField[]>);

  if (fields.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedFields).map(([category, categoryFields]) => {
        const isCurrentStage = category === currentLifecycleStage;
        return (
          <Card key={category} className={isCurrentStage ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle className="capitalize flex items-center justify-between">
                <span>{category} Information</span>
                {isCurrentStage && (
                  <span className="text-xs font-normal text-primary bg-primary/10 px-2 py-1 rounded">
                    Current Stage
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryFields.map((field) => {
                  const isRequired = field.is_required && isCurrentStage;
                  return (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id}>
                        {field.field_label}
                        {isRequired && <span className="text-red-500 ml-1">*</span>}
                        {!isAdmin && !field.is_editable_by_student && (
                          <span className="text-xs text-muted-foreground ml-2">(Read-only)</span>
                        )}
                      </Label>
                      {renderField(field)}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
