import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileCheck, FileText, DollarSign, GraduationCap, Heart, 
  Home, Plane, Clock, CheckCircle2, AlertCircle, Download
} from "lucide-react";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  required: boolean;
}

interface CountryVisa {
  country: string;
  flag: string;
  visaType: string;
  processingTime: string;
  fee: string;
  checklist: ChecklistItem[];
}

export function VisaChecklist() {
  const [selectedCountry, setSelectedCountry] = useState<string>("usa");
  const [completedItems, setCompletedItems] = useState<string[]>([]);

  const visaData: Record<string, CountryVisa> = {
    usa: {
      country: "United States",
      flag: "🇺🇸",
      visaType: "F-1 Student Visa",
      processingTime: "3-6 weeks",
      fee: "$185 + $350 SEVIS",
      checklist: [
        { id: "i20", title: "Form I-20", description: "Certificate of eligibility from your university", icon: FileText, required: true },
        { id: "ds160", title: "DS-160 Application", description: "Online visa application form", icon: FileCheck, required: true },
        { id: "passport", title: "Valid Passport", description: "At least 6 months validity beyond your stay", icon: Plane, required: true },
        { id: "photo", title: "Passport Photo", description: "2x2 inch, white background, recent", icon: FileText, required: true },
        { id: "sevis", title: "SEVIS Fee Receipt", description: "I-901 SEVIS fee payment confirmation", icon: DollarSign, required: true },
        { id: "financial", title: "Financial Documents", description: "Bank statements, sponsor letters, scholarship proof", icon: DollarSign, required: true },
        { id: "transcripts", title: "Academic Transcripts", description: "Official transcripts from all institutions", icon: GraduationCap, required: true },
        { id: "english", title: "English Proficiency", description: "IELTS/TOEFL score report", icon: FileText, required: true },
        { id: "interview", title: "Interview Appointment", description: "Schedule and prepare for visa interview", icon: Clock, required: true },
        { id: "ties", title: "Ties to Home Country", description: "Property, job, family documents", icon: Home, required: false },
      ],
    },
    uk: {
      country: "United Kingdom",
      flag: "🇬🇧",
      visaType: "Student Visa (Tier 4)",
      processingTime: "3-4 weeks",
      fee: "£490 + £624/year IHS",
      checklist: [
        { id: "cas", title: "CAS Letter", description: "Confirmation of Acceptance for Studies from university", icon: FileText, required: true },
        { id: "passport", title: "Valid Passport", description: "With blank pages for visa", icon: Plane, required: true },
        { id: "financial", title: "Financial Proof", description: "28 days of funds in bank account", icon: DollarSign, required: true },
        { id: "english", title: "English Proficiency", description: "IELTS UKVI or equivalent", icon: FileText, required: true },
        { id: "tb", title: "TB Test Certificate", description: "Required for Bangladesh applicants", icon: Heart, required: true },
        { id: "photo", title: "Biometric Photo", description: "Recent passport-style photo", icon: FileText, required: true },
        { id: "consent", title: "Consent Letter", description: "For applicants under 18", icon: FileCheck, required: false },
        { id: "accommodation", title: "Accommodation Proof", description: "For first month of stay", icon: Home, required: false },
      ],
    },
    canada: {
      country: "Canada",
      flag: "🇨🇦",
      visaType: "Study Permit",
      processingTime: "4-8 weeks",
      fee: "CAD $150",
      checklist: [
        { id: "loa", title: "Letter of Acceptance", description: "From designated learning institution (DLI)", icon: FileText, required: true },
        { id: "passport", title: "Valid Passport", description: "Valid for duration of stay", icon: Plane, required: true },
        { id: "financial", title: "Proof of Funds", description: "Tuition + CAD $10,000/year living expenses", icon: DollarSign, required: true },
        { id: "gic", title: "GIC Certificate", description: "Guaranteed Investment Certificate (optional but recommended)", icon: DollarSign, required: false },
        { id: "sop", title: "Statement of Purpose", description: "Explaining study plans and intentions", icon: FileText, required: true },
        { id: "transcripts", title: "Academic Documents", description: "Transcripts and certificates", icon: GraduationCap, required: true },
        { id: "english", title: "Language Test", description: "IELTS/TOEFL scores", icon: FileText, required: true },
        { id: "police", title: "Police Clearance", description: "Certificate from Bangladesh", icon: FileCheck, required: true },
        { id: "medical", title: "Medical Exam", description: "From designated panel physician", icon: Heart, required: true },
        { id: "photo", title: "Digital Photo", description: "Meeting IRCC specifications", icon: FileText, required: true },
      ],
    },
    australia: {
      country: "Australia",
      flag: "🇦🇺",
      visaType: "Student Visa (Subclass 500)",
      processingTime: "4-6 weeks",
      fee: "AUD $710",
      checklist: [
        { id: "coe", title: "CoE Letter", description: "Confirmation of Enrolment from institution", icon: FileText, required: true },
        { id: "passport", title: "Valid Passport", description: "Current and valid passport", icon: Plane, required: true },
        { id: "gte", title: "GTE Statement", description: "Genuine Temporary Entrant statement", icon: FileText, required: true },
        { id: "financial", title: "Financial Capacity", description: "Proof of funds for tuition and living", icon: DollarSign, required: true },
        { id: "english", title: "English Proficiency", description: "IELTS/PTE/TOEFL scores", icon: FileText, required: true },
        { id: "oshc", title: "Health Insurance", description: "Overseas Student Health Cover", icon: Heart, required: true },
        { id: "police", title: "Police Clearance", description: "From all countries lived 12+ months", icon: FileCheck, required: true },
        { id: "medical", title: "Health Examination", description: "From panel-approved doctor", icon: Heart, required: true },
        { id: "photo", title: "Passport Photo", description: "Recent digital photograph", icon: FileText, required: true },
      ],
    },
    germany: {
      country: "Germany",
      flag: "🇩🇪",
      visaType: "National Visa (Type D)",
      processingTime: "4-8 weeks",
      fee: "€75",
      checklist: [
        { id: "admission", title: "Admission Letter", description: "From German university", icon: FileText, required: true },
        { id: "passport", title: "Valid Passport", description: "Valid for 3+ months beyond stay", icon: Plane, required: true },
        { id: "blocked", title: "Blocked Account", description: "€11,208/year in German blocked account", icon: DollarSign, required: true },
        { id: "insurance", title: "Health Insurance", description: "Travel and health insurance proof", icon: Heart, required: true },
        { id: "motivation", title: "Motivation Letter", description: "Explaining study plans", icon: FileText, required: true },
        { id: "cv", title: "CV/Resume", description: "Updated curriculum vitae", icon: FileCheck, required: true },
        { id: "transcripts", title: "Academic Records", description: "Translated and certified", icon: GraduationCap, required: true },
        { id: "language", title: "Language Certificate", description: "German/English proficiency", icon: FileText, required: true },
        { id: "photo", title: "Biometric Photos", description: "2 recent passport photos", icon: FileText, required: true },
      ],
    },
  };

  const currentVisa = visaData[selectedCountry];
  const progress = currentVisa ? (completedItems.length / currentVisa.checklist.length) * 100 : 0;

  const toggleItem = (itemId: string) => {
    if (completedItems.includes(itemId)) {
      setCompletedItems(completedItems.filter(id => id !== itemId));
    } else {
      setCompletedItems([...completedItems, itemId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Visa Document Checklist</h2>
          <p className="text-muted-foreground">Track your visa application documents</p>
        </div>
        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(visaData).map(([key, data]) => (
              <SelectItem key={key} value={key}>
                <span className="flex items-center gap-2">
                  <span>{data.flag}</span>
                  <span>{data.country}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {currentVisa && (
        <>
          {/* Visa Overview Card */}
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">{currentVisa.flag}</span>
                <div>
                  <h3 className="text-xl font-bold">{currentVisa.country}</h3>
                  <p className="text-muted-foreground">{currentVisa.visaType}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Processing Time</p>
                    <p className="font-medium">{currentVisa.processingTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Visa Fee</p>
                    <p className="font-medium">{currentVisa.fee}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Progress</p>
                    <p className="font-medium">{completedItems.length}/{currentVisa.checklist.length} items</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completion Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Checklist */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-primary" />
                Document Checklist
              </CardTitle>
              <CardDescription>Check off items as you prepare them</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentVisa.checklist.map((item) => {
                  const isCompleted = completedItems.includes(item.id);
                  return (
                    <div 
                      key={item.id} 
                      className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                        isCompleted ? 'bg-green-500/5 border-green-500/30' : 'border-border'
                      }`}
                      onClick={() => toggleItem(item.id)}
                    >
                      <Checkbox 
                        checked={isCompleted}
                        onCheckedChange={() => toggleItem(item.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <item.icon className={`w-4 h-4 ${isCompleted ? 'text-green-600' : 'text-primary'}`} />
                          <span className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                            {item.title}
                          </span>
                          {item.required && (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      </div>
                      {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Important Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  Start gathering documents at least 3 months before your intended travel date
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  Keep both original and photocopies of all documents
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  Ensure all translations are done by certified translators
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  Book your visa appointment early as slots fill up quickly
                </li>
              </ul>
              <Button variant="outline" className="mt-4 w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Download Full Checklist PDF
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
