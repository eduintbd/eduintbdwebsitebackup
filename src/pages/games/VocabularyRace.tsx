import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Zap, Timer, Trophy, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VocabWord {
  word: string;
  meaning: string;
  options: string[];
}

const vocabularyData: VocabWord[] = [
  { word: "Ubiquitous", meaning: "Present everywhere", options: ["Present everywhere", "Very rare", "Extremely loud", "Completely silent"] },
  { word: "Ephemeral", meaning: "Lasting for a very short time", options: ["Lasting forever", "Lasting for a very short time", "Very expensive", "Highly decorated"] },
  { word: "Pragmatic", meaning: "Dealing with things sensibly", options: ["Idealistic", "Dealing with things sensibly", "Very emotional", "Highly creative"] },
  { word: "Eloquent", meaning: "Fluent or persuasive in speaking", options: ["Unable to speak", "Fluent or persuasive in speaking", "Very quiet", "Extremely loud"] },
  { word: "Meticulous", meaning: "Very careful about details", options: ["Very careless", "Very careful about details", "Extremely fast", "Very lazy"] },
  { word: "Resilient", meaning: "Able to recover quickly", options: ["Easily broken", "Able to recover quickly", "Very fragile", "Extremely slow"] },
  { word: "Ambiguous", meaning: "Open to more than one interpretation", options: ["Very clear", "Open to more than one interpretation", "Extremely loud", "Highly decorated"] },
  { word: "Compelling", meaning: "Evoking interest or attention", options: ["Very boring", "Evoking interest or attention", "Extremely quiet", "Very simple"] },
  { word: "Diligent", meaning: "Having careful and persistent effort", options: ["Very lazy", "Having careful and persistent effort", "Extremely fast", "Very careless"] },
  { word: "Innovative", meaning: "Featuring new methods or ideas", options: ["Very traditional", "Featuring new methods or ideas", "Extremely old", "Very common"] },
];

const VocabularyRace = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<"ready" | "playing" | "finished">("ready");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);

  const currentWord = vocabularyData[currentIndex];
  const progress = ((currentIndex + 1) / vocabularyData.length) * 100;

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

  const handleAnswer = useCallback((answer: string) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentWord.meaning;
    setIsCorrect(correct);

    if (correct) {
      const bonusPoints = streak >= 3 ? 20 : streak >= 2 ? 10 : 0;
      setScore((prev) => prev + 50 + bonusPoints + Math.floor(timeLeft / 10));
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (currentIndex < vocabularyData.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setGameState("finished");
      }
    }, 1000);
  }, [currentIndex, currentWord.meaning, selectedAnswer, streak, timeLeft]);

  const startGame = () => {
    setGameState("playing");
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(60);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setStreak(0);
  };

  const restartGame = () => {
    startGame();
  };

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
              <div className="p-3 sm:p-4 rounded-full bg-yellow-500/10 w-fit mx-auto mb-4 sm:mb-6">
                <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-500" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Vocabulary Race</h1>
              <p className="text-muted-foreground mb-6">
                Match words with their correct meanings as fast as you can!
              </p>
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 text-center">
                <div className="p-3 sm:p-4 bg-muted rounded-lg">
                  <p className="text-lg sm:text-2xl font-bold">10</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Words</p>
                </div>
                <div className="p-3 sm:p-4 bg-muted rounded-lg">
                  <p className="text-lg sm:text-2xl font-bold">60s</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Time Limit</p>
                </div>
                <div className="p-3 sm:p-4 bg-muted rounded-lg">
                  <p className="text-lg sm:text-2xl font-bold">500</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Max Points</p>
                </div>
              </div>
              <Button size="lg" onClick={startGame} className="gap-2 w-full sm:w-auto">
                <Zap className="w-4 h-4" />
                Start Race
              </Button>
            </Card>
          )}

          {gameState === "playing" && currentWord && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="gap-1 text-sm sm:text-base">
                    <Timer className="w-4 h-4" />
                    {timeLeft}s
                  </Badge>
                  <Badge className="bg-yellow-500/10 text-yellow-500 text-sm sm:text-base">
                    Score: {score}
                  </Badge>
                </div>
                {streak >= 2 && (
                  <Badge className="bg-orange-500/10 text-orange-500 text-sm sm:text-base w-fit">
                    🔥 {streak} Streak!
                  </Badge>
                )}
              </div>

              <Progress value={progress} className="h-2" />

              <Card className="p-4 sm:p-6">
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                  Word {currentIndex + 1} of {vocabularyData.length}
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-primary">
                  {currentWord.word}
                </h2>
                <div className="grid gap-2 sm:gap-3">
                  {currentWord.options.map((option, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className={`justify-start h-auto py-3 sm:py-4 px-4 sm:px-6 text-left text-sm sm:text-base whitespace-normal ${
                        selectedAnswer === option
                          ? isCorrect
                            ? "border-green-500 bg-green-500/10"
                            : "border-red-500 bg-red-500/10"
                          : selectedAnswer && option === currentWord.meaning
                          ? "border-green-500 bg-green-500/10"
                          : ""
                      }`}
                      onClick={() => handleAnswer(option)}
                      disabled={selectedAnswer !== null}
                    >
                      {selectedAnswer === option && (
                        isCorrect 
                          ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-500 flex-shrink-0" />
                          : <XCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-500 flex-shrink-0" />
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
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Race Complete!</h1>
              <p className="text-4xl sm:text-5xl font-bold text-primary mb-4">{score}</p>
              <p className="text-muted-foreground mb-6">points earned</p>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                <div className="p-3 sm:p-4 bg-muted rounded-lg">
                  <p className="text-lg sm:text-2xl font-bold">{currentIndex + 1}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Words Completed</p>
                </div>
                <div className="p-3 sm:p-4 bg-muted rounded-lg">
                  <p className="text-lg sm:text-2xl font-bold">{60 - timeLeft}s</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Time Taken</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button onClick={restartGame} className="gap-2">
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

export default VocabularyRace;
