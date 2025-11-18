import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, User, Mail, Phone, Calendar, FileText, Video, ExternalLink, Copy, Edit, Save, X, ArrowUpDown, ArrowUp, ArrowDown, Settings2, CheckCircle2, GripVertical } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DocumentUpload } from "@/components/portal/DocumentUpload";
import { StudentCommunication } from "@/components/admin/StudentCommunication";
import { StudentCommunicationPanel } from "@/components/admin/StudentCommunicationPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PasswordResetDialog } from "./PasswordResetDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { StudentCustomFieldValue } from "./StudentCustomFieldValue";
import { StudentLifecycleView } from "./StudentLifecycleView";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  study_destination: string;
  study_year: string;
  status: string;
  session_booked: boolean;
  session_date: string | null;
  meeting_link: string | null;
  consultation_completed: boolean;
  documents_uploaded: boolean;
  document_urls: any;
  details: string;
  created_at: string;
  competitor_universities: string;
  preferred_partners: string;
  application_status: string;
  visa_status: string;
  visa_application_date: string | null;
  visa_approval_date: string | null;
  enrolled_university: string | null;
  course_name: string | null;
  intake_semester: string | null;
  tuition_fees: number | null;
  scholarship_amount: number | null;
  admin_notes: string | null;
  assigned_counselor: string | null;
  priority_level: string;
  offer_letter_received: boolean;
  cas_received: boolean;
  deposit_paid: boolean;
  deposit_amount: number | null;
  lifecycle_stage: string | null;
  session_notes: string | null;
}

type SortField = 'name' | 'email' | 'created_at' | 'study_destination' | 'application_status' | 'session_date' | 'priority_level';
type SortOrder = 'asc' | 'desc';

interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  sortable: boolean;
  sortField?: SortField;
  isCustomField?: boolean;
  customFieldType?: string;
  customFieldOptions?: any;
}

interface CustomField {
  id: string;
  field_name: string;
  field_label: string;
  field_type: string;
  field_options?: any;
  show_in_table: boolean;
  show_in_details: boolean;
  is_required: boolean;
  field_category: string;
}

interface CustomFieldValue {
  field_id: string;
  field_value: string | null;
}

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: 'student', label: 'Student', visible: true, sortable: true, sortField: 'name' },
  { id: 'destination', label: 'Destination', visible: true, sortable: true, sortField: 'study_destination' },
  { id: 'status', label: 'Status', visible: true, sortable: true, sortField: 'application_status' },
  { id: 'session', label: 'Session', visible: true, sortable: true, sortField: 'session_date' },
  { id: 'docs', label: 'Docs', visible: true, sortable: false },
  { id: 'priority', label: 'Priority', visible: true, sortable: true, sortField: 'priority_level' },
  { id: 'applied', label: 'Applied', visible: true, sortable: true, sortField: 'created_at' },
  { id: 'visa_status', label: 'Visa Status', visible: false, sortable: false },
  { id: 'visa_application_date', label: 'Visa Application Date', visible: false, sortable: false },
  { id: 'visa_approval_date', label: 'Visa Approval Date', visible: false, sortable: false },
  { id: 'enrolled_university', label: 'Enrolled University', visible: false, sortable: false },
  { id: 'course_name', label: 'Course Name', visible: false, sortable: false },
  { id: 'intake_semester', label: 'Intake/Semester', visible: false, sortable: false },
  { id: 'tuition_fees', label: 'Tuition Fees', visible: false, sortable: false },
  { id: 'scholarship_amount', label: 'Scholarship Amount', visible: false, sortable: false },
  { id: 'assigned_counselor', label: 'Assigned Counselor', visible: false, sortable: false },
  { id: 'offer_letter', label: 'Offer Letter', visible: false, sortable: false },
  { id: 'cas_received', label: 'CAS Received', visible: false, sortable: false },
  { id: 'deposit_status', label: 'Deposit Status', visible: false, sortable: false },
  { id: 'competitor_universities', label: 'Competitor Universities', visible: false, sortable: false },
  { id: 'preferred_partners', label: 'Preferred Partners', visible: false, sortable: false },
];

export function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [lifecycleFilter, setLifecycleFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingMeetingLink, setEditingMeetingLink] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedStudent, setEditedStudent] = useState<Student | null>(null);
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, CustomFieldValue[]>>({});
  const [columns, setColumns] = useState<ColumnConfig[]>(() => {
    const saved = localStorage.getItem('adminColumnConfig');
    return saved ? JSON.parse(saved) : DEFAULT_COLUMNS;
  });
  const { toast } = useToast();

  useEffect(() => {
    loadStudents();
    loadCustomFields();
  }, []);

  useEffect(() => {
    localStorage.setItem('adminColumnConfig', JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, lifecycleFilter, students, sortField, sortOrder]);

  useEffect(() => {
    if (customFields.length > 0) {
      mergeCustomFieldsIntoColumns();
    }
  }, [customFields]);

  const loadStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('student_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
      
      // Load custom field values for all students
      if (data && data.length > 0) {
        loadCustomFieldValues(data.map(s => s.id));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load students.",
        variant: "destructive",
      });
    }
  };

  const loadCustomFields = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_fields')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setCustomFields(data || []);
    } catch (error) {
      console.error("Error loading custom fields:", error);
    }
  };

  const loadCustomFieldValues = async (studentIds: string[]) => {
    try {
      const { data, error } = await supabase
        .from('student_field_values')
        .select('student_id, field_id, field_value')
        .in('student_id', studentIds);

      if (error) throw error;
      
      // Group by student_id
      const valuesByStudent: Record<string, CustomFieldValue[]> = {};
      (data || []).forEach((value) => {
        if (!valuesByStudent[value.student_id]) {
          valuesByStudent[value.student_id] = [];
        }
        valuesByStudent[value.student_id].push({
          field_id: value.field_id,
          field_value: value.field_value
        });
      });
      
      setCustomFieldValues(valuesByStudent);
    } catch (error) {
      console.error("Error loading custom field values:", error);
    }
  };

  const mergeCustomFieldsIntoColumns = () => {
    const savedConfig = localStorage.getItem('adminColumnConfig');
    const baseColumns = savedConfig ? JSON.parse(savedConfig) : DEFAULT_COLUMNS;
    
    // Remove old custom field columns
    const nonCustomColumns = baseColumns.filter((col: ColumnConfig) => !col.isCustomField);
    
    // Add new custom field columns
    const customFieldColumns: ColumnConfig[] = customFields
      .filter(field => field.show_in_table)
      .map(field => ({
        id: `custom_${field.id}`,
        label: field.field_label,
        visible: true,
        sortable: false,
        isCustomField: true,
        customFieldType: field.field_type,
        customFieldOptions: field.field_options
      }));
    
    setColumns([...nonCustomColumns, ...customFieldColumns]);
  };

  const filterStudents = () => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phone.includes(searchTerm)
      );
    }

    if (lifecycleFilter !== "all") {
      filtered = filtered.filter(student => 
        student.lifecycle_stage?.toLowerCase() === lifecycleFilter.toLowerCase()
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Convert to lowercase for string comparison
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredStudents(filtered);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortOrder === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const handleUpdateMeetingLink = async () => {
    if (!selectedStudent || !meetingLink.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid meeting link.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('student_applications')
        .update({ meeting_link: meetingLink.trim() })
        .eq('id', selectedStudent.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Meeting link updated successfully!",
      });

      await loadStudents();
      setEditingMeetingLink(false);
      setMeetingLink("");
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

  const handleEditStudent = () => {
    setEditedStudent(selectedStudent);
    setEditMode(true);
  };

  const handleSaveStudent = async () => {
    if (!editedStudent) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('student_applications')
        .update({
          application_status: editedStudent.application_status,
          visa_status: editedStudent.visa_status,
          visa_application_date: editedStudent.visa_application_date,
          visa_approval_date: editedStudent.visa_approval_date,
          enrolled_university: editedStudent.enrolled_university,
          course_name: editedStudent.course_name,
          intake_semester: editedStudent.intake_semester,
          tuition_fees: editedStudent.tuition_fees,
          scholarship_amount: editedStudent.scholarship_amount,
          admin_notes: editedStudent.admin_notes,
          assigned_counselor: editedStudent.assigned_counselor,
          priority_level: editedStudent.priority_level,
          offer_letter_received: editedStudent.offer_letter_received,
          cas_received: editedStudent.cas_received,
          deposit_paid: editedStudent.deposit_paid,
          deposit_amount: editedStudent.deposit_amount,
          session_notes: editedStudent.session_notes,
          session_date: editedStudent.session_date,
          name: editedStudent.name,
          phone: editedStudent.phone,
          study_destination: editedStudent.study_destination,
          study_year: editedStudent.study_year,
          consultation_completed: editedStudent.consultation_completed,
        })
        .eq('id', editedStudent.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student information updated successfully!",
      });

      await loadStudents();
      setEditMode(false);
      setEditedStudent(null);
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard!",
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not scheduled";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const moveToNextStage = async () => {
    if (!selectedStudent) return;
    
    const lifecycleStages = ["Lead Generation", "Consultation", "Application", "Offer", "Visa", "Pre-Departure", "Enrolled", "Closed"];
    const currentIndex = lifecycleStages.findIndex(s => s === selectedStudent.lifecycle_stage);
    const currentStageIndex = currentIndex === -1 ? 0 : currentIndex;
    
    if (currentStageIndex >= lifecycleStages.length - 1) {
      toast({ title: "Already at final stage" });
      return;
    }

    const nextStage = lifecycleStages[currentStageIndex + 1];
    
    try {
      const { error } = await supabase
        .from('student_applications')
        .update({ lifecycle_stage: nextStage })
        .eq('id', selectedStudent.id);

      if (error) throw error;

      setSelectedStudent(prev => prev ? { ...prev, lifecycle_stage: nextStage } : null);
      toast({ title: "Success", description: `Moved to ${nextStage} stage` });
      loadStudents();
    } catch (error) {
      console.error('Error updating lifecycle stage:', error);
      toast({ title: "Error", description: "Failed to update lifecycle stage", variant: "destructive" });
    }
  };

  const toggleColumnVisibility = (columnId: string) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, visible: !col.visible } : col
    ));
  };

  const moveColumn = (columnId: string, direction: 'up' | 'down') => {
    setColumns(prev => {
      const index = prev.findIndex(col => col.id === columnId);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.length - 1) return prev;
      
      const newColumns = [...prev];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      [newColumns[index], newColumns[swapIndex]] = [newColumns[swapIndex], newColumns[index]];
      return newColumns;
    });
  };

  const renderColumnCell = (student: Student, columnId: string) => {
    switch (columnId) {
      case 'student':
        return (
          <div className="space-y-1">
            <div className="font-medium">{student.name}</div>
            <div className="text-sm text-muted-foreground">{student.email}</div>
            <div className="text-xs text-muted-foreground">{student.phone}</div>
          </div>
        );
      case 'destination':
        return (
          <div className="space-y-1">
            <div>{student.study_destination || "Not set"}</div>
            <div className="text-sm text-muted-foreground">{student.study_year || "N/A"}</div>
          </div>
        );
      case 'status':
        return (
          <Badge variant={student.application_status === 'initial_inquiry' ? 'secondary' : 'default'}>
            {student.application_status?.replace(/_/g, ' ') || 'initial inquiry'}
          </Badge>
        );
      case 'session':
        return student.session_booked ? (
          <div className="space-y-1">
            {student.meeting_link ? (
              <Badge variant="default" className="bg-green-500">Scheduled</Badge>
            ) : (
              <Badge variant="secondary">Pending Link</Badge>
            )}
            <div className="text-xs text-muted-foreground">
              {formatDate(student.session_date)}
            </div>
          </div>
        ) : (
          <Badge variant="outline">Not Booked</Badge>
        );
      case 'docs':
        return student.documents_uploaded ? (
          <Badge variant="default">
            <FileText className="w-3 h-3 mr-1" />
            Uploaded
          </Badge>
        ) : (
          <Badge variant="outline">No Docs</Badge>
        );
      case 'priority':
        return (
          <Badge variant={
            student.priority_level === 'urgent' ? 'destructive' : 
            student.priority_level === 'high' ? 'default' : 
            'secondary'
          }>
            {student.priority_level || 'medium'}
          </Badge>
        );
      case 'applied':
        return (
          <div className="text-sm text-muted-foreground">
            {new Date(student.created_at).toLocaleDateString()}
          </div>
        );
      case 'visa_status':
        return <Badge variant="outline">{student.visa_status?.replace(/_/g, ' ') || 'Not started'}</Badge>;
      case 'visa_application_date':
        return <div className="text-sm">{student.visa_application_date ? new Date(student.visa_application_date).toLocaleDateString() : 'N/A'}</div>;
      case 'visa_approval_date':
        return <div className="text-sm">{student.visa_approval_date ? new Date(student.visa_approval_date).toLocaleDateString() : 'N/A'}</div>;
      case 'enrolled_university':
        return <div className="text-sm">{student.enrolled_university || 'N/A'}</div>;
      case 'course_name':
        return <div className="text-sm">{student.course_name || 'N/A'}</div>;
      case 'intake_semester':
        return <div className="text-sm">{student.intake_semester || 'N/A'}</div>;
      case 'tuition_fees':
        return <div className="text-sm">{student.tuition_fees ? `$${student.tuition_fees.toLocaleString()}` : 'N/A'}</div>;
      case 'scholarship_amount':
        return <div className="text-sm">{student.scholarship_amount ? `$${student.scholarship_amount.toLocaleString()}` : 'N/A'}</div>;
      case 'assigned_counselor':
        return <div className="text-sm">{student.assigned_counselor || 'Not assigned'}</div>;
      case 'offer_letter':
        return student.offer_letter_received ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-muted-foreground" />;
      case 'cas_received':
        return student.cas_received ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-muted-foreground" />;
      case 'deposit_status':
        return student.deposit_paid ? (
          <Badge variant="default">{student.deposit_amount ? `$${student.deposit_amount}` : 'Paid'}</Badge>
        ) : (
          <Badge variant="outline">Not paid</Badge>
        );
      case 'competitor_universities':
        return <div className="text-sm max-w-xs truncate">{student.competitor_universities || 'N/A'}</div>;
      case 'preferred_partners':
        return <div className="text-sm max-w-xs truncate">{student.preferred_partners || 'N/A'}</div>;
      default:
        // Handle custom fields
        if (columnId.startsWith('custom_')) {
          const fieldId = columnId.replace('custom_', '');
          const column = columns.find(c => c.id === columnId);
          const studentValues = customFieldValues[student.id] || [];
          const fieldValue = studentValues.find(v => v.field_id === fieldId);
          
          if (column && column.isCustomField) {
            return (
              <StudentCustomFieldValue
                fieldType={column.customFieldType || 'text'}
                value={fieldValue?.field_value || null}
                options={column.customFieldOptions}
              />
            );
          }
        }
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={lifecycleFilter} onValueChange={setLifecycleFilter}>
          <SelectTrigger className="w-full md:w-[240px]">
            <SelectValue placeholder="Filter by lifecycle stage" />
          </SelectTrigger>
          <SelectContent className="z-50">
            <SelectItem value="all">All Lifecycle Stages</SelectItem>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <Settings2 className="h-4 w-4 mr-2" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[280px] max-h-[400px] overflow-y-auto">
            <DropdownMenuLabel>Toggle & Reorder Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="space-y-1 p-2">
              {columns.map((column, index) => (
                <div key={column.id} className="flex items-center gap-2 p-1 hover:bg-accent rounded">
                  <div className="flex flex-col">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={() => moveColumn(column.id, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={() => moveColumn(column.id, 'down')}
                      disabled={index === columns.length - 1}
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>
                  <Checkbox
                    checked={column.visible}
                    onCheckedChange={() => toggleColumnVisibility(column.id)}
                  />
                  <span className="flex-1 text-sm">{column.label}</span>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.filter(col => col.visible).map((column) => (
                  <TableHead key={column.id}>
                    {column.sortable && column.sortField ? (
                      <Button 
                        variant="ghost" 
                        onClick={() => handleSort(column.sortField!)} 
                        className="font-semibold hover:bg-transparent"
                      >
                        {column.label}
                        <SortIcon field={column.sortField} />
                      </Button>
                    ) : (
                      <span className="font-semibold">{column.label}</span>
                    )}
                  </TableHead>
                ))}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  {columns.filter(col => col.visible).map((column) => (
                    <TableCell key={column.id}>
                      {renderColumnCell(student, column.id)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedStudent(student)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Student Details Dialog */}
      <Dialog open={!!selectedStudent && !editingMeetingLink} onOpenChange={(open) => {
        if (!open) {
          setSelectedStudent(null);
          setEditMode(false);
          setEditedStudent(null);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Lead Details</DialogTitle>
                <DialogDescription>Complete information for {selectedStudent?.name}</DialogDescription>
              </div>
              <div className="flex gap-2">
                {selectedStudent && <PasswordResetDialog studentEmail={selectedStudent.email} />}
                {!editMode ? (
                  <Button onClick={handleEditStudent} variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Details
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSaveStudent} disabled={isSaving} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                    <Button onClick={() => {
                      setEditMode(false);
                      setEditedStudent(null);
                    }} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="space-y-6">
              <StudentLifecycleView
                student={selectedStudent}
                editMode={editMode}
                editedStudent={editedStudent}
                setEditedStudent={setEditedStudent}
                customFields={customFields}
                customFieldValues={customFieldValues}
                onMoveToNextStage={moveToNextStage}
                onCopyToClipboard={copyToClipboard}
                onOpenMeetingLinkDialog={(link) => {
                  setMeetingLink(link);
                  setEditingMeetingLink(true);
                }}
                onLoadStudents={loadStudents}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Meeting Link Dialog */}
      <Dialog open={editingMeetingLink} onOpenChange={(open) => !open && setEditingMeetingLink(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedStudent?.meeting_link ? "Edit" : "Add"} Meeting Link
            </DialogTitle>
            <DialogDescription>
              Enter the Google Meet link for {selectedStudent?.name}'s consultation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meetingLink">Google Meet Link</Label>
              <Input
                id="meetingLink"
                placeholder="https://meet.google.com/abc-defg-hij"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleUpdateMeetingLink}
                disabled={isSaving || !meetingLink.trim()}
                className="flex-1"
              >
                {isSaving ? "Saving..." : "Save Link"}
              </Button>
              <Button variant="outline" onClick={() => setEditingMeetingLink(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}