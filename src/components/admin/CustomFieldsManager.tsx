import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Save, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface CustomField {
  id: string;
  field_name: string;
  field_label: string;
  field_type: string;
  field_options?: any;
  is_required: boolean;
  is_visible_to_student: boolean;
  is_editable_by_student: boolean;
  show_in_table: boolean;
  show_in_details: boolean;
  field_category: string;
  display_order: number;
}

export function CustomFieldsManager() {
  const [fields, setFields] = useState<CustomField[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    field_name: "",
    field_label: "",
    field_type: "text",
    field_options: "",
    is_required: false,
    is_visible_to_student: true,
    is_editable_by_student: false,
    show_in_table: false,
    show_in_details: true,
    field_category: "Lead Generation",
    display_order: 0
  });

  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_fields')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setFields(data || []);
    } catch (error: any) {
      console.error("Error loading fields:", error);
      toast({
        title: "Error",
        description: "Failed to load custom fields",
        variant: "destructive",
      });
    }
  };

  const handleSaveField = async () => {
    try {
      const fieldData = {
        ...formData,
        field_options: formData.field_type === 'select' && formData.field_options 
          ? { options: formData.field_options.split(',').map(o => o.trim()) }
          : null
      };

      if (editingField) {
        const { error } = await supabase
          .from('custom_fields')
          .update(fieldData)
          .eq('id', editingField.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Field updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('custom_fields')
          .insert([fieldData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Field created successfully",
        });
      }

      loadFields();
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error("Error saving field:", error);
      toast({
        title: "Error",
        description: "Failed to save field",
        variant: "destructive",
      });
    }
  };

  const handleDeleteField = async (id: string) => {
    if (!confirm("Are you sure you want to delete this field? All associated data will be lost.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('custom_fields')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Field deleted successfully",
      });

      loadFields();
    } catch (error: any) {
      console.error("Error deleting field:", error);
      toast({
        title: "Error",
        description: "Failed to delete field",
        variant: "destructive",
      });
    }
  };

  const handleEditField = (field: CustomField) => {
    setEditingField(field);
    setFormData({
      field_name: field.field_name,
      field_label: field.field_label,
      field_type: field.field_type,
      field_options: field.field_options?.options?.join(', ') || "",
      is_required: field.is_required,
      is_visible_to_student: field.is_visible_to_student,
      is_editable_by_student: field.is_editable_by_student,
      show_in_table: field.show_in_table,
      show_in_details: field.show_in_details,
      field_category: field.field_category,
      display_order: field.display_order
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingField(null);
    setFormData({
      field_name: "",
      field_label: "",
      field_type: "text",
      field_options: "",
      is_required: false,
      is_visible_to_student: true,
      is_editable_by_student: false,
      show_in_table: false,
      show_in_details: true,
      field_category: "Lead Generation",
      display_order: 0
    });
  };

  const handleOpenDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Custom Fields</h2>
          <p className="text-muted-foreground">Manage custom fields for student tracking</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Field
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingField ? "Edit Field" : "Create New Field"}</DialogTitle>
              <DialogDescription>
                Configure a custom field to track additional student information
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="field_name">Field Name (ID)</Label>
                  <Input
                    id="field_name"
                    value={formData.field_name}
                    onChange={(e) => setFormData({ ...formData, field_name: e.target.value })}
                    placeholder="e.g., passport_number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="field_label">Display Label</Label>
                  <Input
                    id="field_label"
                    value={formData.field_label}
                    onChange={(e) => setFormData({ ...formData, field_label: e.target.value })}
                    placeholder="e.g., Passport Number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="field_type">Field Type</Label>
                  <Select value={formData.field_type} onValueChange={(value) => setFormData({ ...formData, field_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="select">Select Dropdown</SelectItem>
                      <SelectItem value="textarea">Text Area</SelectItem>
                      <SelectItem value="boolean">Yes/No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="field_category">Life Cycle Stage</Label>
                  <Select value={formData.field_category} onValueChange={(value) => setFormData({ ...formData, field_category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lead Generation">Lead Generation</SelectItem>
                      <SelectItem value="Consultation">Consultation</SelectItem>
                      <SelectItem value="Application">Application</SelectItem>
                      <SelectItem value="Offer">Offer</SelectItem>
                      <SelectItem value="Visa">Visa</SelectItem>
                      <SelectItem value="Pre-Departure">Pre-Departure</SelectItem>
                      <SelectItem value="Enrolled">Enrolled</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_required">Required Field</Label>
                  <Switch
                    id="is_required"
                    checked={formData.is_required}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_required: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_visible_to_student">Visible to Students</Label>
                  <Switch
                    id="is_visible_to_student"
                    checked={formData.is_visible_to_student}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_visible_to_student: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_editable_by_student">Students Can Edit</Label>
                  <Switch
                    id="is_editable_by_student"
                    checked={formData.is_editable_by_student}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_editable_by_student: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show_in_table">Show in Student List Table</Label>
                  <Switch
                    id="show_in_table"
                    checked={formData.show_in_table}
                    onCheckedChange={(checked) => setFormData({ ...formData, show_in_table: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show_in_details">Show in Student Details Popup</Label>
                  <Switch
                    id="show_in_details"
                    checked={formData.show_in_details}
                    onCheckedChange={(checked) => setFormData({ ...formData, show_in_details: checked })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveField}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Field
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {fields.map((field) => (
          <Card key={field.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{field.field_label}</h3>
                    <span className="text-xs px-2 py-1 bg-muted rounded">{field.field_type}</span>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">{field.field_category}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">ID: {field.field_name}</p>
                  <div className="flex gap-2 text-xs">
                    {field.is_required && <span className="text-red-500">Required</span>}
                    {field.is_visible_to_student && <span className="text-muted-foreground">Visible to Students</span>}
                    {field.is_editable_by_student && <span className="text-muted-foreground">Student Editable</span>}
                    {field.show_in_table && <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded">In Table</span>}
                    {field.show_in_details && <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 rounded">In Details</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditField(field)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteField(field.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {fields.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No custom fields yet. Click "Add Field" to create your first custom field.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
