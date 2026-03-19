"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Star, CheckCircle, XCircle, RotateCcw, Layers, BookOpen, Trophy, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useProgress } from "@/lib/progress-context"
import { XPNotification } from "@/components/xp-notification"

// Common Bangla joint letters (conjunct consonants)
const jointLetters = [
  // Simple combinations
  { joint: "ক্ত", parts: ["ক", "ত"], romanization: "kto", meaning: "as in যুক্ত (yukto)" },
  { joint: "ন্ত", parts: ["ন", "ত"], romanization: "nto", meaning: "as in অন্ত (onto)" },
  { joint: "স্ত", parts: ["স", "ত"], romanization: "sto", meaning: "as in বস্ত (bosto)" },
  { joint: "ল্ত", parts: ["ল", "ত"], romanization: "lto", meaning: "as in বল্তু (boltu)" },
  { joint: "র্ত", parts: ["র", "ত"], romanization: "rto", meaning: "as in কর্তা (korta)" },

  // With ক
  { joint: "ক্ক", parts: ["ক", "ক"], romanization: "kko", meaning: "as in পক্ক (pokko)" },
  { joint: "ক্ষ", parts: ["ক", "ষ"], romanization: "kkho", meaning: "as in লক্ষ (lokkho)" },
  { joint: "ক্র", parts: ["ক", "র"], romanization: "kro", meaning: "as in ক্রম (krom)" },
  { joint: "ক্ল", parts: ["ক", "ল"], romanization: "klo", meaning: "as in ক্লান্ত (klanto)" },

  // With গ
  { joint: "গ্ধ", parts: ["গ", "ধ"], romanization: "gdho", meaning: "as in মুগ্ধ (mugdho)" },
  { joint: "গ্ন", parts: ["গ", "ন"], romanization: "gno", meaning: "as in যুগ্ন (yugno)" },
  { joint: "গ্র", parts: ["গ", "র"], romanization: "gro", meaning: "as in গ্রাম (gram)" },
  { joint: "গ্ল", parts: ["গ", "ল"], romanization: "glo", meaning: "as in গ্লানি (glani)" },

  // With চ
  { joint: "চ্চ", parts: ["চ", "চ"], romanization: "ccho", meaning: "as in বাচ্চা (bachcha)" },
  { joint: "চ্ছ", parts: ["চ", "ছ"], romanization: "cchho", meaning: "as in ইচ্ছা (iccha)" },
  { joint: "চ্ঞ", parts: ["চ", "ঞ"], romanization: "chno", meaning: "as in যাচ্ঞা (yachna)" },

  // With জ
  { joint: "জ্জ", parts: ["জ", "জ"], romanization: "jjo", meaning: "as in রাজ্জু (rajju)" },
  { joint: "জ্ঞ", parts: ["জ", "ঞ"], romanization: "gyo", meaning: "as in যজ্ঞ (yogno)" },
  { joint: "জ্র", parts: ["জ", "র"], romanization: "jro", meaning: "as in বজ্র (bojro)" },

  // With ট
  { joint: "ট্ট", parts: ["ট", "ট"], romanization: "tto", meaning: "as in চট্ট (chotto)" },
  { joint: "ট্র", parts: ["ট", "র"], romanization: "tro", meaning: "as in মিত্র (mitro)" },

  // With ত
  { joint: "ত্ত", parts: ["ত", "ত"], romanization: "tto", meaning: "as in সত্ত (sotto)" },
  { joint: "ত্থ", parts: ["ত", "থ"], romanization: "ttho", meaning: "as in উত্থান (utthan)" },
  { joint: "ত্ন", parts: ["ত", "ন"], romanization: "tno", meaning: "as in রত্ন (rotno)" },
  { joint: "ত্ম", parts: ["ত", "ম"], romanization: "tmo", meaning: "as in আত্মা (atma)" },
  { joint: "ত্র", parts: ["ত", "র"], romanization: "tro", meaning: "as in পত্র (potro)" },

  // With দ
  { joint: "দ্দ", parts: ["দ", "দ"], romanization: "ddo", meaning: "as in উদ্দেশ্য (uddesho)" },
  { joint: "দ্ধ", parts: ["দ", "ধ"], romanization: "ddho", meaning: "as in বুদ্ধি (buddhi)" },
  { joint: "দ্ব", parts: ["দ", "ব"], romanization: "dbo", meaning: "as in দ্বার (dwar)" },
  { joint: "দ্র", parts: ["দ", "র"], romanization: "dro", meaning: "as in রুদ্র (rudro)" },

  // With ন
  { joint: "ন্ন", parts: ["ন", "ন"], romanization: "nno", meaning: "as in অন্ন (onno)" },
  { joint: "ন্দ", parts: ["ন", "দ"], romanization: "ndo", meaning: "as in চন্দ্র (chondro)" },
  { joint: "ন্ধ", parts: ["ন", "ধ"], romanization: "ndho", meaning: "as in অন্ধ (ondho)" },
  { joint: "ন্ব", parts: ["ন", "ব"], romanization: "nbo", meaning: "as in অন্বয় (onboy)" },
  { joint: "ন্ম", parts: ["ন", "ম"], romanization: "nmo", meaning: "as in জন্ম (jonmo)" },

  // With প
  { joint: "প্প", parts: ["প", "প"], romanization: "ppo", meaning: "as in চাপ্পা (chappa)" },
  { joint: "প্ত", parts: ["প", "ত"], romanization: "pto", meaning: "as in গুপ্ত (gupto)" },
  { joint: "প্র", parts: ["প", "র"], romanization: "pro", meaning: "as in প্রেম (prem)" },
  { joint: "প্ল", parts: ["প", "ল"], romanization: "plo", meaning: "as in প্লাবন (plaabon)" },

  // With ব
  { joint: "ব্ব", parts: ["ব", "ব"], romanization: "bbo", meaning: "as in ডাব্বা (dabba)" },
  { joint: "ব্দ", parts: ["ব", "দ"], romanization: "bdo", meaning: "as in শব্দ (shobdo)" },
  { joint: "ব্ধ", parts: ["ব", "ধ"], romanization: "bdho", meaning: "as in লব্ধ (lobdho)" },
  { joint: "ব্র", parts: ["ব", "র"], romanization: "bro", meaning: "as in ব্রহ্মা (brohma)" },
  { joint: "ব্ল", parts: ["ব", "ল"], romanization: "blo", meaning: "as in ব্লক (blok)" },

  // With ম
  { joint: "ম্ম", parts: ["ম", "ম"], romanization: "mmo", meaning: "as in সম্মান (somman)" },
  { joint: "ম্প", parts: ["ম", "প"], romanization: "mpo", meaning: "as in ক্যাম্প (camp)" },
  { joint: "ম্ব", parts: ["ম", "ব"], romanization: "mbo", meaning: "as in অম্বর (ombor)" },
  { joint: "ম্ভ", parts: ["ম", "ভ"], romanization: "mbho", meaning: "as in গর্ভ (gorbho)" },
  { joint: "ম্র", parts: ["ম", "র"], romanization: "mro", meaning: "as in স্মরণ (smoron)" },

  // With ল
  { joint: "ল্ল", parts: ["ল", "ল"], romanization: "llo", meaning: "as in উল্লাস (ullas)" },
  { joint: "ল্প", parts: ["ল", "প"], romanization: "lpo", meaning: "as in কল্প (kolpo)" },
  { joint: "ল্ব", parts: ["ল", "ব"], romanization: "lbo", meaning: "as in বিল্ব (bilbo)" },
  { joint: "ল্ম", parts: ["ল", "ম"], romanization: "lmo", meaning: "as in গুল্ম (gulmo)" },

  // With শ, ষ, স
  { joint: "শ্চ", parts: ["শ", "চ"], romanization: "shcho", meaning: "as in পশ্চিম (poshchim)" },
  { joint: "শ্ত", parts: ["শ", "ত"], romanization: "shto", meaning: "as in নষ্ট (noshto)" },
  { joint: "শ্র", parts: ["শ", "র"], romanization: "shro", meaning: "as in শ্রম (shrom)" },
  { joint: "ষ্ট", parts: ["ষ", "ট"], romanization: "shto", meaning: "as in কষ্ট (koshto)" },
  { joint: "ষ্ঠ", parts: ["ষ", "ঠ"], romanization: "shtho", meaning: "as in ষষ্ঠ (shoshtho)" },
  { joint: "স্ক", parts: ["স", "ক"], romanization: "sko", meaning: "as in স্কুল (skul)" },
  { joint: "স্খ", parts: ["স", "খ"], romanization: "skho", meaning: "as in দুঃখ (dukkho)" },
  { joint: "স্প", parts: ["স", "প"], romanization: "spo", meaning: "as in স্পর্শ (sporsho)" },
  { joint: "স্ফ", parts: ["স", "ফ"], romanization: "spho", meaning: "as in স্ফুলিঙ্গ (sphuling)" },
  { joint: "স্ব", parts: ["স", "ব"], romanization: "sbo", meaning: "as in স্বপ্ন (shopno)" },
  { joint: "স্ম", parts: ["স", "ম"], romanization: "smo", meaning: "as in স্মৃতি (smriti)" },
  { joint: "স্র", parts: ["স", "র"], romanization: "sro", meaning: "as in স্রোত (srot)" },

  // With হ
  { joint: "হ্ন", parts: ["হ", "ন"], romanization: "hno", meaning: "as in চিহ্ন (chihno)" },
  { joint: "হ্ব", parts: ["হ", "ব"], romanization: "hbo", meaning: "as in আহ্বান (ahban)" },
  { joint: "হ্ম", parts: ["হ", "ম"], romanization: "hmo", meaning: "as in ব্রহ্মা (brohma)" },
  { joint: "হ্র", parts: ["হ", "র"], romanization: "hro", meaning: "as in হ্রদ (hrod)" },
  { joint: "হ্ল", parts: ["হ", "ল"], romanization: "hlo", meaning: "as in আহ্লাদ (ahlad)" },
]

const gameTypes = [
  { id: "recognition", name: "Recognition", description: "Identify joint letters" },
  { id: "formation", name: "Formation", description: "Learn how joints are formed" },
  { id: "breakdown", name: "Breakdown", description: "Split joints into parts" },
  { id: "quiz", name: "Joint Quiz", description: "Test your knowledge" },
]

const levels = [
  { id: 1, name: "Simple Joints 1", letters: jointLetters.slice(0, 8), unlocked: true },
  { id: 2, name: "Simple Joints 2", letters: jointLetters.slice(8, 16), unlocked: false },
  { id: 3, name: "ক-based Joints", letters: jointLetters.slice(16, 24), unlocked: false },
  { id: 4, name: "গ & চ Joints", letters: jointLetters.slice(24, 32), unlocked: false },
  { id: 5, name: "জ & ট Joints", letters: jointLetters.slice(32, 40), unlocked: false },
  { id: 6, name: "ত & দ Joints", letters: jointLetters.slice(40, 48), unlocked: false },
  { id: 7, name: "ন & প Joints", letters: jointLetters.slice(48, 56), unlocked: false },
  { id: 8, name: "Advanced Joints", letters: jointLetters.slice(56), unlocked: false },
]

export default function JointLettersPage() {
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
      // Game completed - check if all games are done
      const newCompletedGames = [...completedGames, selectedGame!].filter(
        (game, index, arr) => arr.indexOf(game) === index,
      )
      setCompletedGames(newCompletedGames)

      if (newCompletedGames.length === gameTypes.length) {
        // All games completed - level complete
        const xpReward = 60 + (selectedLevel || 1) * 15
        addXP(xpReward, "joint-letters")
        completeLevel("joint-letters", selectedLevel || 1)
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
    unlocked: level.id <= (progress.modules["joint-letters"]?.completedLevels || 0) + 1,
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
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-display font-bold text-green-700">
              Learning Phase: {currentLevel.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold mb-4">Joint letters you'll learn in this level:</h3>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mb-6">
                {currentLevel.letters.map((letter, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-green-500/10 rounded-lg flex flex-col items-center justify-center text-lg font-bold text-green-700 cursor-pointer hover:bg-green-500/20 transition-colors"
                    onClick={() => playSound(letter.joint)}
                  >
                    <div className="text-xl">{letter.joint}</div>
                    <div className="text-xs">{letter.romanization}</div>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <h4 className="font-bold text-green-800 mb-3">Game Instructions:</h4>
                <div className="text-left text-green-700">
                  {selectedGame === "recognition" && (
                    <ul className="space-y-2">
                      <li>• Look at each joint letter carefully</li>
                      <li>• Choose the correct sound from 4 options</li>
                      <li>• Learn how conjunct consonants work</li>
                    </ul>
                  )}
                  {selectedGame === "formation" && (
                    <ul className="space-y-2">
                      <li>• See how joint letters are formed</li>
                      <li>• Learn which letters combine together</li>
                      <li>• Understand the formation process</li>
                    </ul>
                  )}
                  {selectedGame === "breakdown" && (
                    <ul className="space-y-2">
                      <li>• Break joint letters into component parts</li>
                      <li>• Select the correct individual letters</li>
                      <li>• Practice decomposition skills</li>
                    </ul>
                  )}
                  {selectedGame === "quiz" && (
                    <ul className="space-y-2">
                      <li>• Listen to the sound description</li>
                      <li>• Choose the correct joint letter</li>
                      <li>• Test your recognition skills</li>
                    </ul>
                  )}
                </div>
              </div>

              <Button
                size="lg"
                onClick={() => setShowLearningPhase(false)}
                className="font-display font-bold bg-green-600 hover:bg-green-700"
              >
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
            <h2 className="text-xl font-display font-bold text-green-700">
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

        {selectedGame === "recognition" && (reviewMode ? wrongAnswers[currentLetterIndex] : currentLetter) && (
          <RecognitionGame
            letter={reviewMode ? wrongAnswers[currentLetterIndex] : currentLetter}
            onCorrect={() => {
              setScore(score + 1)
              nextLetter()
            }}
            onIncorrect={() => handleWrongAnswer(reviewMode ? wrongAnswers[currentLetterIndex] : currentLetter)}
          />
        )}

        {selectedGame === "formation" && (reviewMode ? wrongAnswers[currentLetterIndex] : currentLetter) && (
          <FormationGame
            letter={reviewMode ? wrongAnswers[currentLetterIndex] : currentLetter}
            onNext={() => nextLetter()}
          />
        )}

        {selectedGame === "breakdown" && (reviewMode ? wrongAnswers[currentLetterIndex] : currentLetter) && (
          <BreakdownGame
            letter={reviewMode ? wrongAnswers[currentLetterIndex] : currentLetter}
            onCorrect={() => {
              setScore(score + 1)
              nextLetter()
            }}
            onIncorrect={() => handleWrongAnswer(reviewMode ? wrongAnswers[currentLetterIndex] : currentLetter)}
          />
        )}

        {selectedGame === "quiz" && (reviewMode ? wrongAnswers[currentLetterIndex] : currentLetter) && (
          <JointQuizGame
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
          <h1 className="text-3xl font-display font-bold mb-2 text-green-700">{currentLevel.name}</h1>
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
                completedGames.includes(game.id) ? "border-green-500/50 bg-green-50" : "border-green-500/20"
              }`}
              onClick={() => setSelectedGame(game.id)}
            >
              <CardHeader>
                <CardTitle className="font-display text-green-700 flex items-center justify-between">
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
            <CardTitle className="font-display">Joint letters in this level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
              {currentLevel.letters.map((letter, index) => (
                <div
                  key={index}
                  className="aspect-square bg-green-500/10 rounded-lg flex items-center justify-center text-xl font-bold text-green-700 cursor-pointer hover:bg-green-500/20 transition-colors"
                  onClick={() => playSound(letter.joint)}
                >
                  {letter.joint}
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
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Joint Letters - যুক্তবর্ণ
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">Master conjunct consonants for advanced reading!</p>
      </div>

      <div className="space-y-4">
        {updatedLevels.map((level) => (
          <Card
            key={level.id}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
              level.unlocked ? "border-green-500/20 shadow-lg hover:shadow-xl" : "opacity-60 border-gray-300"
            }`}
            onClick={() => level.unlocked && setSelectedLevel(level.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-display font-bold mb-2 text-green-700">
                    Level {level.id}: {level.name}
                  </h3>
                  <p className="text-muted-foreground">{level.letters.length} joint letters to learn</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Progress</div>
                    <div className="text-lg font-bold">
                      {progress.modules["joint-letters"]?.completedLevels >= level.id ? level.letters.length : 0}/
                      {level.letters.length}
                    </div>
                  </div>
                  {level.unlocked ? (
                    <Button size="lg" className="font-display font-bold bg-green-600 hover:bg-green-700">
                      {progress.modules["joint-letters"]?.completedLevels >= level.id ? "Completed" : "Start Level"}
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

// Recognition Game Component
function RecognitionGame({
  letter,
  onCorrect,
  onIncorrect,
}: {
  letter: { joint: string; parts: string[]; romanization: string; meaning: string }
  onCorrect: () => void
  onIncorrect: () => void
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)

  const wrongAnswers = ["kto", "nto", "sto", "pro"].filter((a) => a !== letter.romanization).slice(0, 3)
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
        <h3 className="text-2xl font-display font-bold mb-6 text-green-700">What sound does this joint letter make?</h3>
        <div className="text-8xl font-bold text-green-600 mb-4 animate-bounce-gentle">{letter.joint}</div>
        <div className="text-sm text-muted-foreground mb-8">{letter.meaning}</div>
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

// Formation Game Component
function FormationGame({
  letter,
  onNext,
}: {
  letter: { joint: string; parts: string[]; romanization: string; meaning: string }
  onNext: () => void
}) {
  const [step, setStep] = useState(0)

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8 text-center">
        <h3 className="text-2xl font-display font-bold mb-6 text-green-700">How is this joint letter formed?</h3>

        {step === 0 && (
          <div className="space-y-6">
            <div className="text-6xl font-bold text-green-600 mb-4">{letter.joint}</div>
            <p className="text-lg text-muted-foreground">{letter.meaning}</p>
            <Button size="lg" onClick={() => setStep(1)} className="font-display font-bold">
              Show Formation
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-4 text-4xl font-bold">
              <span className="text-blue-600">{letter.parts[0]}</span>
              <span className="text-2xl text-muted-foreground">+</span>
              <span className="text-purple-600">{letter.parts[1]}</span>
              <span className="text-2xl text-muted-foreground">=</span>
              <span className="text-green-600">{letter.joint}</span>
            </div>
            <p className="text-lg">
              <span className="font-bold text-blue-600">{letter.parts[0]}</span> combines with{" "}
              <span className="font-bold text-purple-600">{letter.parts[1]}</span> to form{" "}
              <span className="font-bold text-green-600">{letter.joint}</span>
            </p>
            <Button size="lg" onClick={onNext} className="font-display font-bold">
              Next Letter
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Breakdown Game Component
function BreakdownGame({
  letter,
  onCorrect,
  onIncorrect,
}: {
  letter: { joint: string; parts: string[]; romanization: string; meaning: string }
  onCorrect: () => void
  onIncorrect: () => void
}) {
  const [selectedParts, setSelectedParts] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)

  const allParts = ["ক", "গ", "চ", "ত", "দ", "ন", "প", "ব", "ম", "র", "ল", "স", "হ", "ষ", "শ"]
  const availableParts = allParts.sort(() => Math.random() - 0.5).slice(0, 6)

  // Ensure correct parts are included
  letter.parts.forEach((part) => {
    if (!availableParts.includes(part)) {
      availableParts[Math.floor(Math.random() * availableParts.length)] = part
    }
  })

  const handlePartClick = (part: string) => {
    if (selectedParts.includes(part)) {
      setSelectedParts(selectedParts.filter((p) => p !== part))
    } else if (selectedParts.length < 2) {
      setSelectedParts([...selectedParts, part])
    }
  }

  const checkAnswer = () => {
    setShowResult(true)
    const isCorrect =
      selectedParts.length === letter.parts.length && selectedParts.every((part) => letter.parts.includes(part))

    setTimeout(() => {
      if (isCorrect) {
        onCorrect()
      } else {
        onIncorrect()
      }
      setSelectedParts([])
      setShowResult(false)
    }, 1500)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8 text-center">
        <h3 className="text-2xl font-display font-bold mb-6 text-green-700">Break down this joint letter</h3>
        <div className="text-6xl font-bold text-green-600 mb-6">{letter.joint}</div>

        <div className="mb-6">
          <p className="text-lg mb-4">Select the letters that form this joint:</p>
          <div className="flex justify-center gap-2 mb-4">
            {selectedParts.map((part, index) => (
              <div
                key={index}
                className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-xl font-bold text-blue-600"
              >
                {part}
              </div>
            ))}
            {Array.from({ length: 2 - selectedParts.length }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="w-12 h-12 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300"
              ></div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {availableParts.map((part) => (
            <Button
              key={part}
              variant={selectedParts.includes(part) ? "default" : "outline"}
              onClick={() => !showResult && handlePartClick(part)}
              disabled={showResult}
              className="text-xl font-bold h-12"
            >
              {part}
            </Button>
          ))}
        </div>

        <Button
          size="lg"
          onClick={checkAnswer}
          disabled={selectedParts.length !== 2 || showResult}
          className="font-display font-bold"
        >
          Check Answer
        </Button>

        {showResult && (
          <div className="mt-4">
            {selectedParts.length === letter.parts.length &&
            selectedParts.every((part) => letter.parts.includes(part)) ? (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="w-6 h-6" />
                <span className="font-bold">Correct!</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-red-600">
                <XCircle className="w-6 h-6" />
                <span className="font-bold">Try again! Correct answer: {letter.parts.join(" + ")}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Joint Quiz Game Component
function JointQuizGame({
  letter,
  allLetters,
  onCorrect,
  onIncorrect,
}: {
  letter: { joint: string; parts: string[]; romanization: string; meaning: string }
  allLetters: { joint: string; parts: string[]; romanization: string; meaning: string }[]
  onCorrect: () => void
  onIncorrect: () => void
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)

  const wrongAnswers = allLetters
    .filter((l) => l.joint !== letter.joint)
    .map((l) => l.joint)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)

  const allAnswers = [letter.joint, ...wrongAnswers].sort(() => Math.random() - 0.5)

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    setShowResult(true)
    setTimeout(() => {
      if (answer === letter.joint) {
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
        <h3 className="text-2xl font-display font-bold mb-6 text-green-700">Which joint letter sounds like this?</h3>
        <div className="text-3xl font-bold text-green-600 mb-2">{letter.romanization}</div>
        <div className="text-lg text-muted-foreground mb-8">{letter.meaning}</div>
        <div className="grid grid-cols-2 gap-4">
          {allAnswers.map((answer) => (
            <Button
              key={answer}
              variant={selectedAnswer === answer ? (answer === letter.joint ? "default" : "destructive") : "outline"}
              size="lg"
              onClick={() => !showResult && handleAnswer(answer)}
              disabled={showResult}
              className="text-3xl font-bold h-20"
            >
              {answer}
              {showResult &&
                selectedAnswer === answer &&
                (answer === letter.joint ? (
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
