"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Star, Volume2, CheckCircle, XCircle, RotateCcw, BookOpen, Trophy, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useProgress } from "@/lib/progress-context"
import { XPNotification } from "@/components/xp-notification"

// Bangla vowels and consonants
const banglaLetters = {
  vowels: [
    { letter: "অ", romanization: "o", sound: "o as in hot" },
    { letter: "আ", romanization: "aa", sound: "aa as in car" },
    { letter: "ই", romanization: "i", sound: "i as in bit" },
    { letter: "ঈ", romanization: "ii", sound: "ee as in bee" },
    { letter: "উ", romanization: "u", sound: "u as in put" },
    { letter: "ঊ", romanization: "uu", sound: "oo as in boot" },
    { letter: "ঋ", romanization: "ri", sound: "ri as in grit" },
    { letter: "এ", romanization: "e", sound: "e as in bed" },
    { letter: "ঐ", romanization: "oi", sound: "oi as in boil" },
    { letter: "ও", romanization: "o", sound: "o as in go" },
    { letter: "ঔ", romanization: "ou", sound: "ou as in house" },
  ],
  consonants: [
    { letter: "ক", romanization: "k", sound: "k as in kite" },
    { letter: "খ", romanization: "kh", sound: "kh as in khaki" },
    { letter: "গ", romanization: "g", sound: "g as in go" },
    { letter: "ঘ", romanization: "gh", sound: "gh as in ghost" },
    { letter: "ঙ", romanization: "ng", sound: "ng as in sing" },
    { letter: "চ", romanization: "ch", sound: "ch as in chair" },
    { letter: "ছ", romanization: "chh", sound: "chh aspirated" },
    { letter: "জ", romanization: "j", sound: "j as in jar" },
    { letter: "ঝ", romanization: "jh", sound: "jh aspirated" },
    { letter: "ঞ", romanization: "ny", sound: "ny nasal" },
    { letter: "ট", romanization: "t", sound: "t retroflex" },
    { letter: "ঠ", romanization: "th", sound: "th retroflex" },
    { letter: "ড", romanization: "d", sound: "d retroflex" },
    { letter: "ঢ", romanization: "dh", sound: "dh retroflex" },
    { letter: "ণ", romanization: "n", sound: "n retroflex" },
    { letter: "ত", romanization: "t", sound: "t dental" },
    { letter: "থ", romanization: "th", sound: "th dental" },
    { letter: "দ", romanization: "d", sound: "d dental" },
    { letter: "ধ", romanization: "dh", sound: "dh dental" },
    { letter: "ন", romanization: "n", sound: "n dental" },
    { letter: "প", romanization: "p", sound: "p as in pen" },
    { letter: "ফ", romanization: "ph", sound: "ph as in phone" },
    { letter: "ব", romanization: "b", sound: "b as in bat" },
    { letter: "ভ", romanization: "bh", sound: "bh aspirated" },
    { letter: "ম", romanization: "m", sound: "m as in mat" },
    { letter: "য", romanization: "y", sound: "y as in yes" },
    { letter: "র", romanization: "r", sound: "r as in red" },
    { letter: "ল", romanization: "l", sound: "l as in let" },
    { letter: "শ", romanization: "sh", sound: "sh as in ship" },
    { letter: "ষ", romanization: "sh", sound: "sh retroflex" },
    { letter: "স", romanization: "s", sound: "s as in sun" },
    { letter: "হ", romanization: "h", sound: "h as in hat" },
    { letter: "ড়", romanization: "r", sound: "r flapped" },
    { letter: "ঢ়", romanization: "rh", sound: "rh flapped" },
    { letter: "য়", romanization: "y", sound: "y antostha" },
    { letter: "ৎ", romanization: "t", sound: "t final" },
    { letter: "ং", romanization: "ng", sound: "ng anusvara" },
    { letter: "ঃ", romanization: "h", sound: "h visarga" },
    { letter: "ঁ", romanization: "n", sound: "n chandrabindu" },
  ],
}

const gameTypes = [
  { id: "flashcard", name: "Flashcards", description: "Learn letter shapes and sounds" },
  { id: "matching", name: "Match Letters", description: "Match letters with sounds" },
  { id: "sound", name: "Sound Game", description: "Listen and identify letters" },
  { id: "quiz", name: "Letter Quiz", description: "Test your knowledge" },
]

const levels = [
  { id: 1, name: "Vowels 1-5", letters: banglaLetters.vowels.slice(0, 5), unlocked: true },
  { id: 2, name: "Vowels 6-11", letters: banglaLetters.vowels.slice(5), unlocked: false },
  { id: 3, name: "Consonants 1-10", letters: banglaLetters.consonants.slice(0, 10), unlocked: false },
  { id: 4, name: "Consonants 11-20", letters: banglaLetters.consonants.slice(10, 20), unlocked: false },
  { id: 5, name: "Consonants 21-30", letters: banglaLetters.consonants.slice(20, 30), unlocked: false },
  { id: 6, name: "Consonants 31-39", letters: banglaLetters.consonants.slice(30), unlocked: false },
  {
    id: 7,
    name: "Mixed Review 1",
    letters: [...banglaLetters.vowels.slice(0, 5), ...banglaLetters.consonants.slice(0, 5)],
    unlocked: false,
  },
  {
    id: 8,
    name: "Mixed Review 2",
    letters: [...banglaLetters.vowels.slice(5), ...banglaLetters.consonants.slice(5, 15)],
    unlocked: false,
  },
  {
    id: 9,
    name: "Mixed Review 3",
    letters: [...banglaLetters.vowels, ...banglaLetters.consonants.slice(15, 25)],
    unlocked: false,
  },
  {
    id: 10,
    name: "Mixed Review 4",
    letters: [...banglaLetters.vowels, ...banglaLetters.consonants.slice(25)],
    unlocked: false,
  },
  {
    id: 11,
    name: "Master Challenge",
    letters: [...banglaLetters.vowels, ...banglaLetters.consonants],
    unlocked: false,
  },
]

export default function LettersPage() {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [showXPNotification, setShowXPNotification] = useState(false)
  const [earnedXP, setEarnedXP] = useState(0)
  const [showLearningPhase, setShowLearningPhase] = useState(true)
  const [completedGames, setCompletedGames] = useState<string[]>([])
  const [wrongAnswers, setWrongAnswers] = useState<any[]>([])
  const [reviewMode, setReviewMode] = useState(false)
  const { progress, addXP, completeLevel } = useProgress()

  const currentLevel = selectedLevel ? levels.find((l) => l.id === selectedLevel) : null
  const currentLetter = currentLevel?.letters[currentLetterIndex]

  const playSound = (letter: string) => {
    console.log(`Playing sound for: ${letter}`)
  }

  const nextLetter = () => {
    if (currentLevel && currentLetterIndex < currentLevel.letters.length - 1) {
      setCurrentLetterIndex(currentLetterIndex + 1)
      setShowAnswer(false)
    } else {
      const newCompletedGames = [...completedGames, selectedGame!].filter(
        (game, index, arr) => arr.indexOf(game) === index,
      )
      setCompletedGames(newCompletedGames)

      if (newCompletedGames.length === gameTypes.length) {
        const xpReward = 50 + (selectedLevel || 1) * 10
        addXP(xpReward, "letters")
        completeLevel("letters", selectedLevel || 1)
        setEarnedXP(xpReward)
        setShowXPNotification(true)
        setCompletedGames([])
      }

      setSelectedGame(null)
      setCurrentLetterIndex(0)
      setShowLearningPhase(true)
    }
  }

  const handleWrongAnswer = (letter: any) => {
    const wrongAnswer = { ...letter, gameType: selectedGame, timestamp: Date.now() }
    setWrongAnswers((prev) => [...prev, wrongAnswer])
    nextLetter()
  }

  const resetGame = () => {
    setCurrentLetterIndex(0)
    setScore(0)
    setShowAnswer(false)
    setReviewMode(false)
  }

  const startReviewMode = () => {
    if (wrongAnswers.length > 0) {
      setReviewMode(true)
      setCurrentLetterIndex(0)
    }
  }

  const updatedLevels = levels.map((level) => ({
    ...level,
    unlocked: level.id <= (progress.modules.letters?.completedLevels || 0) + 1,
  }))

  if (selectedLevel && selectedGame && showLearningPhase && currentLevel) {
    return (
      <div className="min-h-screen p-4 max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedGame(null)
              setSelectedLevel(null)
              setShowLearningPhase(true)
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </Button>
        </header>

        <Card className="max-w-3xl mx-auto">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-display font-bold">Learning Phase: {currentLevel.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold mb-4">Letters you'll learn in this level:</h3>
              <div className="grid grid-cols-5 md:grid-cols-8 gap-4 mb-6">
                {currentLevel.letters.map((letter, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-primary/10 rounded-lg flex flex-col items-center justify-center text-lg font-bold text-primary cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={() => playSound(letter.letter)}
                  >
                    <div className="text-2xl">{letter.letter}</div>
                    <div className="text-xs">{letter.romanization}</div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h4 className="font-bold text-blue-800 mb-3">Game Instructions:</h4>
                <div className="text-left text-blue-700">
                  {selectedGame === "flashcard" && (
                    <ul className="space-y-2">
                      <li>• Look at each letter carefully</li>
                      <li>• Click "Show Answer" to see the romanization and sound</li>
                      <li>• Mark if you got it right or need more practice</li>
                    </ul>
                  )}
                  {selectedGame === "matching" && (
                    <ul className="space-y-2">
                      <li>• You'll see a Bangla letter</li>
                      <li>• Choose the correct romanization from 4 options</li>
                      <li>• Get points for correct answers</li>
                    </ul>
                  )}
                  {selectedGame === "sound" && (
                    <ul className="space-y-2">
                      <li>• Listen carefully to the letter pronunciation</li>
                      <li>• Choose the correct Bangla letter from 4 options</li>
                      <li>• You can replay the sound as many times as needed</li>
                    </ul>
                  )}
                  {selectedGame === "quiz" && (
                    <ul className="space-y-2">
                      <li>• Listen to the sound description</li>
                      <li>• Choose the correct Bangla letter</li>
                      <li>• Test your recognition skills</li>
                    </ul>
                  )}
                </div>
              </div>

              <Button size="lg" onClick={() => setShowLearningPhase(false)} className="font-display font-bold">
                Start {gameTypes.find((g) => g.id === selectedGame)?.name}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (selectedLevel && selectedGame && currentLevel) {
    return (
      <div className="min-h-screen p-4 max-w-4xl mx-auto">
        <XPNotification xp={earnedXP} show={showXPNotification} onHide={() => setShowXPNotification(false)} />

        <header className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedGame(null)
              setSelectedLevel(null)
              setCurrentLetterIndex(0)
              setShowLearningPhase(true)
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Levels
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-bold">{score}</span>
            </div>
            {wrongAnswers.length > 0 && (
              <Button variant="outline" size="sm" onClick={startReviewMode}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Review ({wrongAnswers.length})
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={resetGame}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </header>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-display font-bold">
              {currentLevel.name} {reviewMode && "(Review Mode)"}
            </h2>
            <span className="text-sm text-muted-foreground">
              {currentLetterIndex + 1} / {reviewMode ? wrongAnswers.length : currentLevel.letters.length}
            </span>
          </div>
          <Progress
            value={((currentLetterIndex + 1) / (reviewMode ? wrongAnswers.length : currentLevel.letters.length)) * 100}
            className="h-2"
          />
        </div>

        {selectedGame === "flashcard" && (reviewMode ? wrongAnswers[currentLetterIndex] : currentLetter) && (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="mb-8">
                <div className="text-8xl font-bold text-primary mb-4 animate-bounce-gentle">
                  {reviewMode ? wrongAnswers[currentLetterIndex]?.letter : currentLetter?.letter}
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    playSound(reviewMode ? wrongAnswers[currentLetterIndex]?.letter : currentLetter?.letter)
                  }
                  className="mb-4"
                >
                  <Volume2 className="w-5 h-5 mr-2" />
                  Play Sound
                </Button>
              </div>

              {!showAnswer ? (
                <Button size="lg" onClick={() => setShowAnswer(true)} className="font-display font-bold">
                  Show Answer
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="text-2xl font-bold text-green-600">
                    {reviewMode ? wrongAnswers[currentLetterIndex]?.romanization : currentLetter?.romanization}
                  </div>
                  <div className="text-lg text-muted-foreground">
                    {reviewMode ? wrongAnswers[currentLetterIndex]?.sound : currentLetter?.sound}
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setScore(score + 1)
                        nextLetter()
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      Got it!
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleWrongAnswer(reviewMode ? wrongAnswers[currentLetterIndex] : currentLetter)}
                    >
                      <XCircle className="w-4 h-4 mr-2 text-red-500" />
                      Need practice
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {selectedGame === "matching" && (reviewMode ? wrongAnswers[currentLetterIndex] : currentLetter) && (
          <MatchingGame
            letter={reviewMode ? wrongAnswers[currentLetterIndex] : currentLetter}
            onCorrect={() => {
              setScore(score + 1)
              nextLetter()
            }}
            onIncorrect={() => handleWrongAnswer(reviewMode ? wrongAnswers[currentLetterIndex] : currentLetter)}
          />
        )}

        {selectedGame === "sound" && (reviewMode ? wrongAnswers[currentLetterIndex] : currentLetter) && (
          <SoundGame
            letter={reviewMode ? wrongAnswers[currentLetterIndex] : currentLetter}
            allLetters={currentLevel.letters}
            onCorrect={() => {
              setScore(score + 1)
              nextLetter()
            }}
            onIncorrect={() => handleWrongAnswer(reviewMode ? wrongAnswers[currentLetterIndex] : currentLetter)}
          />
        )}

        {selectedGame === "quiz" && (reviewMode ? wrongAnswers[currentLetterIndex] : currentLetter) && (
          <QuizGame
            letter={reviewMode ? wrongAnswers[currentLetterIndex] : currentLetter}
            allLetters={currentLevel.letters}
            onCorrect={() => {
              setScore(score + 1)
              nextLetter()
            }}
            onIncorrect={() => handleWrongAnswer(reviewMode ? wrongAnswers[currentLetterIndex] : currentLetter)}
          />
        )}
      </div>
    )
  }

  if (selectedLevel && currentLevel) {
    return (
      <div className="min-h-screen p-4 max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => setSelectedLevel(null)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Levels
          </Button>
        </header>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">{currentLevel.name}</h1>
          <p className="text-muted-foreground">Complete all 4 games to finish this level</p>

          {completedGames.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-green-600" />
                <span className="font-bold text-green-700">
                  {completedGames.length}/{gameTypes.length} Games Completed
                </span>
              </div>
              <div className="flex justify-center gap-2">
                {gameTypes.map((game) => (
                  <div
                    key={game.id}
                    className={`px-3 py-1 rounded-full text-sm ${
                      completedGames.includes(game.id) ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {game.name} {completedGames.includes(game.id) && "✓"}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {gameTypes.map((game) => (
            <Card
              key={game.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 ${
                completedGames.includes(game.id) ? "border-green-500/50 bg-green-50" : "border-primary/20"
              }`}
              onClick={() => setSelectedGame(game.id)}
            >
              <CardHeader>
                <CardTitle className="font-display flex items-center justify-between">
                  {game.name}
                  {completedGames.includes(game.id) && <CheckCircle className="w-5 h-5 text-green-600" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{game.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-display">Letters in this level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
              {currentLevel.letters.map((letter, index) => (
                <div
                  key={index}
                  className="aspect-square bg-primary/10 rounded-lg flex items-center justify-center text-2xl font-bold text-primary cursor-pointer hover:bg-primary/20 transition-colors"
                  onClick={() => playSound(letter.letter)}
                >
                  {letter.letter}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <Link href="/">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </header>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-display font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Letters - বর্ণমালা
        </h1>
        <p className="text-lg text-muted-foreground">Master the Bangla alphabet step by step!</p>
      </div>

      <div className="space-y-4">
        {updatedLevels.map((level) => (
          <Card
            key={level.id}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
              level.unlocked ? "border-primary/20 shadow-lg hover:shadow-xl" : "opacity-60 border-gray-300"
            }`}
            onClick={() => level.unlocked && setSelectedLevel(level.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-display font-bold mb-2">
                    Level {level.id}: {level.name}
                  </h3>
                  <p className="text-muted-foreground">{level.letters.length} letters to learn</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Progress</div>
                    <div className="text-lg font-bold">
                      {progress.modules.letters?.completedLevels >= level.id ? level.letters.length : 0}/
                      {level.letters.length}
                    </div>
                  </div>
                  {level.unlocked ? (
                    <Button size="lg" className="font-display font-bold">
                      {progress.modules.letters?.completedLevels >= level.id ? "Completed" : "Start Level"}
                    </Button>
                  ) : (
                    <div className="text-center">
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center mb-1">
                        <span className="text-white text-sm">🔒</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Complete previous level</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function MatchingGame({
  letter,
  onCorrect,
  onIncorrect,
}: {
  letter: { letter: string; romanization: string; sound: string }
  onCorrect: () => void
  onIncorrect: () => void
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)

  const wrongAnswers = ["ka", "ma", "ta", "na"].filter((a) => a !== letter.romanization).slice(0, 3)
  const allAnswers = [letter.romanization, ...wrongAnswers].sort(() => Math.random() - 0.5)

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    setShowResult(true)
    setTimeout(() => {
      if (answer === letter.romanization) {
        onCorrect()
      } else {
        onIncorrect()
      }
      setSelectedAnswer(null)
      setShowResult(false)
    }, 1500)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8 text-center">
        <h3 className="text-2xl font-display font-bold mb-6">Match the letter with its sound</h3>
        <div className="text-8xl font-bold text-primary mb-8 animate-bounce-gentle">{letter.letter}</div>
        <div className="grid grid-cols-2 gap-4">
          {allAnswers.map((answer) => (
            <Button
              key={answer}
              variant={
                selectedAnswer === answer ? (answer === letter.romanization ? "default" : "destructive") : "outline"
              }
              size="lg"
              onClick={() => !showResult && handleAnswer(answer)}
              disabled={showResult}
              className="text-lg font-bold h-16"
            >
              {answer}
              {showResult &&
                selectedAnswer === answer &&
                (answer === letter.romanization ? (
                  <CheckCircle className="w-5 h-5 ml-2 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 ml-2 text-red-500" />
                ))}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function QuizGame({
  letter,
  allLetters,
  onCorrect,
  onIncorrect,
}: {
  letter: { letter: string; romanization: string; sound: string }
  allLetters: { letter: string; romanization: string; sound: string }[]
  onCorrect: () => void
  onIncorrect: () => void
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)

  const wrongAnswers = allLetters
    .filter((l) => l.letter !== letter.letter)
    .map((l) => l.letter)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)

  const allAnswers = [letter.letter, ...wrongAnswers].sort(() => Math.random() - 0.5)

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    setShowResult(true)
    setTimeout(() => {
      if (answer === letter.letter) {
        onCorrect()
      } else {
        onIncorrect()
      }
      setSelectedAnswer(null)
      setShowResult(false)
    }, 1500)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8 text-center">
        <h3 className="text-2xl font-display font-bold mb-6">Which letter makes this sound?</h3>
        <div className="text-3xl font-bold text-primary mb-2">{letter.romanization}</div>
        <div className="text-lg text-muted-foreground mb-8">{letter.sound}</div>
        <div className="grid grid-cols-2 gap-4">
          {allAnswers.map((answer) => (
            <Button
              key={answer}
              variant={selectedAnswer === answer ? (answer === letter.letter ? "default" : "destructive") : "outline"}
              size="lg"
              onClick={() => !showResult && handleAnswer(answer)}
              disabled={showResult}
              className="text-4xl font-bold h-20"
            >
              {answer}
              {showResult &&
                selectedAnswer === answer &&
                (answer === letter.letter ? (
                  <CheckCircle className="w-5 h-5 ml-2 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 ml-2 text-red-500" />
                ))}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function SoundGame({
  letter,
  allLetters,
  onCorrect,
  onIncorrect,
}: {
  letter: { letter: string; romanization: string; sound: string }
  allLetters: { letter: string; romanization: string; sound: string }[]
  onCorrect: () => void
  onIncorrect: () => void
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [hasPlayedSound, setHasPlayedSound] = useState(false)

  const wrongAnswers = allLetters
    .filter((l) => l.letter !== letter.letter)
    .map((l) => l.letter)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)

  const allAnswers = [letter.letter, ...wrongAnswers].sort(() => Math.random() - 0.5)

  const playLetterSound = () => {
    // In a real app, this would play actual audio
    console.log(`Playing sound for: ${letter.letter} (${letter.romanization})`)
    setHasPlayedSound(true)

    // Simulate audio feedback with speech synthesis if available
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(letter.romanization)
      utterance.rate = 0.7
      utterance.pitch = 1.2
      speechSynthesis.speak(utterance)
    }
  }

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    setShowResult(true)
    setTimeout(() => {
      if (answer === letter.letter) {
        onCorrect()
      } else {
        onIncorrect()
      }
      setSelectedAnswer(null)
      setShowResult(false)
      setHasPlayedSound(false)
    }, 1500)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8 text-center">
        <h3 className="text-2xl font-display font-bold mb-6">Listen and choose the correct letter</h3>

        <div className="mb-8">
          <Button
            size="lg"
            onClick={playLetterSound}
            className="font-display font-bold bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
          >
            <Volume2 className="w-6 h-6 mr-3" />
            {hasPlayedSound ? "Play Again" : "Play Sound"}
          </Button>

          {hasPlayedSound && (
            <p className="text-sm text-muted-foreground mt-2">Click "Play Again" if you need to hear it once more</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {allAnswers.map((answer) => (
            <Button
              key={answer}
              variant={selectedAnswer === answer ? (answer === letter.letter ? "default" : "destructive") : "outline"}
              size="lg"
              onClick={() => !showResult && handleAnswer(answer)}
              disabled={showResult}
              className="text-4xl font-bold h-20 transition-all duration-200 hover:scale-105"
            >
              {answer}
              {showResult &&
                selectedAnswer === answer &&
                (answer === letter.letter ? (
                  <CheckCircle className="w-5 h-5 ml-2 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 ml-2 text-red-500" />
                ))}
            </Button>
          ))}
        </div>

        {showResult && selectedAnswer === letter.letter && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-green-700 font-bold">
              Correct! "{letter.letter}" sounds like "{letter.romanization}"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
