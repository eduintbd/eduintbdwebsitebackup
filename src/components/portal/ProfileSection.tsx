import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, GraduationCap, BookOpen, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ProfileSectionProps {
  application: any;
}

export function ProfileSection({ application }: ProfileSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Your Profile
            </CardTitle>
            <CardDescription>Personal and academic information</CardDescription>
          </div>
          <Button variant="outline" size="sm">Edit Profile</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="font-semibold mb-3 text-sm">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <User className="h-3 w-3" /> Full Name
              </p>
              <p className="font-medium text-sm">{application.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Mail className="h-3 w-3" /> Email
              </p>
              <p className="font-medium text-sm break-all">{application.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Phone className="h-3 w-3" /> Phone
              </p>
              <p className="font-medium text-sm">{application.phone}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <MapPin className="h-3 w-3" /> Study Destination
              </p>
              <p className="font-medium text-sm">{application.study_destination || 'Not specified'}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Academic Information */}
        <div>
          <h3 className="font-semibold mb-3 text-sm">Academic Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {application.preferred_course && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <GraduationCap className="h-3 w-3" /> Preferred Course
                </p>
                <p className="font-medium text-sm">{application.preferred_course}</p>
              </div>
            )}
            {application.level && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <BookOpen className="h-3 w-3" /> Education Level
                </p>
                <p className="font-medium text-sm">{application.level}</p>
              </div>
            )}
            {application.study_year && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-3 w-3" /> Study Year
                </p>
                <p className="font-medium text-sm">{application.study_year}</p>
              </div>
            )}
            {application.budget && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-3 w-3" /> Budget
                </p>
                <p className="font-medium text-sm">{application.budget}</p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Application Status */}
        <div>
          <h3 className="font-semibold mb-3 text-sm">Application Status</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              Status: {application.application_status?.replace(/_/g, ' ') || 'Submitted'}
            </Badge>
            {application.lifecycle_stage && (
              <Badge variant="secondary">
                Stage: {application.lifecycle_stage}
              </Badge>
            )}
            {application.priority_level && (
              <Badge variant="outline">
                Priority: {application.priority_level}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
