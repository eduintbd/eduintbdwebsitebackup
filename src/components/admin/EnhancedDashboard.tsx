import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, FileText, CheckCircle, Clock } from "lucide-react";

interface DashboardStats {
  totalStudents: number;
  activeApplications: number;
  visaApproved: number;
  pendingFollowup: number;
}

export function EnhancedDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeApplications: 0,
    visaApproved: 0,
    pendingFollowup: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data: applications } = await supabase
        .from("student_applications")
        .select("lifecycle_stage, visa_status, priority_level, updated_at");

      if (!applications) return;

      const activeStages = ["Application", "Counseling", "Qualification"];
      const stats: DashboardStats = {
        totalStudents: applications.length,
        activeApplications: applications.filter((app) =>
          activeStages.includes(app.lifecycle_stage || "")
        ).length,
        visaApproved: applications.filter((app) => app.visa_status === "approved").length,
        pendingFollowup: applications.filter((app) => {
          const daysSinceUpdate = app.updated_at
            ? Math.floor((Date.now() - new Date(app.updated_at).getTime()) / (1000 * 60 * 60 * 24))
            : 0;
          return app.priority_level === "high" && daysSinceUpdate > 3;
        }).length,
      };

      setStats(stats);
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      title: "Active Applications",
      value: stats.activeApplications,
      icon: FileText,
      gradient: "from-purple-500/20 to-pink-500/20",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
    },
    {
      title: "Visa Approved",
      value: stats.visaApproved,
      icon: CheckCircle,
      gradient: "from-green-500/20 to-emerald-500/20",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-500",
    },
    {
      title: "Pending Follow-up",
      value: stats.pendingFollowup,
      icon: Clock,
      gradient: "from-orange-500/20 to-red-500/20",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="backdrop-blur-sm bg-card/50 animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 w-24 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className={`backdrop-blur-sm bg-gradient-to-br ${stat.gradient} border-white/20 hover:scale-105 transition-all duration-300 hover:shadow-xl`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                <Icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
