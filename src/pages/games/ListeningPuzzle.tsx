import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Headphones, Timer, Trophy, Volume2, RotateCcw, Play, Pause } from "lucide-react";

interface ListeningItem {
  text: string;
  blanks: { word: string; position: number }[];
}

const listeningData: ListeningItem[] = [
  {
    text: "The university library is open from nine o'clock in the ___ until ten o'clock at ___.",
    blanks: [{ word: "morning", position: 0 }, { word: "night", position: 1 }]
  },
  {
    text: "Please complete the registration form and submit it to the ___ office by ___.",
    blanks: [{ word: "main", position: 0 }, { word: "Friday", position: 1 }]
  },
  {
    text: "The conference will be held in the ___ hall on the ___ floor.",
    blanks: [{ word: "grand", position: 0 }, { word: "third", position: 1 }]
  },
  {
    text: "Students must bring their ___ card and a valid form of ___.",
    blanks: [{ word: "student", position: 0 }, { word: "identification", position: 1 }]
  },
  {
    text: "The train to London departs at ___ and arrives at approximately ___.",
    blanks: [{ word: "noon", position: 0 }, { word: "three", position: 1 }]
  },
];

const ListeningPuzzle = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<"ready" | "playing" | "finished">("ready");
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const currentItem = listeningData[currentIndex];
  const progress = ((currentIndex + 1) / listeningData.length) * 100;

  useEffect(() => {
    if (currentItem) {
      setAnswers(new Array(currentItem.blanks.length).fill(""));
      setSubmitted(false);
    }
  }, [currentIndex, currentItem]);

  const playAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const fullText = currentItem.text.replace(/_+/g, (_, index) => {
        const blankIndex = currentItem.text.slice(0, currentItem.text.indexOf(_)).split('_').length - 1;
        return currentItem.blanks[blankIndex % currentItem.blanks.length]?.word || "";
      });
      
      let textToSpeak = currentItem.text;
      currentItem.blanks.forEach((blank) => {
        textToSpeak = textToSpeak.replace("___", blank.word);
      });
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.8;
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopAudio = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    let correct = 0;
    currentItem.blanks.forEach((blank, idx) => {
      if (answers[idx]?.toLowerCase().trim() === blank.word.toLowerCase()) {
        correct++;
      }
    });
    setScore((prev) => prev + correct * 100);

    setTimeout(() => {
      if (currentIndex < listeningData.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setGameState("finished");
      }
    }, 2000);
  };

  const startGame = () => {
    setGameState("playing");
    setCurrentIndex(0);
    setScore(0);
    setAnswers([]);
    setSubmitted(false);
  };

  const renderTextWithBlanks = () => {
    const parts = currentItem.text.split("___");
    return parts.map((part, idx) => (
      <span key={idx} className="inline">
        {part}
        {idx < currentItem.blanks.length && (
          <span className="inline-block mx-1">
            <Input
              value={answers[idx] || ""}
              onChange={(e) => handleAnswerChange(idx, e.target.value)}
              disabled={submitted}
              className={`w-24 sm:w-32 inline-block h-8 text-center text-sm ${
                submitted
                  ? answers[idx]?.toLowerCase().trim() === currentItem.blanks[idx].word.toLowerCase()
                    ? "border-green-500 bg-green-500/10"
                    : "border-red-500 bg-red-500/10"
                  : ""
              }`}
              placeholder="..."
            />
            {submitted && answers[idx]?.toLowerCase().trim() !== currentItem.blanks[idx].word.toLowerCase() && (
              <span className="text-green-500 text-sm ml-1">({currentItem.blanks[idx].word})</span>
            )}
          </span>
        )}
      </span>
    ));
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
              <div className="p-3 sm:p-4 rounded-full bg-purple-500/10 w-fit mx-auto mb-4 sm:mb-6">
                <Headphones className="w-10 h-10 sm:w-12 sm:h-12 text-purple-500" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Listening Puzzle</h1>
              <p className="text-muted-foreground mb-6">
                Listen to the audio and fill in the missing words!
              </p>
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 text-center">
                <div className="p-3 sm:p-4 bg-muted rounded-lg">
                  <p className="text-lg sm:text-2xl font-bold">5</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Passages</p>
                </div>
                <div className="p-3 sm:p-4 bg-muted rounded-lg">
                  <p className="text-lg sm:text-2xl font-bold">10</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Blanks</p>
                </div>
                <div className="p-3 sm:p-4 bg-muted rounded-lg">
                  <p className="text-lg sm:text-2xl font-bold">1000</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Max Points</p>
                </div>
              </div>
              <Button size="lg" onClick={startGame} className="gap-2 w-full sm:w-auto bg-purple-500 hover:bg-purple-600">
                <Headphones className="w-4 h-4" />
                Start Puzzle
              </Button>
            </Card>
          )}

          {gameState === "playing" && currentItem && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="gap-1 text-sm sm:text-base">
                  Passage {currentIndex + 1}/{listeningData.length}
                </Badge>
                <Badge className="bg-purple-500/10 text-purple-500 text-sm sm:text-base">
                  Score: {score}
                </Badge>
              </div>

              <Progress value={progress} className="h-2" />

              <Card className="p-4 sm:p-6">
                <div className="flex justify-center mb-6">
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={isPlaying ? stopAudio : playAudio}
                    className="gap-2"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-5 h-5" />
                        Stop Audio
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-5 h-5" />
                        Play Audio
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-base sm:text-lg leading-relaxed mb-6 p-4 bg-muted/50 rounded-lg">
                  {renderTextWithBlanks()}
                </div>

                <Button 
                  onClick={handleSubmit} 
                  disabled={submitted || answers.some(a => !a.trim())}
                  className="w-full"
                >
                  Submit Answers
                </Button>
              </Card>
            </div>
          )}

          {gameState === "finished" && (
            <Card className="text-center p-6 sm:p-8">
              <div className="p-3 sm:p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4 sm:mb-6">
                <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Puzzle Complete!</h1>
              <p className="text-4xl sm:text-5xl font-bold text-primary mb-4">{score}</p>
              <p className="text-muted-foreground mb-6">points earned</p>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                <div className="p-3 sm:p-4 bg-muted rounded-lg">
                  <p className="text-lg sm:text-2xl font-bold">{score / 100}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Correct Answers</p>
                </div>
                <div className="p-3 sm:p-4 bg-muted rounded-lg">
                  <p className="text-lg sm:text-2xl font-bold">{Math.round((score / 1000) * 100)}%</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Accuracy</p>
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

export default ListeningPuzzle;
