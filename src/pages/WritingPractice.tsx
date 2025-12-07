import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { PenTool, Clock, FileText, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

interface ChartData {
  name: string;
  value: number;
  year?: number;
}

interface Topic {
  task: number;
  topic: string;
  type: string;
  minWords: number;
  chartType?: "pie" | "bar" | "line" | "table";
  chartData?: ChartData[];
  chartData2?: ChartData[]; // For comparison charts (e.g., 1990 vs 2020)
  chartLabels?: { title?: string; title2?: string; xAxis?: string; yAxis?: string };
}

interface Feedback {
  taskAchievement: number;
  coherenceCohesion: number;
  lexicalResource: number;
  grammaticalRange: number;
  overallBand: number;
  feedback: string;
}

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
];

const WritingPractice = () => {
  const navigate = useNavigate();
  const [activeTask, setActiveTask] = useState<1 | 2>(1);
  const [task1Topic, setTask1Topic] = useState<Topic | null>(null);
  const [task2Topic, setTask2Topic] = useState<Topic | null>(null);
  const [task1Response, setTask1Response] = useState("");
  const [task2Response, setTask2Response] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [task1Feedback, setTask1Feedback] = useState<Feedback | null>(null);
  const [task2Feedback, setTask2Feedback] = useState<Feedback | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const generateTopic = async (taskNumber: 1 | 2) => {
    setIsGenerating(true);
    try {
      const chartTypes = ["pie", "bar", "line"];
      const randomChartType = chartTypes[Math.floor(Math.random() * chartTypes.length)];
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ielts-ai-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: taskNumber === 1 
                  ? `Generate a unique IELTS Academic Writing Task 1 topic with ACTUAL DATA for a ${randomChartType} chart.

Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{
  "task": 1,
  "topic": "The ${randomChartType} chart(s) below show [describe what the data represents]. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
  "type": "${randomChartType === 'pie' ? 'Pie Chart' : randomChartType === 'bar' ? 'Bar Chart' : 'Line Graph'}",
  "minWords": 150,
  "chartType": "${randomChartType}",
  "chartData": [{"name": "Category1", "value": 25}, {"name": "Category2", "value": 35}, ...],
  ${randomChartType === 'pie' ? '"chartData2": [{"name": "Category1", "value": 30}, {"name": "Category2", "value": 28}, ...],' : ''}
  "chartLabels": {"title": "Chart Title for Year 1", ${randomChartType === 'pie' ? '"title2": "Chart Title for Year 2",' : ''} "xAxis": "X Axis Label", "yAxis": "Y Axis Label (%)"}
}

Requirements:
- Use realistic data about topics like: spending, population, energy, education, employment, transport, etc.
- Include 4-6 data categories with realistic percentage/number values
- ${randomChartType === 'pie' ? 'For pie charts, include TWO datasets (chartData and chartData2) comparing two different years' : 'Include meaningful numerical data'}
- Values should add up logically (percentages should sum to ~100 for pie charts)
- Make it unique. Timestamp: ${Date.now()}`
                  : `Generate a unique IELTS Academic Writing Task 2 essay topic.

Return ONLY a valid JSON object (no markdown, no explanation):
{
  "task": 2,
  "topic": "Your essay question here. Give your opinion and support it with examples.",
  "type": "Opinion Essay",
  "minWords": 250
}

Make it about a current societal issue. Timestamp: ${Date.now()}`,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      
      if (data.error) {
        toast.error(data.error);
        setIsGenerating(false);
        return;
      }
      
      let topicData: Topic;

      try {
        const jsonMatch = data.response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          topicData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON found");
        }
      } catch {
        // Fallback with sample data
        topicData = {
          task: taskNumber,
          topic: taskNumber === 1 
            ? "The pie charts below show the distribution of household expenditure in a country in 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant."
            : data.response || "Some people believe that technology has made our lives more complex. To what extent do you agree or disagree?",
          type: taskNumber === 1 ? "Pie Chart" : "Opinion Essay",
          minWords: taskNumber === 1 ? 150 : 250,
          chartType: taskNumber === 1 ? "pie" : undefined,
          chartData: taskNumber === 1 ? [
            { name: "Housing", value: 32 },
            { name: "Food", value: 25 },
            { name: "Transport", value: 18 },
            { name: "Healthcare", value: 12 },
            { name: "Entertainment", value: 8 },
            { name: "Other", value: 5 },
          ] : undefined,
          chartData2: taskNumber === 1 ? [
            { name: "Housing", value: 28 },
            { name: "Food", value: 20 },
            { name: "Transport", value: 22 },
            { name: "Healthcare", value: 15 },
            { name: "Entertainment", value: 10 },
            { name: "Other", value: 5 },
          ] : undefined,
          chartLabels: taskNumber === 1 ? { title: "2000", title2: "2020", yAxis: "Percentage (%)" } : undefined,
        };
      }

      if (taskNumber === 1) {
        setTask1Topic(topicData);
        setTask1Response("");
        setTask1Feedback(null);
      } else {
        setTask2Topic(topicData);
        setTask2Response("");
        setTask2Feedback(null);
      }
      setStartTime(Date.now());
      toast.success(`New Task ${taskNumber} topic generated!`);
    } catch (error) {
      toast.error("Failed to generate topic. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const renderChart = (topic: Topic) => {
    if (!topic.chartData || !topic.chartType) return null;

    if (topic.chartType === "pie") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div>
            <h4 className="text-center font-medium mb-2">{topic.chartLabels?.title || "Dataset 1"}</h4>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={topic.chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {topic.chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {topic.chartData2 && (
            <div>
              <h4 className="text-center font-medium mb-2">{topic.chartLabels?.title2 || "Dataset 2"}</h4>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={topic.chartData2}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={90}
                    fill="#82ca9d"
                    dataKey="value"
                  >
                    {topic.chartData2.map((_, index) => (
                      <Cell key={`cell2-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      );
    }

    if (topic.chartType === "bar") {
      return (
        <div className="my-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topic.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: topic.chartLabels?.yAxis || "Value", angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="hsl(var(--primary))" name={topic.chartLabels?.title || "Value"} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (topic.chartType === "line") {
      return (
        <div className="my-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={topic.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: topic.chartLabels?.yAxis || "Value", angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} name={topic.chartLabels?.title || "Value"} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    }

    return null;
  };

  const evaluateResponse = async (taskNumber: 1 | 2) => {
    const response = taskNumber === 1 ? task1Response : task2Response;
    const topic = taskNumber === 1 ? task1Topic : task2Topic;

    if (!response.trim() || !topic) {
      toast.error("Please write your response first!");
      return;
    }

    const wordCount = response.trim().split(/\s+/).length;
    if (wordCount < topic.minWords) {
      toast.error(`Your response needs at least ${topic.minWords} words. Current: ${wordCount}`);
      return;
    }

    setIsEvaluating(true);
    try {
      const timeTaken = Math.floor((Date.now() - startTime) / 60000);
      const aiResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ielts-ai-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: `Evaluate this IELTS Writing Task ${taskNumber} response according to official IELTS criteria.

Topic: ${topic.topic}

Response: ${response}

Word Count: ${wordCount}
Time Taken: ${timeTaken} minutes

Provide scores (0-9 scale, use .5 increments) for:
1. Task Achievement/Response (0-9)
2. Coherence and Cohesion (0-9)
3. Lexical Resource (0-9)
4. Grammatical Range and Accuracy (0-9)

Calculate overall band score (average of 4 criteria).

Return as JSON: {"taskAchievement": X.X, "coherenceCohesion": X.X, "lexicalResource": X.X, "grammaticalRange": X.X, "overallBand": X.X, "feedback": "detailed feedback with strengths and areas for improvement"}`,
              },
            ],
          }),
        }
      );

      const data = await aiResponse.json();
      const jsonMatch = data.response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const feedback = JSON.parse(jsonMatch[0]);
        if (taskNumber === 1) {
          setTask1Feedback(feedback);
        } else {
          setTask2Feedback(feedback);
        }
        toast.success("Evaluation complete!");
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      toast.error("Failed to evaluate. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const renderFeedbackCard = (feedback: Feedback) => (
    <Card className="mt-4 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Your IELTS Band Score: {feedback.overallBand}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Task Achievement</p>
            <p className="text-2xl font-bold">{feedback.taskAchievement}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Coherence & Cohesion</p>
            <p className="text-2xl font-bold">{feedback.coherenceCohesion}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Lexical Resource</p>
            <p className="text-2xl font-bold">{feedback.lexicalResource}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Grammar Range & Accuracy</p>
            <p className="text-2xl font-bold">{feedback.grammaticalRange}</p>
          </div>
        </div>
        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-2">Detailed Feedback:</h4>
          <p className="text-sm whitespace-pre-wrap">{feedback.feedback}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-24 pb-12 px-4 max-w-7xl mx-auto w-full">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
              <PenTool className="h-10 w-10 text-primary" />
              IELTS Writing Practice
            </h1>
            <p className="text-xl text-muted-foreground">
              Unlimited AI-generated topics with instant band score feedback
            </p>
          </div>

          <Tabs value={activeTask.toString()} onValueChange={(v) => setActiveTask(parseInt(v) as 1 | 2)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="1">Task 1 (150+ words)</TabsTrigger>
              <TabsTrigger value="2">Task 2 (250+ words)</TabsTrigger>
            </TabsList>

            <TabsContent value="1" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Task 1: Academic Writing</CardTitle>
                    <Button onClick={() => generateTopic(1)} disabled={isGenerating}>
                      {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      <span className="ml-2">Generate New Topic</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {task1Topic ? (
                    <>
                      <div className="p-4 bg-secondary/20 rounded-lg">
                        <Badge className="mb-2">{task1Topic.type}</Badge>
                        <p className="text-lg">{task1Topic.topic}</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Minimum {task1Topic.minWords} words • Recommended time: 20 minutes
                        </p>
                      </div>

                      {/* Render the chart visualization */}
                      {task1Topic.chartData && (
                        <Card className="border-dashed">
                          <CardContent className="pt-4">
                            {renderChart(task1Topic)}
                          </CardContent>
                        </Card>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Your Response:</label>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              {getWordCount(task1Response)} words
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {Math.floor((Date.now() - startTime) / 60000)} min
                            </span>
                          </div>
                        </div>
                        <Textarea
                          value={task1Response}
                          onChange={(e) => setTask1Response(e.target.value)}
                          placeholder="Start writing your response here..."
                          className="min-h-[300px] font-mono"
                        />
                        {task1Topic.minWords && (
                          <Progress 
                            value={Math.min((getWordCount(task1Response) / task1Topic.minWords) * 100, 100)} 
                            className="h-2"
                          />
                        )}
                      </div>

                      <Button 
                        onClick={() => evaluateResponse(1)} 
                        disabled={isEvaluating || getWordCount(task1Response) < task1Topic.minWords}
                        className="w-full"
                        size="lg"
                      >
                        {isEvaluating ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            Evaluating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-5 w-5 mr-2" />
                            Get AI Evaluation & Band Score
                          </>
                        )}
                      </Button>

                      {task1Feedback && renderFeedbackCard(task1Feedback)}
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <PenTool className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">
                        Click "Generate New Topic" to start practicing
                      </p>
                      <Button onClick={() => generateTopic(1)} disabled={isGenerating}>
                        {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        <span className="ml-2">Generate Task 1 Topic</span>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="2" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Task 2: Essay Writing</CardTitle>
                    <Button onClick={() => generateTopic(2)} disabled={isGenerating}>
                      {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      <span className="ml-2">Generate New Topic</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {task2Topic ? (
                    <>
                      <div className="p-4 bg-secondary/20 rounded-lg">
                        <Badge className="mb-2">{task2Topic.type}</Badge>
                        <p className="text-lg">{task2Topic.topic}</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Minimum {task2Topic.minWords} words • Recommended time: 40 minutes
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Your Response:</label>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              {getWordCount(task2Response)} words
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {Math.floor((Date.now() - startTime) / 60000)} min
                            </span>
                          </div>
                        </div>
                        <Textarea
                          value={task2Response}
                          onChange={(e) => setTask2Response(e.target.value)}
                          placeholder="Start writing your response here..."
                          className="min-h-[400px] font-mono"
                        />
                        {task2Topic.minWords && (
                          <Progress 
                            value={Math.min((getWordCount(task2Response) / task2Topic.minWords) * 100, 100)} 
                            className="h-2"
                          />
                        )}
                      </div>

                      <Button 
                        onClick={() => evaluateResponse(2)} 
                        disabled={isEvaluating || getWordCount(task2Response) < task2Topic.minWords}
                        className="w-full"
                        size="lg"
                      >
                        {isEvaluating ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            Evaluating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-5 w-5 mr-2" />
                            Get AI Evaluation & Band Score
                          </>
                        )}
                      </Button>

                      {task2Feedback && renderFeedbackCard(task2Feedback)}
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <PenTool className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">
                        Click "Generate New Topic" to start practicing
                      </p>
                      <Button onClick={() => generateTopic(2)} disabled={isGenerating}>
                        {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        <span className="ml-2">Generate Task 2 Topic</span>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="bg-secondary/10">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">IELTS Writing Tips:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Task 1: Spend 20 minutes, write at least 150 words describing data accurately</li>
                <li>• Task 2: Spend 40 minutes, write at least 250 words with clear arguments</li>
                <li>• Use a variety of sentence structures and advanced vocabulary</li>
                <li>• Organize your ideas with clear paragraphs and linking words</li>
                <li>• Always proofread for grammar and spelling errors</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WritingPractice;
