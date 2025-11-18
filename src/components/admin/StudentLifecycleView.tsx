import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Mail, Phone, Calendar, Video, Copy, ExternalLink, Edit, CheckCircle2, FileText } from "lucide-react";
import { StudentCustomFieldValue } from "./StudentCustomFieldValue";
import { StudentCommunicationPanel } from "./StudentCommunicationPanel";
import { DocumentUpload } from "../portal/DocumentUpload";
import { StudentInfoGrid } from "./StudentInfoGrid";

interface CustomField {
  id: string;
  field_label: string;
  field_type: string;
  field_category: string;
  field_options?: any;
  is_required: boolean;
  show_in_details: boolean;
}

interface CustomFieldValue {
  field_id: string;
  field_value: string | null;
}

interface StudentLifecycleViewProps {
  student: any;
  editMode: boolean;
  editedStudent: any;
  setEditedStudent: (student: any) => void;
  customFields: CustomField[];
  customFieldValues: Record<string, CustomFieldValue[]>;
  onMoveToNextStage: () => void;
  onCopyToClipboard: (text: string) => void;
  onOpenMeetingLinkDialog: (link: string) => void;
  onLoadStudents: () => void;
}

export function StudentLifecycleView({
  student,
  editMode,
  editedStudent,
  setEditedStudent,
  customFields,
  customFieldValues,
  onMoveToNextStage,
  onCopyToClipboard,
  onOpenMeetingLinkDialog,
  onLoadStudents
}: StudentLifecycleViewProps) {
  const lifecycleStages = [
    "Lead Generation",
    "Consultation",
    "Application",
    "Offer",
    "Visa",
    "Pre-Departure",
    "Enrolled",
    "Closed"
  ];

  const getCurrentStageIndex = (stage: string | null) => {
    if (!stage) return 0;
    return lifecycleStages.findIndex(s => s === stage);
  };

  const canAccessStage = (stageIndex: number) => {
    const currentIndex = getCurrentStageIndex(student.lifecycle_stage);
    return stageIndex <= currentIndex;
  };

  const currentStageIndex = getCurrentStageIndex(student.lifecycle_stage);

  return (
    <div className="space-y-6">
      {/* Current Lifecycle Stage Badge */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <Badge variant="default" className="text-lg px-4 py-2">
            {student.lifecycle_stage || 'Lead Generation'}
          </Badge>
        </div>
        {student.lifecycle_stage !== 'Closed' && currentStageIndex < lifecycleStages.length - 1 && (
          <Button onClick={onMoveToNextStage} size="sm" variant="outline">
            Move to {lifecycleStages[currentStageIndex + 1]}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Student Information Grid - 3 Row Layout */}
      <StudentInfoGrid 
        student={student} 
        editMode={editMode}
        editedStudent={editedStudent}
        setEditedStudent={setEditedStudent}
      />

      {/* Student's Initial Message */}
      {student.details && (
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Student's Initial Message</Label>
          <div className="p-4 bg-muted/30 rounded-lg text-sm border">
            {student.details}
          </div>
        </div>
      )}

      {/* Lead Generation Stage - Custom Fields Only */}
      {customFields.filter(f => f.field_category === 'Lead Generation' && f.show_in_details).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">Additional Information</h3>
          <div className="grid grid-cols-2 gap-4">
            {customFields
              .filter(f => f.field_category === 'Lead Generation' && f.show_in_details)
              .map(field => {
                const studentValues = customFieldValues[student.id] || [];
                const fieldValue = studentValues.find(v => v.field_id === field.id);
                
                return (
                  <div key={field.id} className="p-4 bg-muted/20 rounded-lg border">
                    <Label className="text-xs text-muted-foreground font-medium">
                      {field.field_label}
                      {field.is_required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <div className="mt-2">
                      <StudentCustomFieldValue
                        fieldType={field.field_type}
                        value={fieldValue?.field_value || null}
                        options={field.field_options}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Consultation Stage */}
      {canAccessStage(1) && (
        <div className="border-t pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-primary">Counseling History</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Consultation Status</Label>
              <div className="mt-1">
                {editMode ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="consultation_completed"
                      checked={editedStudent?.consultation_completed || false}
                      onChange={(e) => setEditedStudent(prev => prev ? {...prev, consultation_completed: e.target.checked} : null)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="consultation_completed">Consultation Completed</Label>
                  </div>
                ) : (
                  <Badge variant={student.consultation_completed ? "default" : "outline"} className="gap-1">
                    {student.consultation_completed && <CheckCircle2 className="h-3 w-3" />}
                    {student.consultation_completed ? 'Completed' : 'Pending'}
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Session Date</Label>
              {editMode ? (
                <Input
                  type="datetime-local"
                  value={editedStudent?.session_date ? new Date(editedStudent.session_date).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setEditedStudent(prev => prev ? {...prev, session_date: e.target.value} : null)}
                />
              ) : (
                <div className="mt-1 space-y-2">
                  {student.session_booked && student.session_date ? (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(student.session_date).toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">No session scheduled</span>
                  )}
                </div>
              )}
            </div>

            <div>
              <Label className="text-muted-foreground">Session Notes</Label>
              {editMode ? (
                <Textarea
                  placeholder="Notes from counseling sessions..."
                  className="mt-2"
                  rows={3}
                  value={editedStudent?.session_notes || ''}
                  onChange={(e) => setEditedStudent(prev => prev ? {...prev, session_notes: e.target.value} : null)}
                />
              ) : (
                <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                  {student.session_notes || 'No session notes'}
                </div>
              )}
            </div>

            <div>
              <Label className="text-muted-foreground">Meeting Link</Label>
              <div className="mt-1 space-y-2">
                {student.meeting_link ? (
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground break-all bg-muted/50 p-2 rounded">
                      {student.meeting_link}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => onCopyToClipboard(student.meeting_link!)}>
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => window.open(student.meeting_link!, '_blank')}>
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Open
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => onOpenMeetingLinkDialog(student.meeting_link || "")}>
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button size="sm" onClick={() => onOpenMeetingLinkDialog("")}>
                    <Video className="h-4 w-4 mr-2" />
                    Add Meeting Link
                  </Button>
                )}
              </div>
            </div>

            {student.preferred_partners && (
              <div>
                <Label className="text-muted-foreground">Preferred Partners</Label>
                <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                  {student.preferred_partners}
                </div>
              </div>
            )}

            {/* Stage-specific custom fields */}
            {customFields
              .filter(f => f.field_category === 'Consultation' && f.show_in_details)
              .map(field => {
                const studentValues = customFieldValues[student.id] || [];
                const fieldValue = studentValues.find(v => v.field_id === field.id);
                
                return (
                  <div key={field.id}>
                    <Label className="text-muted-foreground">
                      {field.field_label}
                      {field.is_required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <div className="mt-1">
                      <StudentCustomFieldValue
                        fieldType={field.field_type}
                        value={fieldValue?.field_value || null}
                        options={field.field_options}
                      />
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Advisor Notes for Consultation */}
          <div className="mt-4 p-4 bg-muted/50 rounded-md">
            <Label className="text-sm font-semibold">Advisor Notes - Consultation</Label>
            {editMode ? (
              <Textarea
                placeholder="Notes specific to consultation stage..."
                className="mt-2"
                rows={3}
              />
            ) : (
              <div className="mt-2 text-sm text-muted-foreground">No notes</div>
            )}
          </div>
        </div>
      )}

      {/* Application Stage */}
      {canAccessStage(2) && (
        <div className="border-t pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-primary">Application Information</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="application_status">Application Status</Label>
              {editMode ? (
                <Select
                  value={editedStudent?.application_status}
                  onValueChange={(value) => setEditedStudent(prev => prev ? {...prev, application_status: value} : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="initial_inquiry">Initial Inquiry</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="document_collection">Document Collection</SelectItem>
                    <SelectItem value="application_preparation">Application Preparation</SelectItem>
                    <SelectItem value="applied_submission">Applied / Submission</SelectItem>
                    <SelectItem value="follow_ups_communication">Follow-ups and Communication</SelectItem>
                    <SelectItem value="offer_received">Offer Received</SelectItem>
                    <SelectItem value="visa_assistance">Visa Assistance</SelectItem>
                    <SelectItem value="acceptance">Acceptance</SelectItem>
                    <SelectItem value="enrollment">Enrollment</SelectItem>
                    <SelectItem value="long_term_nurture">Long-Term Nurture</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="mt-1">
                  <Badge>{student.application_status || 'initial_inquiry'}</Badge>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="enrolled_university">Enrolled University</Label>
              {editMode ? (
                <Input
                  id="enrolled_university"
                  value={editedStudent?.enrolled_university || ''}
                  onChange={(e) => setEditedStudent(prev => prev ? {...prev, enrolled_university: e.target.value} : null)}
                />
              ) : (
                <div className="mt-1">{student.enrolled_university || 'Not set'}</div>
              )}
            </div>

            <div>
              <Label htmlFor="course_name">Course Name</Label>
              {editMode ? (
                <Input
                  id="course_name"
                  value={editedStudent?.course_name || ''}
                  onChange={(e) => setEditedStudent(prev => prev ? {...prev, course_name: e.target.value} : null)}
                />
              ) : (
                <div className="mt-1">{student.course_name || 'Not set'}</div>
              )}
            </div>

            <div>
              <Label htmlFor="intake_semester">Intake/Semester</Label>
              {editMode ? (
                <Input
                  id="intake_semester"
                  placeholder="e.g., Fall 2025"
                  value={editedStudent?.intake_semester || ''}
                  onChange={(e) => setEditedStudent(prev => prev ? {...prev, intake_semester: e.target.value} : null)}
                />
              ) : (
                <div className="mt-1">{student.intake_semester || 'Not set'}</div>
              )}
            </div>

            {student.competitor_universities && (
              <div>
                <Label className="text-muted-foreground">Competitor Universities</Label>
                <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                  {student.competitor_universities}
                </div>
              </div>
            )}

            {/* Stage-specific custom fields */}
            {customFields
              .filter(f => f.field_category === 'Application' && f.show_in_details)
              .map(field => {
                const studentValues = customFieldValues[student.id] || [];
                const fieldValue = studentValues.find(v => v.field_id === field.id);
                
                return (
                  <div key={field.id}>
                    <Label className="text-muted-foreground">
                      {field.field_label}
                      {field.is_required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <div className="mt-1">
                      <StudentCustomFieldValue
                        fieldType={field.field_type}
                        value={fieldValue?.field_value || null}
                        options={field.field_options}
                      />
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Advisor Notes for Application */}
          <div className="mt-4 p-4 bg-muted/50 rounded-md">
            <Label className="text-sm font-semibold">Advisor Notes - Application</Label>
            {editMode ? (
              <Textarea
                placeholder="Notes specific to application stage..."
                className="mt-2"
                rows={3}
              />
            ) : (
              <div className="mt-2 text-sm text-muted-foreground">No notes</div>
            )}
          </div>
        </div>
      )}

      {/* Offer Stage */}
      {canAccessStage(3) && (
        <div className="border-t pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-primary">Offer Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {editMode ? (
                <>
                  <input
                    type="checkbox"
                    id="offer_letter"
                    checked={editedStudent?.offer_letter_received || false}
                    onChange={(e) => setEditedStudent(prev => prev ? {...prev, offer_letter_received: e.target.checked} : null)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="offer_letter">Offer Letter Received</Label>
                </>
              ) : (
                <Badge variant={student.offer_letter_received ? "default" : "outline"}>
                  Offer Letter: {student.offer_letter_received ? 'Yes' : 'No'}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              {editMode ? (
                <>
                  <input
                    type="checkbox"
                    id="cas_received"
                    checked={editedStudent?.cas_received || false}
                    onChange={(e) => setEditedStudent(prev => prev ? {...prev, cas_received: e.target.checked} : null)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="cas_received">CAS Received</Label>
                </>
              ) : (
                <Badge variant={student.cas_received ? "default" : "outline"}>
                  CAS: {student.cas_received ? 'Yes' : 'No'}
                </Badge>
              )}
            </div>

            <div>
              <Label htmlFor="tuition_fees">Tuition Fees ($)</Label>
              {editMode ? (
                <Input
                  id="tuition_fees"
                  type="number"
                  placeholder="0.00"
                  value={editedStudent?.tuition_fees || ''}
                  onChange={(e) => setEditedStudent(prev => prev ? {...prev, tuition_fees: parseFloat(e.target.value) || null} : null)}
                />
              ) : (
                <div className="mt-1">${student.tuition_fees?.toFixed(2) || 'Not set'}</div>
              )}
            </div>

            <div>
              <Label htmlFor="scholarship_amount">Scholarship Amount ($)</Label>
              {editMode ? (
                <Input
                  id="scholarship_amount"
                  type="number"
                  placeholder="0.00"
                  value={editedStudent?.scholarship_amount || ''}
                  onChange={(e) => setEditedStudent(prev => prev ? {...prev, scholarship_amount: parseFloat(e.target.value) || null} : null)}
                />
              ) : (
                <div className="mt-1">${student.scholarship_amount?.toFixed(2) || 'None'}</div>
              )}
            </div>

            <div>
              <Label htmlFor="deposit_amount">Deposit Amount ($)</Label>
              {editMode ? (
                <Input
                  id="deposit_amount"
                  type="number"
                  placeholder="0.00"
                  value={editedStudent?.deposit_amount || ''}
                  onChange={(e) => setEditedStudent(prev => prev ? {...prev, deposit_amount: parseFloat(e.target.value) || null} : null)}
                />
              ) : (
                <div className="mt-1">${student.deposit_amount?.toFixed(2) || 'Not set'}</div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {editMode ? (
                <>
                  <input
                    type="checkbox"
                    id="deposit_paid"
                    checked={editedStudent?.deposit_paid || false}
                    onChange={(e) => setEditedStudent(prev => prev ? {...prev, deposit_paid: e.target.checked} : null)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="deposit_paid">Deposit Paid</Label>
                </>
              ) : (
                <Badge variant={student.deposit_paid ? "default" : "outline"}>
                  Deposit: {student.deposit_paid ? 'Paid' : 'Unpaid'}
                </Badge>
              )}
            </div>

            {/* Stage-specific custom fields */}
            {customFields
              .filter(f => f.field_category === 'Offer' && f.show_in_details)
              .map(field => {
                const studentValues = customFieldValues[student.id] || [];
                const fieldValue = studentValues.find(v => v.field_id === field.id);
                
                return (
                  <div key={field.id}>
                    <Label className="text-muted-foreground">
                      {field.field_label}
                      {field.is_required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <div className="mt-1">
                      <StudentCustomFieldValue
                        fieldType={field.field_type}
                        value={fieldValue?.field_value || null}
                        options={field.field_options}
                      />
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Advisor Notes for Offer */}
          <div className="mt-4 p-4 bg-muted/50 rounded-md">
            <Label className="text-sm font-semibold">Advisor Notes - Offer</Label>
            {editMode ? (
              <Textarea
                placeholder="Notes specific to offer stage..."
                className="mt-2"
                rows={3}
              />
            ) : (
              <div className="mt-2 text-sm text-muted-foreground">No notes</div>
            )}
          </div>
        </div>
      )}

      {/* Visa Stage */}
      {canAccessStage(4) && (
        <div className="border-t pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-primary">Visa Information</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="visa_status">Visa Status</Label>
              {editMode ? (
                <Select
                  value={editedStudent?.visa_status}
                  onValueChange={(value) => setEditedStudent(prev => prev ? {...prev, visa_status: value} : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="documents_gathering">Documents Gathering</SelectItem>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="mt-1">
                  <Badge variant={student.visa_status === 'approved' ? 'default' : 'secondary'}>
                    {student.visa_status || 'not_started'}
                  </Badge>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="visa_application_date">Visa Application Date</Label>
              {editMode ? (
                <Input
                  id="visa_application_date"
                  type="date"
                  value={editedStudent?.visa_application_date || ''}
                  onChange={(e) => setEditedStudent(prev => prev ? {...prev, visa_application_date: e.target.value} : null)}
                />
              ) : (
                <div className="mt-1">{student.visa_application_date || 'Not set'}</div>
              )}
            </div>

            <div>
              <Label htmlFor="visa_approval_date">Visa Approval Date</Label>
              {editMode ? (
                <Input
                  id="visa_approval_date"
                  type="date"
                  value={editedStudent?.visa_approval_date || ''}
                  onChange={(e) => setEditedStudent(prev => prev ? {...prev, visa_approval_date: e.target.value} : null)}
                />
              ) : (
                <div className="mt-1">{student.visa_approval_date || 'Not set'}</div>
              )}
            </div>

            {/* Stage-specific custom fields */}
            {customFields
              .filter(f => f.field_category === 'Visa' && f.show_in_details)
              .map(field => {
                const studentValues = customFieldValues[student.id] || [];
                const fieldValue = studentValues.find(v => v.field_id === field.id);
                
                return (
                  <div key={field.id}>
                    <Label className="text-muted-foreground">
                      {field.field_label}
                      {field.is_required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <div className="mt-1">
                      <StudentCustomFieldValue
                        fieldType={field.field_type}
                        value={fieldValue?.field_value || null}
                        options={field.field_options}
                      />
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Advisor Notes for Visa */}
          <div className="mt-4 p-4 bg-muted/50 rounded-md">
            <Label className="text-sm font-semibold">Advisor Notes - Visa</Label>
            {editMode ? (
              <Textarea
                placeholder="Notes specific to visa stage..."
                className="mt-2"
                rows={3}
              />
            ) : (
              <div className="mt-2 text-sm text-muted-foreground">No notes</div>
            )}
          </div>
        </div>
      )}

      {/* Pre-Departure Stage */}
      {canAccessStage(5) && (
        <div className="border-t pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-primary">Pre-Departure Information</h3>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Pre-departure preparations and guidance</p>

            {/* Stage-specific custom fields */}
            {customFields
              .filter(f => f.field_category === 'Pre-Departure' && f.show_in_details)
              .map(field => {
                const studentValues = customFieldValues[student.id] || [];
                const fieldValue = studentValues.find(v => v.field_id === field.id);
                
                return (
                  <div key={field.id}>
                    <Label className="text-muted-foreground">
                      {field.field_label}
                      {field.is_required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <div className="mt-1">
                      <StudentCustomFieldValue
                        fieldType={field.field_type}
                        value={fieldValue?.field_value || null}
                        options={field.field_options}
                      />
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Advisor Notes for Pre-Departure */}
          <div className="mt-4 p-4 bg-muted/50 rounded-md">
            <Label className="text-sm font-semibold">Advisor Notes - Pre-Departure</Label>
            {editMode ? (
              <Textarea
                placeholder="Notes specific to pre-departure stage..."
                className="mt-2"
                rows={3}
              />
            ) : (
              <div className="mt-2 text-sm text-muted-foreground">No notes</div>
            )}
          </div>
        </div>
      )}

      {/* Enrolled Stage */}
      {canAccessStage(6) && (
        <div className="border-t pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-primary">Enrolled Information</h3>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Student successfully enrolled</p>

            {/* Stage-specific custom fields */}
            {customFields
              .filter(f => f.field_category === 'Enrolled' && f.show_in_details)
              .map(field => {
                const studentValues = customFieldValues[student.id] || [];
                const fieldValue = studentValues.find(v => v.field_id === field.id);
                
                return (
                  <div key={field.id}>
                    <Label className="text-muted-foreground">
                      {field.field_label}
                      {field.is_required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <div className="mt-1">
                      <StudentCustomFieldValue
                        fieldType={field.field_type}
                        value={fieldValue?.field_value || null}
                        options={field.field_options}
                      />
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Advisor Notes for Enrolled */}
          <div className="mt-4 p-4 bg-muted/50 rounded-md">
            <Label className="text-sm font-semibold">Advisor Notes - Enrolled</Label>
            {editMode ? (
              <Textarea
                placeholder="Notes specific to enrolled stage..."
                className="mt-2"
                rows={3}
              />
            ) : (
              <div className="mt-2 text-sm text-muted-foreground">No notes</div>
            )}
          </div>
        </div>
      )}

      {/* Closed Stage */}
      {canAccessStage(7) && (
        <div className="border-t pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-primary">Closed Information</h3>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Application closed</p>

            {/* Stage-specific custom fields */}
            {customFields
              .filter(f => f.field_category === 'Closed' && f.show_in_details)
              .map(field => {
                const studentValues = customFieldValues[student.id] || [];
                const fieldValue = studentValues.find(v => v.field_id === field.id);
                
                return (
                  <div key={field.id}>
                    <Label className="text-muted-foreground">
                      {field.field_label}
                      {field.is_required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <div className="mt-1">
                      <StudentCustomFieldValue
                        fieldType={field.field_type}
                        value={fieldValue?.field_value || null}
                        options={field.field_options}
                      />
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Advisor Notes for Closed */}
          <div className="mt-4 p-4 bg-muted/50 rounded-md">
            <Label className="text-sm font-semibold">Advisor Notes - Closed</Label>
            {editMode ? (
              <Textarea
                placeholder="Notes specific to closed stage..."
                className="mt-2"
                rows={3}
              />
            ) : (
              <div className="mt-2 text-sm text-muted-foreground">No notes</div>
            )}
          </div>
        </div>
      )}

      {/* Communication and Documents Tabs */}
      <div className="border-t pt-6">
        <Tabs defaultValue="communication" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="communication">💬 Communication</TabsTrigger>
            <TabsTrigger value="documents">📄 Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="communication">
            <StudentCommunicationPanel
              student={{
                id: student.id,
                email: student.email,
                phone: student.phone,
                name: student.name
              }}
            />
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Student Documents</h3>
              <div className="mb-4">
                {student.documents_uploaded ? (
                  <Badge variant="default">
                    <FileText className="w-3 h-3 mr-1" />
                    {Array.isArray(student.document_urls) ? student.document_urls.length : 0} files uploaded
                  </Badge>
                ) : (
                  <Badge variant="outline">No documents</Badge>
                )}
              </div>
              <DocumentUpload
                userId={student.id}
                userEmail={student.email}
                documents={student.document_urls || []}
                onDocumentsChange={onLoadStudents}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Admin Notes - Global */}
      <div className="border-t pt-6">
        <Label htmlFor="admin_notes">General Admin Notes</Label>
        {editMode ? (
          <Textarea
            id="admin_notes"
            placeholder="General internal notes about this student..."
            value={editedStudent?.admin_notes || ''}
            onChange={(e) => setEditedStudent(prev => prev ? {...prev, admin_notes: e.target.value} : null)}
            rows={4}
            className="mt-2"
          />
        ) : (
          <div className="mt-1 p-3 bg-muted rounded-md text-sm">
            {student.admin_notes || 'No general admin notes'}
          </div>
        )}
      </div>
    </div>
  );
}
