import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Square, Play, Sparkles, Loader2, Clock } from "lucide-react";
import { toast } from "sonner";
import { useSavePracticeSession } from "@/hooks/useSavePracticeSession";

interface Topic {
  part: number;
  topic: string;
  questions: string[];
  timeLimit: number;
}

interface Feedback {
  fluencyCoherence: number;
  lexicalResource: number;
  grammaticalRange: number;
  pronunciation: number;
  overallBand: number;
  feedback: string;
}

const SpeakingPractice = () => {
  const navigate = useNavigate();
  const [activePart, setActivePart] = useState<1 | 2 | 3>(1);
  const [topics, setTopics] = useState<Record<1 | 2 | 3, Topic | null>>({
    1: null,
    2: null,
    3: null,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState<Record<number, Feedback | null>>({
    1: null,
    2: null,
    3: null,
  });
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { saveSession } = useSavePracticeSession();

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(prev => prev + finalTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          toast.error('Speech recognition error. Please try again.');
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const generateTopic = async (part: 1 | 2 | 3) => {
    setIsGenerating(true);
    try {
      const partDescriptions = {
        1: "Introduction and interview questions (4-5 minutes). Ask 3-4 general questions about familiar topics like home, family, work, studies, or interests.",
        2: "Individual long turn (3-4 minutes). Provide a topic card with specific points to cover and 1 minute preparation time, then speak for 1-2 minutes.",
        3: "Two-way discussion (4-5 minutes). Provide 3-4 abstract questions related to Part 2 topic for detailed discussion.",
      };

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
                content: `Generate a unique IELTS Speaking Part ${part} topic (${Date.now()}).

${partDescriptions[part]}

Return as JSON:
{
  "part": ${part},
  "topic": "main topic/title",
  "questions": ["question 1", "question 2", ...],
  "timeLimit": ${part === 1 ? 300 : part === 2 ? 240 : 300}
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
        const topicData = JSON.parse(jsonMatch[0]);
        setTopics(prev => ({ ...prev, [part]: topicData }));
        setTranscript("");
        setFeedback(prev => ({ ...prev, [part]: null }));
        toast.success(`Part ${part} topic generated!`);
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      toast.error("Failed to generate topic. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      setTranscript("");
      setRecordingTime(0);
      setIsRecording(true);

      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      mediaRecorder.start();
      toast.success("Recording started! Speak now.");
    } catch (error) {
      toast.error("Failed to access microphone. Please allow microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setIsRecording(false);
    toast.success("Recording stopped!");
  };

  const evaluateResponse = async (part: 1 | 2 | 3) => {
    const topic = topics[part];

    if (!transcript.trim() || !topic) {
      toast.error("Please record your response first!");
      return;
    }

    setIsEvaluating(true);
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
                content: `Evaluate this IELTS Speaking Part ${part} response according to official IELTS criteria.

Topic: ${topic.topic}
Questions: ${topic.questions.join(", ")}

Transcript: ${transcript}

Duration: ${recordingTime} seconds

Provide scores (0-9 scale, use .5 increments) for:
1. Fluency and Coherence (0-9)
2. Lexical Resource (0-9)
3. Grammatical Range and Accuracy (0-9)
4. Pronunciation (0-9)

Calculate overall band score (average of 4 criteria).

Return as JSON: {"fluencyCoherence": X.X, "lexicalResource": X.X, "grammaticalRange": X.X, "pronunciation": X.X, "overallBand": X.X, "feedback": "detailed feedback with strengths and areas for improvement"}`,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const jsonMatch = data.response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const feedbackData = JSON.parse(jsonMatch[0]);
        setFeedback(prev => ({ ...prev, [part]: feedbackData }));
        
        // Save to database - convert band score to percentage (band 9 = 100%)
        const scorePercentage = (feedbackData.overallBand / 9) * 100;
        
        await saveSession({
          moduleType: "speaking",
          totalQuestions: topic.questions.length,
          correctAnswers: topic.questions.length,
          durationSeconds: recordingTime,
          metadata: { 
            part, 
            topic: topic.topic,
            overallBand: feedbackData.overallBand,
            fluencyCoherence: feedbackData.fluencyCoherence,
            lexicalResource: feedbackData.lexicalResource,
            grammaticalRange: feedbackData.grammaticalRange,
            pronunciation: feedbackData.pronunciation,
            scorePercentage: Math.round(scorePercentage)
          }
        });
        
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderFeedbackCard = (feedbackData: Feedback) => (
    <Card className="mt-4 border-primary/20">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Your IELTS Band Score: {feedbackData.overallBand}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0 sm:pt-0">
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground">Fluency & Coherence</p>
            <p className="text-xl sm:text-2xl font-bold">{feedbackData.fluencyCoherence}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground">Lexical Resource</p>
            <p className="text-xl sm:text-2xl font-bold">{feedbackData.lexicalResource}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground">Grammar Range & Accuracy</p>
            <p className="text-xl sm:text-2xl font-bold">{feedbackData.grammaticalRange}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground">Pronunciation</p>
            <p className="text-xl sm:text-2xl font-bold">{feedbackData.pronunciation}</p>
          </div>
        </div>
        <div className="pt-3 sm:pt-4 border-t">
          <h4 className="font-semibold mb-2 text-sm sm:text-base">Detailed Feedback:</h4>
          <p className="text-xs sm:text-sm whitespace-pre-wrap">{feedbackData.feedback}</p>
        </div>
      </CardContent>
    </Card>
  );

  const renderPartContent = (part: 1 | 2 | 3) => {
    const topic = topics[part];
    const partFeedback = feedback[part];

    return (
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <CardTitle className="text-base sm:text-lg">Part {part}: {part === 1 ? "Interview" : part === 2 ? "Long Turn" : "Discussion"}</CardTitle>
            <Button onClick={() => generateTopic(part)} disabled={isGenerating} className="w-full sm:w-auto text-sm">
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span className="ml-2">New Topic</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0 sm:pt-0">
          {topic ? (
            <>
              <div className="p-3 sm:p-4 bg-secondary/20 rounded-lg space-y-2">
                <h3 className="font-semibold text-base sm:text-lg">{topic.topic}</h3>
                <div className="space-y-1">
                  {topic.questions.map((q, idx) => (
                    <p key={idx} className="text-xs sm:text-sm">• {q}</p>
                  ))}
                </div>
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {Math.floor(topic.timeLimit / 60)} minutes
                </Badge>
              </div>

              <div className="flex gap-2">
                {!isRecording ? (
                  <Button onClick={startRecording} size="lg" className="flex-1 text-sm sm:text-base">
                    <Mic className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Start Recording
                  </Button>
                ) : (
                  <Button onClick={stopRecording} variant="destructive" size="lg" className="flex-1 text-sm sm:text-base">
                    <Square className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    <span className="hidden sm:inline">Stop Recording </span>({formatTime(recordingTime)})
                  </Button>
                )}
              </div>

              {transcript && (
                <div className="p-3 sm:p-4 bg-secondary/20 rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Your Transcript:</h4>
                  <p className="text-xs sm:text-sm whitespace-pre-wrap">{transcript}</p>
                </div>
              )}

              {transcript && !isRecording && (
                <Button 
                  onClick={() => evaluateResponse(part)} 
                  disabled={isEvaluating}
                  className="w-full text-sm sm:text-base"
                  size="lg"
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" />
                      Evaluating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Get AI Evaluation & Band Score
                    </>
                  )}
                </Button>
              )}

              {partFeedback && renderFeedbackCard(partFeedback)}
            </>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <Mic className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base text-muted-foreground mb-4 px-2">
                Click "New Topic" to start practicing Part {part}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 py-6 sm:py-8 md:py-12 px-3 sm:px-4 max-w-7xl mx-auto w-full">
        <div className="space-y-4 sm:space-y-6">
          <div className="text-center space-y-2 px-2">
            <div className="flex flex-col items-center justify-center gap-2">
              <Mic className="h-8 w-8 sm:h-10 sm:w-10 text-primary flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                IELTS Speaking Practice
              </h1>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              Record your responses with voice recognition and get AI band scores
            </p>
          </div>

          <Tabs value={activePart.toString()} onValueChange={(v) => setActivePart(parseInt(v) as 1 | 2 | 3)}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="1" className="text-sm sm:text-base">Part 1</TabsTrigger>
              <TabsTrigger value="2" className="text-sm sm:text-base">Part 2</TabsTrigger>
              <TabsTrigger value="3" className="text-sm sm:text-base">Part 3</TabsTrigger>
            </TabsList>

            <TabsContent value="1">{renderPartContent(1)}</TabsContent>
            <TabsContent value="2">{renderPartContent(2)}</TabsContent>
            <TabsContent value="3">{renderPartContent(3)}</TabsContent>
          </Tabs>

          <Card className="bg-secondary/10">
            <CardContent className="p-4 sm:pt-6">
              <h3 className="font-semibold mb-2 text-sm sm:text-base">IELTS Speaking Tips:</h3>
              <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                <li>• Part 1: Answer questions naturally, extend your answers with examples</li>
                <li>• Part 2: Take notes during 1-minute preparation, speak for full 2 minutes</li>
                <li>• Part 3: Give detailed opinions with reasons and examples</li>
                <li>• Speak clearly and at natural pace, use varied vocabulary and grammar</li>
                <li>• Allow microphone access for speech recognition to work</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SpeakingPractice;
