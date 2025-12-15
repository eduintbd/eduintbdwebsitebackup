import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Timer, Trophy, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { useGameProgress } from "@/hooks/useGameProgress";
interface GrammarQuestion {
  sentence: string;
  options: string[];
  correct: string;
  explanation: string;
}

const baseGrammarQuestions: GrammarQuestion[] = [
  {
    sentence: "She ___ to the store yesterday.",
    options: ["go", "goes", "went", "gone"],
    correct: "went",
    explanation: "Past simple tense is used for completed actions in the past."
  },
  {
    sentence: "If I ___ rich, I would travel the world.",
    options: ["am", "was", "were", "be"],
    correct: "were",
    explanation: "In second conditional, we use 'were' for all subjects."
  },
  {
    sentence: "The book ___ on the table.",
    options: ["is laying", "is lying", "is lain", "is lay"],
    correct: "is lying",
    explanation: "'Lie' means to be in a horizontal position; 'lay' requires an object."
  },
  {
    sentence: "Neither the students nor the teacher ___ present.",
    options: ["was", "were", "are", "been"],
    correct: "was",
    explanation: "With 'neither...nor', the verb agrees with the nearest subject."
  },
  {
    sentence: "I have been living here ___ 2010.",
    options: ["for", "since", "from", "during"],
    correct: "since",
    explanation: "'Since' is used with a specific point in time."
  },
  {
    sentence: "She asked me where I ___.",
    options: ["live", "lived", "am living", "was living"],
    correct: "lived",
    explanation: "In reported speech, present tense becomes past tense."
  },
  {
    sentence: "The news ___ shocking.",
    options: ["was", "were", "are", "have been"],
    correct: "was",
    explanation: "'News' is an uncountable noun and takes a singular verb."
  },
  {
    sentence: "He is one of the students who ___ selected.",
    options: ["was", "were", "is", "has been"],
    correct: "were",
    explanation: "The relative pronoun 'who' refers to 'students' (plural)."
  },
  {
    sentence: "I wish I ___ taller.",
    options: ["am", "was", "were", "be"],
    correct: "were",
    explanation: "After 'wish', we use 'were' for unreal present situations."
  },
  {
    sentence: "By next year, I ___ here for ten years.",
    options: ["will work", "will be working", "will have worked", "would work"],
    correct: "will have worked",
    explanation: "Future perfect is used for actions completed before a future time."
  },
];

// Shuffle array utility function
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const GrammarBattle = () => {
  const navigate = useNavigate();
  const { saveGameSession } = useGameProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameState, setGameState] = useState<"ready" | "playing" | "finished">("ready");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const startTimeRef = useRef<number>(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<GrammarQuestion[]>([]);

  const currentQuestion = shuffledQuestions[currentIndex];
  const progress = shuffledQuestions.length > 0 ? ((currentIndex + 1) / shuffledQuestions.length) * 100 : 0;

  useEffect(() => {
    if (gameState !== "playing") return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("finished");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(answer);
    setShowExplanation(true);
    
    if (answer === currentQuestion.correct) {
      setScore((prev) => prev + 80);
      setCorrectCount((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex < shuffledQuestions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
      } else {
        setGameState("finished");
      }
    }, 2500);
  };

  const startGame = () => {
    // Shuffle questions and options
    const shuffled = shuffleArray(baseGrammarQuestions).map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));
    setShuffledQuestions(shuffled);
    setGameState("playing");
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(120);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCorrectCount(0);
    startTimeRef.current = Date.now();
  };

  // Save progress when game finishes
  useEffect(() => {
    if (gameState === "finished" && shuffledQuestions.length > 0) {
      const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      saveGameSession({
        gameType: "grammar-battle",
        score,
        totalQuestions: shuffledQuestions.length,
        correctAnswers: correctCount,
        durationSeconds,
      });
    }
  }, [gameState, score, correctCount, shuffledQuestions.length]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 py-4 sm:py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/ielts/gamified")}
            className="mb-4 sm:mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </Button>

          {gameState === "ready" && (
            <Card className="text-center p-6 sm:p-8">
              <div className="p-3 sm:p-4 rounded-full bg-blue-500/10 w-fit mx-auto mb-4 sm:mb-6">
                <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Grammar Battle</h1>
              <p className="text-muted-foreground mb-6">
                Fix sentences and prove your grammar mastery!
              </p>
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 text-center">
                <div className="p-3 sm:p-4 bg-muted rounded-lg">
                  <p className="text-lg sm:text-2xl font-bold">{baseGrammarQuestions.length}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Questions</p>
                </div>
                <div className="p-3 sm:p-4 bg-muted rounded-lg">
                  <p className="text-lg sm:text-2xl font-bold">120s</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Time Limit</p>
                </div>
                <div className="p-3 sm:p-4 bg-muted rounded-lg">
                  <p className="text-lg sm:text-2xl font-bold">800</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Max Points</p>
                </div>
              </div>
              <Button size="lg" onClick={startGame} className="gap-2 w-full sm:w-auto bg-blue-500 hover:bg-blue-600">
                <Shield className="w-4 h-4" />
                Start Battle
              </Button>
            </Card>
          )}

          {gameState === "playing" && currentQuestion && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="gap-1 text-sm sm:text-base">
                  <Timer className="w-4 h-4" />
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </Badge>
                <Badge className="bg-blue-500/10 text-blue-500 text-sm sm:text-base">
                  Score: {score}
                </Badge>
              </div>

              <Progress value={progress} className="h-2" />

              <Card className="p-4 sm:p-6">
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                  Question {currentIndex + 1} of {shuffledQuestions.length}
                </p>
                <h2 className="text-lg sm:text-xl font-medium text-center mb-6 sm:mb-8">
                  {currentQuestion.sentence}
                </h2>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {currentQuestion.options.map((option, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className={`h-auto py-3 sm:py-4 text-sm sm:text-base ${
                        selectedAnswer === option
                          ? option === currentQuestion.correct
                            ? "border-green-500 bg-green-500/10"
                            : "border-red-500 bg-red-500/10"
                          : selectedAnswer && option === currentQuestion.correct
                          ? "border-green-500 bg-green-500/10"
                          : ""
                      }`}
                      onClick={() => handleAnswer(option)}
                      disabled={selectedAnswer !== null}
                    >
                      {selectedAnswer && option === currentQuestion.correct && (
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      )}
                      {selectedAnswer === option && option !== currentQuestion.correct && (
                        <XCircle className="w-4 h-4 mr-2 text-red-500" />
                      )}
                      {option}
                    </Button>
                  ))}
                </div>
                
                {showExplanation && (
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-muted rounded-lg">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      <strong>Explanation:</strong> {currentQuestion.explanation}
                    </p>
                  </div>
                )}
              </Card>
            </div>
          )}

          {gameState === "finished" && (
            <Card className="text-center p-6 sm:p-8">
              <div className="p-3 sm:p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4 sm:mb-6">
                <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Battle Complete!</h1>
              <p className="text-4xl sm:text-5xl font-bold text-primary mb-4">{score}</p>
              <p className="text-muted-foreground mb-6">points earned</p>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                <div className="p-3 sm:p-4 bg-muted rounded-lg">
                  <p className="text-lg sm:text-2xl font-bold">{Math.round((score / 800) * 100)}%</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Accuracy</p>
                </div>
                <div className="p-3 sm:p-4 bg-muted rounded-lg">
                  <p className="text-lg sm:text-2xl font-bold">{120 - timeLeft}s</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Time Taken</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button onClick={startGame} className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Play Again
                </Button>
                <Button variant="outline" onClick={() => navigate("/ielts/gamified")}>
                  Back to Games
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GrammarBattle;
