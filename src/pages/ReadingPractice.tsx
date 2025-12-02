import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Sparkles, Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: number;
  type: "multiple-choice" | "true-false-not-given" | "fill-in-blank";
  question: string;
  options?: string[];
  correctAnswer: string;
}

interface ReadingContent {
  title: string;
  passage: string;
  questions: Question[];
}

const ReadingPractice = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState<ReadingContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const generateContent = async () => {
    setIsGenerating(true);
    setIsSubmitted(false);
    setAnswers({});
    setStartTime(Date.now());
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
                content: `Generate a unique IELTS Academic Reading passage (${Date.now()}).

Create a realistic academic passage (400-500 words) on a unique topic with:
1. A clear title
2. Full passage text with multiple paragraphs
3. 8 mixed questions including:
   - 3 multiple-choice questions
   - 3 True/False/Not Given questions
   - 2 fill-in-the-blank questions

Return as JSON:
{
  "title": "passage title",
  "passage": "full passage text with multiple paragraphs",
  "questions": [
    {
      "id": 1,
      "type": "multiple-choice",
      "question": "question text",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A"
    },
    {
      "id": 2,
      "type": "true-false-not-given",
      "question": "statement",
      "options": ["True", "False", "Not Given"],
      "correctAnswer": "True"
    },
    {
      "id": 3,
      "type": "fill-in-blank",
      "question": "Complete the sentence: The study found that ____.",
      "correctAnswer": "answer"
    }
  ]
}

Make it completely unique and realistic for IELTS Academic.`,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const jsonMatch = data.response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedContent = JSON.parse(jsonMatch[0]);
        setContent(parsedContent);
        toast.success("New reading passage generated!");
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const submitAnswers = () => {
    if (!content) return;

    const correctCount = content.questions.filter(
      q => {
        const userAnswer = answers[q.id]?.toLowerCase().trim();
        const correctAnswer = q.correctAnswer.toLowerCase().trim();
        return userAnswer === correctAnswer;
      }
    ).length;

    setScore(correctCount);
    setIsSubmitted(true);
    const timeTaken = Math.floor((Date.now() - startTime) / 60000);
    toast.success(`You scored ${correctCount}/${content.questions.length} in ${timeTaken} minutes!`);
  };

  const isAnswerCorrect = (questionId: number) => {
    const question = content?.questions.find(q => q.id === questionId);
    if (!question) return false;
    return answers[questionId]?.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 py-12 px-4 max-w-7xl mx-auto w-full">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
              <BookOpen className="h-10 w-10 text-primary" />
              IELTS Reading Practice
            </h1>
            <p className="text-xl text-muted-foreground">
              AI-generated passages with mixed question types
            </p>
          </div>

          <div className="flex justify-center">
            <Button onClick={generateContent} disabled={isGenerating} size="lg">
              {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
              <span className="ml-2">Generate New Reading Passage</span>
            </Button>
          </div>

          {content && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="md:sticky md:top-4 h-fit">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{content.title}</CardTitle>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {Math.floor((Date.now() - startTime) / 60000)} min
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {content.passage.split('\n\n').map((para, idx) => (
                      <p key={idx} className="mb-4 text-sm leading-relaxed">
                        {para}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Questions ({content.questions.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {content.questions.map((question) => (
                      <div key={question.id} className="space-y-3 p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Badge variant="outline" className="mb-2">
                              {question.type === "multiple-choice" ? "Multiple Choice" :
                               question.type === "true-false-not-given" ? "T/F/NG" :
                               "Fill in Blank"}
                            </Badge>
                            <h3 className="font-medium">
                              {question.id}. {question.question}
                            </h3>
                          </div>
                          {isSubmitted && (
                            <Badge variant={isAnswerCorrect(question.id) ? "default" : "destructive"}>
                              {isAnswerCorrect(question.id) ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <XCircle className="h-4 w-4" />
                              )}
                            </Badge>
                          )}
                        </div>

                        {question.type === "fill-in-blank" ? (
                          <div className="space-y-2">
                            <Input
                              value={answers[question.id] || ""}
                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                              disabled={isSubmitted}
                              placeholder="Type your answer..."
                              className={
                                isSubmitted
                                  ? isAnswerCorrect(question.id)
                                    ? "border-green-500"
                                    : "border-destructive"
                                  : ""
                              }
                            />
                            {isSubmitted && !isAnswerCorrect(question.id) && (
                              <p className="text-sm text-green-600">
                                Correct answer: {question.correctAnswer}
                              </p>
                            )}
                          </div>
                        ) : (
                          <RadioGroup
                            value={answers[question.id] || ""}
                            onValueChange={(value) => handleAnswerChange(question.id, value)}
                            disabled={isSubmitted}
                          >
                            {question.options?.map((option, idx) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`q${question.id}-${idx}`} />
                                <Label 
                                  htmlFor={`q${question.id}-${idx}`}
                                  className={`cursor-pointer ${
                                    isSubmitted && option === question.correctAnswer
                                      ? "text-green-600 font-semibold"
                                      : isSubmitted && answers[question.id] === option && !isAnswerCorrect(question.id)
                                      ? "text-destructive"
                                      : ""
                                  }`}
                                >
                                  {option}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        )}
                      </div>
                    ))}

                    {!isSubmitted ? (
                      <Button 
                        onClick={submitAnswers}
                        disabled={Object.keys(answers).length < content.questions.length}
                        className="w-full"
                        size="lg"
                      >
                        <Sparkles className="h-5 w-5 mr-2" />
                        Submit Answers
                      </Button>
                    ) : (
                      <Card className="border-primary/20">
                        <CardContent className="pt-6">
                          <div className="text-center space-y-2">
                            <h3 className="text-2xl font-bold">
                              Your Score: {score}/{content.questions.length}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Time: {Math.floor((Date.now() - startTime) / 60000)} minutes
                            </p>
                            <p className="text-muted-foreground">
                              {score === content.questions.length
                                ? "Perfect! Outstanding reading comprehension!"
                                : score >= content.questions.length * 0.7
                                ? "Great job! Keep practicing!"
                                : "Good effort! Review the passage and try again."}
                            </p>
                            <Button onClick={generateContent} className="mt-4">
                              <Sparkles className="h-4 w-4 mr-2" />
                              Try New Passage
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-secondary/10">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">IELTS Reading Tips:</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Skim the passage first to understand the main idea</li>
                      <li>• Read questions carefully before searching for answers</li>
                      <li>• For T/F/NG: True = statement matches passage, False = contradicts, NG = no information</li>
                      <li>• Manage your time: aim for 20 minutes per passage</li>
                      <li>• Use keywords to locate information quickly</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {!content && !isGenerating && (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Click "Generate New Reading Passage" to start practicing
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReadingPractice;
