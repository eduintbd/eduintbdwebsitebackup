import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { CalendarIcon } from "lucide-react";
import { format, subDays, startOfYear, startOfMonth, startOfWeek, startOfDay } from "date-fns";

interface PeriodStats {
  applications: number;
  scheduled: number;
  consultationCompleted: number;
  documentReceived: number;
  documentStatus: number;
  universityApplication: number;
}

interface DashboardStats {
  today: PeriodStats;
  yesterday: PeriodStats;
  thisWeek: PeriodStats;
  thisMonth: PeriodStats;
  ytd: PeriodStats;
  lifetime: PeriodStats;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    today: { applications: 0, scheduled: 0, consultationCompleted: 0, documentReceived: 0, documentStatus: 0, universityApplication: 0 },
    yesterday: { applications: 0, scheduled: 0, consultationCompleted: 0, documentReceived: 0, documentStatus: 0, universityApplication: 0 },
    thisWeek: { applications: 0, scheduled: 0, consultationCompleted: 0, documentReceived: 0, documentStatus: 0, universityApplication: 0 },
    thisMonth: { applications: 0, scheduled: 0, consultationCompleted: 0, documentReceived: 0, documentStatus: 0, universityApplication: 0 },
    ytd: { applications: 0, scheduled: 0, consultationCompleted: 0, documentReceived: 0, documentStatus: 0, universityApplication: 0 },
    lifetime: { applications: 0, scheduled: 0, consultationCompleted: 0, documentReceived: 0, documentStatus: 0, universityApplication: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const calculatePeriodStats = (applications: any[], startDate: Date, endDate: Date): PeriodStats => {
    const filtered = applications.filter(app => {
      const createdAt = new Date(app.created_at);
      return createdAt >= startDate && createdAt <= endDate;
    });

    return {
      applications: filtered.length,
      scheduled: filtered.filter(app => app.session_booked).length,
      consultationCompleted: filtered.filter(app => app.consultation_completed).length,
      documentReceived: filtered.filter(app => app.documents_uploaded).length,
      documentStatus: filtered.filter(app => app.offer_letter_received || app.cas_received).length,
      universityApplication: filtered.filter(app => app.enrolled_university).length,
    };
  };

  const loadStats = async () => {
    try {
      const { data: applications, error } = await supabase
        .from('student_applications')
        .select('*');

      if (error) throw error;

      const now = new Date();
      const todayStart = startOfDay(now);
      const yesterdayStart = startOfDay(subDays(now, 1));
      const yesterdayEnd = startOfDay(now);
      const weekStart = startOfWeek(now);
      const monthStart = startOfMonth(now);
      const yearStart = startOfYear(now);
      const lifetimeStart = new Date(0);

      setStats({
        today: calculatePeriodStats(applications || [], todayStart, now),
        yesterday: calculatePeriodStats(applications || [], yesterdayStart, yesterdayEnd),
        thisWeek: calculatePeriodStats(applications || [], weekStart, now),
        thisMonth: calculatePeriodStats(applications || [], monthStart, now),
        ytd: calculatePeriodStats(applications || [], yearStart, now),
        lifetime: calculatePeriodStats(applications || [], lifetimeStart, now),
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  const periods = [
    { label: "Today", data: stats.today },
    { label: "Yesterday", data: stats.yesterday },
    { label: "This Week", data: stats.thisWeek },
    { label: "This Month", data: stats.thisMonth },
    { label: "YTD", data: stats.ytd },
    { label: "Life Time", data: stats.lifetime },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Application Statistics Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Application</TableHead>
                  <TableHead className="text-center font-semibold">Scheduled</TableHead>
                  <TableHead className="text-center font-semibold">Consultation Completed</TableHead>
                  <TableHead className="text-center font-semibold">Document Received</TableHead>
                  <TableHead className="text-center font-semibold">Document Status</TableHead>
                  <TableHead className="text-center font-semibold">University Application</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {periods.map((period) => (
                  <TableRow key={period.label}>
                    <TableCell className="font-medium">{period.label}</TableCell>
                    <TableCell className="text-center">{period.data.scheduled}</TableCell>
                    <TableCell className="text-center">{period.data.consultationCompleted}</TableCell>
                    <TableCell className="text-center">{period.data.documentReceived}</TableCell>
                    <TableCell className="text-center">{period.data.documentStatus}</TableCell>
                    <TableCell className="text-center">{period.data.universityApplication}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}