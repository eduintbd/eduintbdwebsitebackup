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

  const generateContent = async () => {
    setIsGenerating(true);
    setIsSubmitted(false);
    setAnswers({});
    setShowTranscript(false);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ielts-ai-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
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

  const submitAnswers = () => {
    if (!content) return;

    const correctCount = content.questions.filter(
      q => answers[q.id] === q.correctAnswer
    ).length;

    setScore(correctCount);
    setIsSubmitted(true);
    toast.success(`You scored ${correctCount}/${content.questions.length}!`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 py-12 px-4 max-w-7xl mx-auto w-full">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
              <Headphones className="h-10 w-10 text-primary" />
              IELTS Listening Practice
            </h1>
            <p className="text-xl text-muted-foreground">
              AI-generated scenarios with text-to-speech audio
            </p>
          </div>

          <div className="flex justify-center">
            <Button onClick={generateContent} disabled={isGenerating} size="lg">
              {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
              <span className="ml-2">Generate New Listening Exercise</span>
            </Button>
          </div>

          {content && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl">{content.title}</h2>
                      <p className="text-sm text-muted-foreground mt-1">{content.scenario}</p>
                    </div>
                    <Badge variant="outline">
                      {content.questions.length} Questions
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button 
                      onClick={playAudio}
                      variant={isPlaying ? "destructive" : "default"}
                      size="lg"
                      className="flex-1"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="h-5 w-5 mr-2" />
                          Pause Audio
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5 mr-2" />
                          Play Audio
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={stopAudio}
                      variant="outline"
                      size="lg"
                    >
                      <RotateCcw className="h-5 w-5" />
                    </Button>
                    <Button 
                      onClick={() => setShowTranscript(!showTranscript)}
                      variant="outline"
                      size="lg"
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      {showTranscript ? "Hide" : "Show"} Transcript
                    </Button>
                  </div>

                  {showTranscript && (
                    <div className="p-4 bg-secondary/20 rounded-lg">
                      <h3 className="font-semibold mb-2">Transcript:</h3>
                      <p className="text-sm whitespace-pre-wrap">{content.transcript}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {content.questions.map((question) => (
                    <div key={question.id} className="space-y-3 p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium">
                          {question.id}. {question.question}
                        </h3>
                        {isSubmitted && (
                          <Badge variant={answers[question.id] === question.correctAnswer ? "default" : "destructive"}>
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
                              className={`cursor-pointer ${
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
                          <p className="text-muted-foreground">
                            {score === content.questions.length
                              ? "Perfect! Excellent listening skills!"
                              : score >= content.questions.length * 0.7
                              ? "Great job! Keep practicing!"
                              : "Good effort! Try listening to the audio again."}
                          </p>
                          <Button onClick={generateContent} className="mt-4">
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
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">IELTS Listening Tips:</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
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
              <CardContent className="text-center py-12">
                <Headphones className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
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
