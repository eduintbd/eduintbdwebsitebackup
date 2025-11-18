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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Lock, Save } from "lucide-react";

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
  const [user, setUser] = useState<any>(null);
  const [module, setModule] = useState<Module | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(Date.now());
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    checkUserAndFetchData();
  }, [moduleId]);

  const checkUserAndFetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
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

    if (!user) {
      const userAnswer = answers[currentQuestion.id];
      const isCorrect = currentQuestion.question_type === 'essay' ? null :
        userAnswer.toLowerCase().trim() === currentQuestion.correct_answer.toLowerCase().trim();

      setFeedback({
        ...feedback,
        [currentQuestion.id]: currentQuestion.question_type === 'essay' 
          ? "Sign in to get AI feedback on your essay!"
          : isCorrect ? "Correct!" : `Incorrect. ${currentQuestion.explanation}`,
      });

      setSubmitted({
        ...submitted,
        [currentQuestion.id]: true,
      });
      
      setShowLoginPrompt(true);
      return;
    }

    setLoading(true);

    try {
      const userAnswer = answers[currentQuestion.id];
      const isCorrect = currentQuestion.question_type === 'essay' ? null :
        userAnswer.toLowerCase().trim() === currentQuestion.correct_answer.toLowerCase().trim();

      await supabase.from("quiz_attempts").insert({
        user_id: user.id,
        module_id: moduleId,
        question_id: currentQuestion.id,
        user_answer: userAnswer,
        is_correct: isCorrect,
      });

      if (currentQuestion.question_type === 'essay') {
        const response = await supabase.functions.invoke('ielts-ai-feedback', {
          body: {
            question: currentQuestion.question_text,
            answer: userAnswer,
            module_type: module?.module_type,
          }
        });

        if (response.data?.feedback) {
          setFeedback({
            ...feedback,
            [currentQuestion.id]: response.data.feedback,
          });
        }
      } else {
        setFeedback({
          ...feedback,
          [currentQuestion.id]: isCorrect ? "Correct!" : `Incorrect. ${currentQuestion.explanation}`,
        });
      }

      setSubmitted({
        ...submitted,
        [currentQuestion.id]: true,
      });

      toast({
        title: "Answer Submitted",
        description: "Your progress has been saved!",
      });
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast({
        title: "Error",
        description: "Failed to submit answer",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteModule = async () => {
    if (!user) {
      toast({
        title: "Practice Complete!",
        description: "Sign up to save your progress and scores.",
      });
      navigate("/ielts-learning");
      return;
    }

    const answeredQuestions = Object.keys(answers).length;
    const correctAnswers = Object.entries(answers).filter(([qId]) => {
      const question = questions.find(q => q.id === qId);
      if (!question || question.question_type === 'essay') return false;
      return answers[qId]?.toLowerCase().trim() === question.correct_answer.toLowerCase().trim();
    }).length;

    const score = Math.round((correctAnswers / questions.length) * 100);
    const timeSpent = Math.round((Date.now() - startTime) / 1000);

    try {
      await supabase.from("user_progress").insert({
        user_id: user.id,
        module_id: moduleId,
        completed: true,
        score: score,
        time_spent: timeSpent,
      });

      toast({
        title: "Module Completed!",
        description: `You scored ${score}% on this module.`,
      });

      navigate("/ielts-learning");
    } catch (error) {
      console.error("Error completing module:", error);
      toast({
        title: "Error",
        description: "Failed to save progress",
        variant: "destructive",
      });
    }
  };

  const renderQuestionInput = () => {
    if (!currentQuestion) return null;

    const isSubmitted = submitted[currentQuestion.id];
    const questionFeedback = feedback[currentQuestion.id];

    switch (currentQuestion.question_type) {
      case "multiple_choice":
        return (
          <div className="space-y-4">
            <RadioGroup
              value={answers[currentQuestion.id] || ""}
              onValueChange={handleAnswerChange}
              disabled={isSubmitted}
            >
              {currentQuestion.options?.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case "fill_blank":
        return (
          <Input
            value={answers[currentQuestion.id] || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Type your answer..."
            disabled={isSubmitted}
          />
        );

      case "essay":
        return (
          <Textarea
            value={answers[currentQuestion.id] || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Write your essay here..."
            rows={10}
            disabled={isSubmitted}
          />
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <p>Module not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 py-12 px-4 max-w-4xl mx-auto w-full">
        <div className="space-y-6">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate("/ielts-learning")}
              className="mb-4"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Modules
            </Button>
            <h1 className="text-3xl font-bold">{module.title}</h1>
            <p className="text-muted-foreground mt-2">{module.description}</p>
          </div>

          {showLoginPrompt && !user && (
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                <Button variant="link" className="h-auto p-0" onClick={() => navigate("/login")}>
                  Create a free account
                </Button>{" "}
                to save your progress and get AI feedback on your essays!
              </AlertDescription>
            </Alert>
          )}

          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <Progress
                  value={((currentQuestionIndex + 1) / questions.length) * 100}
                  className="w-48"
                />
              </div>

              {currentQuestion && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      {currentQuestion.question_text}
                    </h2>
                    {renderQuestionInput()}
                  </div>

                  {feedback[currentQuestion.id] && (
                    <Alert className={
                      feedback[currentQuestion.id].includes("Correct") 
                        ? "border-green-500 bg-green-50" 
                        : "border-blue-500 bg-blue-50"
                    }>
                      {feedback[currentQuestion.id].includes("Correct") ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-blue-600" />
                      )}
                      <AlertDescription className="whitespace-pre-wrap">
                        {feedback[currentQuestion.id]}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex items-center justify-between gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                      disabled={currentQuestionIndex === 0}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>

                    <div className="flex gap-2">
                      {!submitted[currentQuestion.id] && (
                        <Button onClick={handleSubmitAnswer} disabled={loading}>
                          {user ? (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Submit & Save
                            </>
                          ) : (
                            "Check Answer"
                          )}
                        </Button>
                      )}

                      {currentQuestionIndex < questions.length - 1 ? (
                        <Button
                          onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                        >
                          Next
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      ) : (
                        <Button onClick={handleCompleteModule}>
                          {user ? "Complete Module" : "Finish Practice"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default IELTSModule;
