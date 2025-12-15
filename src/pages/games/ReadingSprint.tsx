import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Timer, Trophy, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { useGameProgress } from "@/hooks/useGameProgress";

interface ReadingQuestion {
  passage: string;
  question: string;
  options: string[];
  correct: string;
}

const baseReadingQuestions: ReadingQuestion[] = [
  {
    passage: "The Amazon rainforest, often referred to as the 'lungs of the Earth,' produces approximately 20% of the world's oxygen. However, deforestation has significantly reduced its size over the past few decades.",
    question: "What is the Amazon rainforest commonly called?",
    options: ["The Green Paradise", "The Lungs of the Earth", "The Oxygen Factory", "The World's Garden"],
    correct: "The Lungs of the Earth"
  },
  {
    passage: "Scientists have discovered that honey never spoils. Archaeologists have found 3,000-year-old honey in Egyptian tombs that was still perfectly edible. This is because honey has a unique chemical composition that prevents bacterial growth.",
    question: "Why doesn't honey spoil?",
    options: ["It's kept in sealed containers", "Its unique chemical composition prevents bacteria", "It contains preservatives", "It's too sweet for bacteria"],
    correct: "Its unique chemical composition prevents bacteria"
  },
  {
    passage: "The Great Wall of China is not visible from space with the naked eye, contrary to popular belief. This myth has been debunked by astronauts who have confirmed that the wall is too narrow to be seen from orbit.",
    question: "What is the main point of this passage?",
    options: ["The Great Wall is very long", "The Great Wall is visible from space", "The Great Wall is not visible from space", "Astronauts have visited the Great Wall"],
    correct: "The Great Wall is not visible from space"
  },
  {
    passage: "Studies show that bilingual individuals may have cognitive advantages over monolingual speakers. Research indicates that switching between languages regularly exercises the brain and may delay the onset of dementia.",
    question: "According to the passage, what benefit might bilingualism provide?",
    options: ["Better memory only", "Cognitive advantages and delayed dementia", "Faster reading speed", "Improved hearing"],
    correct: "Cognitive advantages and delayed dementia"
  },
  {
    passage: "The octopus has three hearts and blue blood. Two hearts pump blood to the gills, while the third pumps it to the rest of the body. Their blood contains copper-based hemocyanin, which gives it a blue color.",
    question: "Why is octopus blood blue?",
    options: ["They live in cold water", "It contains copper-based hemocyanin", "They have three hearts", "They eat blue foods"],
    correct: "It contains copper-based hemocyanin"
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

const ReadingSprint = () => {
  const navigate = useNavigate();
  const { saveGameSession } = useGameProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);
  const [gameState, setGameState] = useState<"ready" | "playing" | "finished">("ready");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const startTimeRef = useRef<number>(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<ReadingQuestion[]>([]);

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
    setShowResult(true);
    
    if (answer === currentQuestion.correct) {
      const timeBonus = Math.floor(timeLeft / 5);
      setScore((prev) => prev + 150 + timeBonus);
      setCorrectCount((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex < shuffledQuestions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setGameState("finished");
      }
    }, 1500);
  };

  const startGame = () => {
    // Shuffle questions and options
    const shuffled = shuffleArray(baseReadingQuestions).map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));
    setShuffledQuestions(shuffled);
    setGameState("playing");
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(180);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectCount(0);
    startTimeRef.current = Date.now();
  };

  // Save progress when game finishes
  useEffect(() => {
    if (gameState === "finished" && shuffledQuestions.length > 0) {
      const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      saveGameSession({
        gameType: "reading-sprint",
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
              <div className="p-3 sm:p-4 rounded-full bg-emerald-500/10 w-fit mx-auto mb-4 sm:mb-6">
                <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-500" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Reading Sprint</h1>
              <p className="text-muted-foreground mb-6">
                Read passages quickly and answer questions to earn points!
              </p>
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 text-center">
                <div className="p-3 sm:p-4 bg-muted rounded-lg">
                  <p className="text-lg sm:text-2xl font-bold">{baseReadingQuestions.length}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Passages</p>
                </div>
                <div className="p-3 sm:p-4 bg-muted rounded-lg">
                  <p className="text-lg sm:text-2xl font-bold">3min</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Time Limit</p>
                </div>
                <div className="p-3 sm:p-4 bg-muted rounded-lg">
                  <p className="text-lg sm:text-2xl font-bold">1500</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Max Points</p>
                </div>
              </div>
              <Button size="lg" onClick={startGame} className="gap-2 w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600">
                <BookOpen className="w-4 h-4" />
                Start Sprint
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
                <Badge className="bg-emerald-500/10 text-emerald-500 text-sm sm:text-base">
                  Score: {score}
                </Badge>
              </div>

              <Progress value={progress} className="h-2" />

              <Card className="p-4 sm:p-6">
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                  Passage {currentIndex + 1} of {shuffledQuestions.length}
                </p>
                
                <div className="p-3 sm:p-4 bg-muted/50 rounded-lg mb-4 sm:mb-6">
                  <p className="text-sm sm:text-base leading-relaxed">{currentQuestion.passage}</p>
                </div>
                
                <h3 className="font-semibold mb-4 text-sm sm:text-base">{currentQuestion.question}</h3>
                
                <div className="grid gap-2 sm:gap-3">
                  {currentQuestion.options.map((option, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className={`justify-start h-auto py-3 sm:py-4 px-4 text-left text-sm sm:text-base whitespace-normal ${
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
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                      )}
                      {selectedAnswer === option && option !== currentQuestion.correct && (
                        <XCircle className="w-4 h-4 mr-2 text-red-500 flex-shrink-0" />
                      )}
                      {option}
                    </Button>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {gameState === "finished" && (
            <Card className="text-center p-6 sm:p-8">
              <div className="p-3 sm:p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4 sm:mb-6">
                <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Sprint Complete!</h1>
              <p className="text-4xl sm:text-5xl font-bold text-primary mb-4">{score}</p>
              <p className="text-muted-foreground mb-6">points earned</p>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                <div className="p-3 sm:p-4 bg-muted rounded-lg">
                  <p className="text-lg sm:text-2xl font-bold">{currentIndex + 1}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Passages Read</p>
                </div>
                <div className="p-3 sm:p-4 bg-muted rounded-lg">
                  <p className="text-lg sm:text-2xl font-bold">{180 - timeLeft}s</p>
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

export default ReadingSprint;
