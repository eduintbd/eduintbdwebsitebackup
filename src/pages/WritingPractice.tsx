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

interface Topic {
  task: number;
  topic: string;
  type: string;
  minWords: number;
}

interface Feedback {
  taskAchievement: number;
  coherenceCohesion: number;
  lexicalResource: number;
  grammaticalRange: number;
  overallBand: number;
  feedback: string;
}

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
                content: `Generate a unique IELTS Academic Writing Task ${taskNumber} topic. 
                ${taskNumber === 1 ? 'Include a data description task (graph, chart, table, diagram, or process). Provide specific details about what data to describe.' : 'Provide an opinion/discussion essay topic with clear instructions.'}
                Format: Return ONLY a JSON object with: {"task": ${taskNumber}, "topic": "the topic text", "type": "${taskNumber === 1 ? 'data description type' : 'essay type'}", "minWords": ${taskNumber === 1 ? 150 : 250}}
                Make it completely different from common topics. Use timestamp: ${Date.now()}`,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      let topicData: Topic;

      try {
        const jsonMatch = data.response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          topicData = JSON.parse(jsonMatch[0]);
        } else {
          topicData = {
            task: taskNumber,
            topic: data.response,
            type: taskNumber === 1 ? "Chart Description" : "Opinion Essay",
            minWords: taskNumber === 1 ? 150 : 250,
          };
        }
      } catch {
        topicData = {
          task: taskNumber,
          topic: data.response,
          type: taskNumber === 1 ? "Chart Description" : "Opinion Essay",
          minWords: taskNumber === 1 ? 150 : 250,
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
