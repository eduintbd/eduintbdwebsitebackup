import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StickyNote, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AdvisorNotesProps {
  notes: string | null;
  sessionNotes: string | null;
}

export function AdvisorNotes({ notes, sessionNotes }: AdvisorNotesProps) {
  const hasNotes = notes || sessionNotes;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <StickyNote className="h-5 w-5" />
          Advisor Notes
        </CardTitle>
        <CardDescription>Important information from your counselor</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {!hasNotes ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No advisor notes yet. Your counselor will add notes after your consultation.
          </p>
        ) : (
          <>
            {notes && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">General Notes</p>
                    <p className="text-sm">{notes}</p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {sessionNotes && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">Session Notes</p>
                    <p className="text-sm">{sessionNotes}</p>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
