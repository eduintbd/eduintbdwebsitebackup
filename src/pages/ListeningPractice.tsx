import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Headphones, Play, Pause, RotateCcw, FileText, Sparkles, Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useSavePracticeSession } from "@/hooks/useSavePracticeSession";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface ListeningContent {
  title: string;
  scenario: string;
  transcript: string;
  questions: Question[];
}

const ListeningPractice = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState<ListeningContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesisUtterance | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const { saveSession } = useSavePracticeSession();

  const generateContent = async () => {
    setIsGenerating(true);
    setIsSubmitted(false);
    setAnswers({});
    setShowTranscript(false);
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
                content: `Generate a unique IELTS Listening practice scenario (${Date.now()}).

Create a realistic listening scenario (conversation, monologue, lecture, or discussion) with:
1. A title
2. A brief scenario description
3. A full transcript (200-300 words)
4. 6 multiple-choice questions about the content

Return as JSON:
{
  "title": "scenario title",
  "scenario": "brief description",
  "transcript": "full listening text",
  "questions": [
    {
      "id": 1,
      "question": "question text",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A"
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
        toast.success("New listening content generated!");
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const playAudio = () => {
    if (!content) return;

    if (isPlaying && speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(content.transcript);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    setSpeechSynthesis(utterance);
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const stopAudio = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const submitAnswers = async () => {
    if (!content) return;

    const correctCount = content.questions.filter(
      q => answers[q.id] === q.correctAnswer
    ).length;

    setScore(correctCount);
    setIsSubmitted(true);
    
    const durationSeconds = Math.floor((Date.now() - startTime) / 1000);
    
    // Save to database
    await saveSession({
      moduleType: "listening",
      totalQuestions: content.questions.length,
      correctAnswers: correctCount,
      durationSeconds,
      metadata: { title: content.title, scenario: content.scenario }
    });
    
    toast.success(`You scored ${correctCount}/${content.questions.length}!`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 py-6 sm:py-8 md:py-12 px-3 sm:px-4 max-w-7xl mx-auto w-full">
        <div className="space-y-4 sm:space-y-6">
          <div className="text-center space-y-2 px-2">
            <div className="flex flex-col items-center justify-center gap-2">
              <Headphones className="h-8 w-8 sm:h-10 sm:w-10 text-primary flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                IELTS Listening Practice
              </h1>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              AI-generated scenarios with text-to-speech audio
            </p>
          </div>

          <div className="flex justify-center px-2">
            <Button onClick={generateContent} disabled={isGenerating} size="lg" className="w-full sm:w-auto text-sm sm:text-base">
              {isGenerating ? <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> : <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />}
              <span className="ml-2">Generate New Listening Exercise</span>
            </Button>
          </div>

          {content && (
            <div className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                    <div className="flex-1">
                      <h2 className="text-lg sm:text-xl md:text-2xl">{content.title}</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">{content.scenario}</p>
                    </div>
                    <Badge variant="outline" className="w-fit">
                      {content.questions.length} Questions
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0 sm:pt-0">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      onClick={playAudio}
                      variant={isPlaying ? "destructive" : "default"}
                      size="lg"
                      className="flex-1 text-sm sm:text-base"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                          Pause Audio
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                          Play Audio
                        </>
                      )}
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        onClick={stopAudio}
                        variant="outline"
                        size="lg"
                        className="flex-1 sm:flex-none"
                      >
                        <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                      <Button 
                        onClick={() => setShowTranscript(!showTranscript)}
                        variant="outline"
                        size="lg"
                        className="flex-1 sm:flex-none text-sm sm:text-base"
                      >
                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
                        <span className="hidden sm:inline">{showTranscript ? "Hide" : "Show"} Transcript</span>
                      </Button>
                    </div>
                  </div>

                  {showTranscript && (
                    <div className="p-3 sm:p-4 bg-secondary/20 rounded-lg">
                      <h3 className="font-semibold mb-2 text-sm sm:text-base">Transcript:</h3>
                      <p className="text-xs sm:text-sm whitespace-pre-wrap">{content.transcript}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg">Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0 sm:pt-0">
                  {content.questions.map((question) => (
                    <div key={question.id} className="space-y-2 sm:space-y-3 p-3 sm:p-4 border rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <h3 className="font-medium text-sm sm:text-base">
                          {question.id}. {question.question}
                        </h3>
                        {isSubmitted && (
                          <Badge variant={answers[question.id] === question.correctAnswer ? "default" : "destructive"} className="w-fit">
                            {answers[question.id] === question.correctAnswer ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                          </Badge>
                        )}
                      </div>
                      <RadioGroup
                        value={answers[question.id] || ""}
                        onValueChange={(value) => handleAnswerChange(question.id, value)}
                        disabled={isSubmitted}
                      >
                        {question.options.map((option, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`q${question.id}-${idx}`} />
                            <Label 
                              htmlFor={`q${question.id}-${idx}`}
                              className={`cursor-pointer text-sm sm:text-base ${
                                isSubmitted && option === question.correctAnswer
                                  ? "text-green-600 font-semibold"
                                  : isSubmitted && answers[question.id] === option && option !== question.correctAnswer
                                  ? "text-destructive"
                                  : ""
                              }`}
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}

                  {!isSubmitted ? (
                    <Button 
                      onClick={submitAnswers}
                      disabled={Object.keys(answers).length < content.questions.length}
                      className="w-full text-sm sm:text-base"
                      size="lg"
                    >
                      <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Submit Answers
                    </Button>
                  ) : (
                    <Card className="border-primary/20">
                      <CardContent className="p-4 sm:pt-6">
                        <div className="text-center space-y-2">
                          <h3 className="text-xl sm:text-2xl font-bold">
                            Your Score: {score}/{content.questions.length}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {score === content.questions.length
                              ? "Perfect! Excellent listening skills!"
                              : score >= content.questions.length * 0.7
                              ? "Great job! Keep practicing!"
                              : "Good effort! Try listening to the audio again."}
                          </p>
                          <Button onClick={generateContent} className="mt-4 text-sm">
                            <Sparkles className="h-4 w-4 mr-2" />
                            Try New Exercise
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-secondary/10">
                <CardContent className="p-4 sm:pt-6">
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">IELTS Listening Tips:</h3>
                  <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                    <li>• You can play the audio as many times as you need</li>
                    <li>• Read the questions before listening to know what to focus on</li>
                    <li>• Pay attention to keywords and synonyms</li>
                    <li>• Listen for specific information like names, numbers, and dates</li>
                    <li>• Check the transcript after answering to learn from mistakes</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {!content && !isGenerating && (
            <Card>
              <CardContent className="text-center py-8 sm:py-12">
                <Headphones className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-muted-foreground mb-4 px-2">
                  Click "Generate New Listening Exercise" to start practicing
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

export default ListeningPractice;
