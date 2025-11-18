import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react";

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  correct_answer: string;
  options: any;
  explanation: string;
  points: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  module_type: string;
  difficulty: string;
  content: any;
}

const IELTSModule = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [module, setModule] = useState<Module | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    checkUserAndFetchData();
  }, [moduleId]);

  const checkUserAndFetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }
    setUser(user);
    await fetchModuleData();
  };

  const fetchModuleData = async () => {
    try {
      const { data: moduleData } = await supabase
        .from("ielts_modules")
        .select("*")
        .eq("id", moduleId)
        .single();

      const { data: questionsData } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("module_id", moduleId);

      setModule(moduleData);
      setQuestions(questionsData || []);
    } catch (error) {
      console.error("Error fetching module:", error);
      toast({
        title: "Error",
        description: "Failed to load module",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerChange = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !answers[currentQuestion.id]) {
      toast({
        title: "No answer provided",
        description: "Please provide an answer before submitting",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const userAnswer = answers[currentQuestion.id];
      const isCorrect = currentQuestion.question_type === 'essay' ? null :
        userAnswer.toLowerCase().trim() === currentQuestion.correct_answer.toLowerCase().trim();

      // Save attempt to database
      await supabase.from("quiz_attempts").insert({
        user_id: user.id,
        module_id: moduleId,
        question_id: currentQuestion.id,
        user_answer: userAnswer,
        is_correct: isCorrect,
      });

      // Get AI feedback
      const { data: feedbackData, error } = await supabase.functions.invoke('ielts-ai-feedback', {
        body: {
          userAnswer,
          correctAnswer: currentQuestion.correct_answer,
          questionText: currentQuestion.question_text,
          questionType: currentQuestion.question_type,
          moduleType: module?.module_type,
        },
      });

      if (error) throw error;

      setFeedback({
        ...feedback,
        [currentQuestion.id]: feedbackData.feedback,
      });

      setSubmitted({
        ...submitted,
        [currentQuestion.id]: true,
      });

      toast({
        title: "Answer submitted",
        description: "AI feedback generated successfully",
      });
    } catch (error: any) {
      console.error("Error submitting answer:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit answer",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinish = async () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const totalQuestions = questions.length;
    const answeredQuestions = Object.keys(answers).length;
    
    if (answeredQuestions < totalQuestions) {
      toast({
        title: "Incomplete quiz",
        description: `You have ${totalQuestions - answeredQuestions} unanswered questions`,
        variant: "destructive",
      });
      return;
    }

    // Calculate score
    let correctAnswers = 0;
    questions.forEach((q) => {
      if (q.question_type !== 'essay') {
        const userAnswer = answers[q.id];
        if (userAnswer?.toLowerCase().trim() === q.correct_answer.toLowerCase().trim()) {
          correctAnswers++;
        }
      }
    });

    const score = Math.round((correctAnswers / questions.filter(q => q.question_type !== 'essay').length) * 100);

    // Save progress
    await supabase.from("user_progress").upsert({
      user_id: user.id,
      module_id: moduleId,
      completed: true,
      score,
      time_spent: timeSpent,
      completed_at: new Date().toISOString(),
    });

    // Check for achievements
    if (score >= 90) {
      await supabase.from("achievements").insert({
        user_id: user.id,
        achievement_type: "high_score",
        title: "Excellence Award",
        description: `Scored ${score}% on ${module?.title}`,
        badge_icon: "🏆",
      });
    }

    toast({
      title: "Module completed!",
      description: `Your score: ${score}%`,
    });

    navigate("/ielts-learning");
  };

  if (loading || !module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading module...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">{module.title}</h2>
            <p className="text-muted-foreground mb-6">{module.description}</p>
            <p className="text-muted-foreground">No questions available for this module yet.</p>
            <Button className="mt-6" onClick={() => navigate("/ielts-learning")}>
              Back to Dashboard
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/ielts-learning")}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="p-8 max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
            <p className="text-muted-foreground mb-4">{module.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span className="capitalize">{module.module_type}</span>
              <span className="capitalize">{module.difficulty}</span>
            </div>
            <Progress value={progress} className="mb-2" />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">{currentQuestion.question_text}</h3>
              
              {currentQuestion.question_type === 'multiple_choice' && (
                <RadioGroup
                  value={answers[currentQuestion.id] || ""}
                  onValueChange={handleAnswerChange}
                  disabled={submitted[currentQuestion.id]}
                >
                  {currentQuestion.options?.map((option: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg mb-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {currentQuestion.question_type === 'true_false' && (
                <RadioGroup
                  value={answers[currentQuestion.id] || ""}
                  onValueChange={handleAnswerChange}
                  disabled={submitted[currentQuestion.id]}
                >
                  {['True', 'False'].map((option) => (
                    <div key={option} className="flex items-center space-x-2 p-3 border rounded-lg mb-2">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {currentQuestion.question_type === 'fill_blank' && (
                <Input
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  disabled={submitted[currentQuestion.id]}
                  placeholder="Type your answer..."
                  className="w-full"
                />
              )}

              {currentQuestion.question_type === 'essay' && (
                <Textarea
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  disabled={submitted[currentQuestion.id]}
                  placeholder="Write your essay here..."
                  className="w-full min-h-[200px]"
                />
              )}
            </div>

            {submitted[currentQuestion.id] && feedback[currentQuestion.id] && (
              <Card className="p-4 bg-muted/50">
                <div className="flex items-start gap-2">
                  {currentQuestion.question_type !== 'essay' && 
                   answers[currentQuestion.id]?.toLowerCase().trim() === currentQuestion.correct_answer.toLowerCase().trim() ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  ) : (
                    <XCircle className="w-5 h-5 text-yellow-600 mt-1" />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">AI Feedback:</h4>
                    <p className="text-sm">{feedback[currentQuestion.id]}</p>
                  </div>
                </div>
              </Card>
            )}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {!submitted[currentQuestion.id] && (
                <Button onClick={handleSubmitAnswer} disabled={!answers[currentQuestion.id]}>
                  Submit Answer
                </Button>
              )}

              {currentQuestionIndex < questions.length - 1 ? (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleFinish} variant="default">
                  Finish Module
                </Button>
              )}
            </div>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default IELTSModule;
