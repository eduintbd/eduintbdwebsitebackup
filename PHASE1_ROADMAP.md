# Phase 1 Implementation Roadmap: IELTS Learning Enhancement

## Overview
Comprehensive roadmap for implementing data persistence, progress tracking, and study planner integration for the IELTS Learning module.

---

## ✅ COMPLETED: Database Schema (Week 1 - Day 1-2)

### New Tables Created:
1. **`practice_sessions`** - Historical session tracking
   - Stores every practice attempt with detailed metrics
   - Enables trend analysis and performance tracking over time
   - RLS policies ensure users only see their own data

2. **`study_goals`** - User goal management
   - Track target scores, exam dates, module completion goals
   - Support different goal types: target_score, daily_practice, exam_date
   - Status tracking: active, completed, abandoned

3. **`study_schedules`** - Study session scheduling
   - Plan study sessions with specific dates/times
   - Link to goals and modules
   - Track completion and send reminders

### Analytics Views Created:
- **`user_performance_analytics`** - Overall user performance summary
- **`module_performance_by_type`** - Performance breakdown by module type (reading/writing/listening/speaking)

### Database Functions:
- **`calculate_study_streak()`** - Calculate consecutive days of practice
- **`get_weekly_progress()`** - Get 12-week progress summary

### Sample Data:
- 6 IELTS modules seeded (2 reading, 2 writing, 1 listening, 2 speaking)

---

## 🔄 IN PROGRESS: Frontend Integration (Week 1 - Day 3-5)

### Task 1.1: Update IELTSModule.tsx - Session Tracking
**Priority: CRITICAL**
**Estimated Time: 4 hours**

#### Changes Required:
```typescript
// Add session tracking state
const [sessionId, setSessionId] = useState<string | null>(null);

// Start session on module load
useEffect(() => {
  if (user && moduleId && questions.length > 0) {
    startPracticeSession();
  }
}, [user, moduleId, questions]);

const startPracticeSession = async () => {
  const { data, error } = await supabase
    .from('practice_sessions')
    .insert({
      user_id: user.id,
      module_id: moduleId,
      total_questions: questions.length,
      session_type: 'practice'
    })
    .select()
    .single();
    
  if (data) {
    setSessionId(data.id);
    setStartTime(Date.now());
  }
};

// Update session on completion
const handleCompleteModule = async () => {
  const timeSpent = (Date.now() - startTime) / 1000;
  const score = correctAnswers.length / questions.length * 100;

  if (user) {
    await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        module_id: moduleId,
        last_completed: new Date().toISOString(),
        score: Math.max(score, userProgress?.score || 0),
        completed: true,
      }, { onConflict: ['user_id', 'module_id'] });
  }
  
  if (sessionId) {
    await supabase
      .from('practice_sessions')
      .update({
        completed_at: new Date().toISOString(),
        duration_seconds: timeSpent,
        answered_questions: answeredQuestions,
        correct_answers: correctAnswers.length,
        score_percentage: score
      })
      .eq('id', sessionId);
  }
  
  // Keep existing user_progress update for backward compatibility
};
```

**Testing Checklist:**
- [ ] Session created when user starts module
- [ ] Session updated with correct metrics on completion
- [ ] Data persists in practice_sessions table
- [ ] Works for both authenticated and guest users (guest = no save)

---

### Task 1.2: Create Analytics Dashboard Component
**Priority: HIGH**
**Estimated Time: 6 hours**

#### New File: `src/components/ielts/AnalyticsDashboard.tsx`

```typescript
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface PerformanceData {
  total_sessions: number;
  avg_score: number;
  best_score: number;
  total_study_time_seconds: number;
  active_days: number;
  days_since_last_practice: number;
}

interface WeeklyData {
  week_start: string;
  sessions_count: number;
  avg_score: number;
  total_time_minutes: number;
}

export function AnalyticsDashboard({ userId }: { userId: string }) {
  const [performance, setPerformance] = useState<PerformanceData | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [userId]);

  const fetchAnalytics = async () => {
    // Fetch overall performance
    const { data: perfData } = await supabase
      .from('user_performance_analytics')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Fetch weekly progress using RPC
    const { data: weeklyData } = await supabase
      .rpc('get_weekly_progress', { p_user_id: userId });

    // Calculate streak using RPC
    const { data: streakData } = await supabase
      .rpc('calculate_study_streak', { p_user_id: userId });

    setPerformance(perfData);
    setWeeklyData(weeklyData || []);
    setStreak(streakData || 0);
    setLoading(false);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (loading) return <div>Loading analytics...</div>;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performance?.total_sessions || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performance?.avg_score?.toFixed(1) || 0}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatTime(performance?.total_study_time_seconds || 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streak} days 🔥</div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>12-Week Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week_start" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="avg_score" stroke="#8884d8" name="Avg Score %" />
              <Line type="monotone" dataKey="sessions_count" stroke="#82ca9d" name="Sessions" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Study Time Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Study Time (minutes)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week_start" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_time_minutes" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Integration:**
- Add as new tab in IELTSLearning.tsx called "Analytics"
- Require user authentication to view

---

### Task 1.3: Update IELTSLearning.tsx - Add Analytics Tab
**Priority: HIGH**
**Estimated Time: 2 hours**

#### Changes Required:
```typescript
import { AnalyticsDashboard } from "@/components/ielts/AnalyticsDashboard";

// Add "Analytics" to tabs array
<Tabs defaultValue="modules">
  <TabsList>
    <TabsTrigger value="modules">All Modules</TabsTrigger>
    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger> {/* NEW */}
    <TabsTrigger value="achievements">Achievements</TabsTrigger>
    <TabsTrigger value="focus">Focus Areas</TabsTrigger>
  </TabsList>
  
  {/* ... existing tabs ... */}
  
  <TabsContent value="analytics">
    {user ? (
      <AnalyticsDashboard userId={user.id} />
    ) : (
      <Card>
        <CardContent className="pt-6">
          <p>Sign in to view your detailed analytics and progress trends.</p>
        </CardContent>
      </Card>
    )}
  </TabsContent>
</Tabs>
```

---

### Task 1.4: Create Study Planner Component
**Priority: HIGH**
**Estimated Time: 8 hours**

#### New File: `src/components/ielts/StudyPlannerComponent.tsx`

**Features to Implement:**
1. **Goal Setting:**
   - Set target IELTS score
   - Set exam date
   - Set daily/weekly practice goals

2. **Study Schedule:**
   - Calendar view of scheduled sessions
   - Drag-and-drop scheduling
   - Link modules to specific dates

3. **Progress Toward Goals:**
   - Visual progress bars
   - Days remaining to exam
   - Completion percentage

**Pseudo-code:**
```typescript
export function StudyPlannerComponent({ userId }: { userId: string }) {
  // State for goals and schedules
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [schedules, setSchedules] = useState<StudySchedule[]>([]);
  
  // CRUD operations for goals
  const createGoal = async (goalData) => { /* ... */ };
  const updateGoal = async (goalId, updates) => { /* ... */ };
  const deleteGoal = async (goalId) => { /* ... */ };
  
  // CRUD operations for schedules
  const createSchedule = async (scheduleData) => { /* ... */ };
  const markScheduleComplete = async (scheduleId) => { /* ... */ };
  
  // UI Components:
  // - Goal creation form
  // - Active goals list with progress
  // - Calendar with scheduled sessions
  // - Upcoming sessions list
  
  return (
    <div className="space-y-6">
      <GoalSection goals={goals} onCreate={createGoal} />
      <ScheduleCalendar schedules={schedules} onCreate={createSchedule} />
      <UpcomingSessions schedules={schedules} onComplete={markScheduleComplete} />
    </div>
  );
}
```

---

### Task 1.5: Update StudyPlanner.tsx - Add Functional Planner
**Priority: MEDIUM**
**Estimated Time: 3 hours**

#### Changes:
- Keep existing marketing content
- Add authenticated section with actual planner component
- Show `StudyPlannerComponent` for logged-in users
- Show CTA to sign up for non-authenticated users

```typescript
{user ? (
  <StudyPlannerComponent userId={user.id} />
) : (
  /* Existing marketing content */
)}
```

---

## 🔄 NEXT STEPS: Testing & Refinement (Week 2)

### Task 2.1: Integration Testing
**Priority: CRITICAL**
**Estimated Time: 4 hours**

**Test Scenarios:**
1. New user signs up → Can they start practice sessions?
2. User completes module → Data saved to practice_sessions?
3. User views analytics → Charts rendering correctly?
4. User sets goals → Goals persist and track progress?
5. User schedules study time → Appears in calendar?

### Task 2.2: Data Validation & Error Handling
**Priority: HIGH**
**Estimated Time: 3 hours**

- Add error boundaries for analytics dashboard
- Handle empty state (no sessions yet)
- Validate goal inputs (dates in future, scores 0-9)
- Add loading states everywhere

### Task 2.3: Performance Optimization
**Priority: MEDIUM**
**Estimated Time: 2 hours**

- Cache analytics queries
- Optimize database indexes (already done in migration)
- Add pagination to session history
- Lazy load charts

---

## 📊 Success Metrics

### Data Persistence:
- ✅ All practice sessions stored in database
- ✅ Session history retrievable
- ✅ Data persists across sessions

### Progress Tracking:
- [ ] Users can view 12-week progress charts
- [ ] Streak calculation working
- [ ] Module performance breakdown visible
- [ ] Study time tracked accurately

### Study Planner:
- [ ] Users can create goals
- [ ] Users can schedule study sessions
- [ ] Progress toward goals visible
- [ ] Reminders for scheduled sessions (future enhancement)

---

## 🐛 Known Issues & Limitations

1. **Quiz Questions**: Need to seed actual questions for modules (currently empty)
2. **AI Feedback**: Requires LOVABLE_API_KEY configuration
3. **Reminders**: Email reminders for scheduled sessions not yet implemented
4. **Mobile UX**: Analytics dashboard needs mobile optimization

---

## 🚀 Phase 2 Preview (Next 2 Weeks)

1. **AI Evaluation Standardization**
   - Implement official IELTS band score rubrics
   - Calibrate AI feedback to match examiner standards
   - Add criterion-based evaluation (Task Achievement, Coherence, etc.)

2. **Detailed Feedback Enhancement**
   - Breakdown by IELTS criteria
   - Specific improvement suggestions
   - Sample answers at different band levels

3. **Enhanced Analytics**
   - Strength/weakness heatmaps
   - Predicted band score based on practice
   - Personalized study recommendations

---

## 📝 Code Review Checklist

Before marking Phase 1 complete:
- [ ] All database migrations run successfully
- [ ] RLS policies tested and secure
- [ ] Session tracking integrated in IELTSModule.tsx
- [ ] Analytics dashboard rendering correctly
- [ ] Study planner components created
- [ ] Error handling for all Supabase queries
- [ ] Loading states for all data fetching
- [ ] Mobile responsive design
- [ ] Accessibility (ARIA labels, keyboard navigation)
- [ ] Performance testing (no memory leaks, efficient queries)

---

## 🎯 Estimated Timeline

**Total Time for Phase 1:** 32 hours (4 working days at 8 hours/day)

| Task | Hours | Status |
|------|-------|--------|
| Database Schema | 4 | ✅ DONE |
| Session Tracking Integration | 4 | 🔄 TODO |
| Analytics Dashboard | 6 | 🔄 TODO |
| Analytics Tab Integration | 2 | 🔄 TODO |
| Study Planner Component | 8 | 🔄 TODO |
| Study Planner Page Update | 3 | 🔄 TODO |
| Testing & Refinement | 4 | 🔄 TODO |
| Data Validation | 3 | 🔄 TODO |
| Performance Optimization | 2 | 🔄 TODO |

**Next Implementation Session:** Start with Task 1.1 (Session Tracking)
