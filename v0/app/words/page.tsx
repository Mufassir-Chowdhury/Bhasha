"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Star, CheckCircle, XCircle, RotateCcw, BookOpen } from "lucide-react"
import Link from "next/link"

// Word categories with Bangla vocabulary
const wordCategories = {
  animals: {
    name: "Animals",
    nameBangla: "প্রাণী",
    icon: "🐱",
    color: "bg-orange-500",
    words: [
      { bangla: "বিড়াল", english: "Cat", romanization: "biraal" },
      { bangla: "কুকুর", english: "Dog", romanization: "kukur" },
      { bangla: "গরু", english: "Cow", romanization: "goru" },
      { bangla: "ছাগল", english: "Goat", romanization: "chagol" },
      { bangla: "ঘোড়া", english: "Horse", romanization: "ghora" },
      { bangla: "হাতি", english: "Elephant", romanization: "hati" },
      { bangla: "বাঘ", english: "Tiger", romanization: "bagh" },
      { bangla: "সিংহ", english: "Lion", romanization: "singho" },
      { bangla: "পাখি", english: "Bird", romanization: "pakhi" },
      { bangla: "মাছ", english: "Fish", romanization: "mach" },
      { bangla: "খরগোশ", english: "Rabbit", romanization: "khorgosh" },
      { bangla: "ভেড়া", english: "Sheep", romanization: "bhera" },
    ],
  },
  colors: {
    name: "Colors",
    nameBangla: "রং",
    icon: "🎨",
    color: "bg-pink-500",
    words: [
      { bangla: "লাল", english: "Red", romanization: "laal" },
      { bangla: "নীল", english: "Blue", romanization: "neel" },
      { bangla: "সবুজ", english: "Green", romanization: "shobuj" },
      { bangla: "হলুদ", english: "Yellow", romanization: "holud" },
      { bangla: "কালো", english: "Black", romanization: "kalo" },
      { bangla: "সাদা", english: "White", romanization: "shada" },
      { bangla: "গোলাপি", english: "Pink", romanization: "golapi" },
      { bangla: "বেগুনি", english: "Purple", romanization: "beguni" },
      { bangla: "কমলা", english: "Orange", romanization: "komola" },
      { bangla: "ধূসর", english: "Gray", romanization: "dhusor" },
    ],
  },
  numbers: {
    name: "Numbers",
    nameBangla: "সংখ্যা",
    icon: "🔢",
    color: "bg-blue-500",
    words: [
      { bangla: "এক", english: "One", romanization: "ek" },
      { bangla: "দুই", english: "Two", romanization: "dui" },
      { bangla: "তিন", english: "Three", romanization: "tin" },
      { bangla: "চার", english: "Four", romanization: "char" },
      { bangla: "পাঁচ", english: "Five", romanization: "panch" },
      { bangla: "ছয়", english: "Six", romanization: "choy" },
      { bangla: "সাত", english: "Seven", romanization: "saat" },
      { bangla: "আট", english: "Eight", romanization: "aat" },
      { bangla: "নয়", english: "Nine", romanization: "noy" },
      { bangla: "দশ", english: "Ten", romanization: "dosh" },
    ],
  },
  family: {
    name: "Family",
    nameBangla: "পরিবার",
    icon: "👨‍👩‍👧‍👦",
    color: "bg-red-500",
    words: [
      { bangla: "মা", english: "Mother", romanization: "ma" },
      { bangla: "বাবা", english: "Father", romanization: "baba" },
      { bangla: "ভাই", english: "Brother", romanization: "bhai" },
      { bangla: "বোন", english: "Sister", romanization: "bon" },
      { bangla: "দাদা", english: "Grandfather", romanization: "dada" },
      { bangla: "দাদি", english: "Grandmother", romanization: "dadi" },
      { bangla: "নানা", english: "Maternal Grandfather", romanization: "nana" },
      { bangla: "নানি", english: "Maternal Grandmother", romanization: "nani" },
      { bangla: "চাচা", english: "Uncle", romanization: "chacha" },
      { bangla: "চাচি", english: "Aunt", romanization: "chachi" },
    ],
  },
  bodyParts: {
    name: "Body Parts",
    nameBangla: "শরীরের অংশ",
    icon: "👤",
    color: "bg-green-500",
    words: [
      { bangla: "মাথা", english: "Head", romanization: "matha" },
      { bangla: "চোখ", english: "Eye", romanization: "chokh" },
      { bangla: "নাক", english: "Nose", romanization: "naak" },
      { bangla: "মুখ", english: "Mouth", romanization: "mukh" },
      { bangla: "কান", english: "Ear", romanization: "kaan" },
      { bangla: "হাত", english: "Hand", romanization: "haat" },
      { bangla: "পা", english: "Foot", romanization: "paa" },
      { bangla: "আঙুল", english: "Finger", romanization: "angul" },
      { bangla: "দাঁত", english: "Tooth", romanization: "daat" },
      { bangla: "চুল", english: "Hair", romanization: "chul" },
    ],
  },
  food: {
    name: "Food",
    nameBangla: "খাবার",
    icon: "🍎",
    color: "bg-yellow-500",
    words: [
      { bangla: "ভাত", english: "Rice", romanization: "bhaat" },
      { bangla: "রুটি", english: "Bread", romanization: "ruti" },
      { bangla: "মাছ", english: "Fish", romanization: "mach" },
      { bangla: "মাংস", english: "Meat", romanization: "mangsho" },
      { bangla: "দুধ", english: "Milk", romanization: "dudh" },
      { bangla: "পানি", english: "Water", romanization: "paani" },
      { bangla: "আম", english: "Mango", romanization: "aam" },
      { bangla: "কলা", english: "Banana", romanization: "kola" },
      { bangla: "আপেল", english: "Apple", romanization: "apel" },
      { bangla: "ডিম", english: "Egg", romanization: "dim" },
    ],
  },
}

const gameTypes = [
  { id: "flashcard", name: "Word Cards", description: "Learn word meanings" },
  { id: "matching", name: "Match Words", description: "Match Bangla to English" },
  { id: "spelling", name: "Spelling", description: "Practice spelling words" },
  { id: "quiz", name: "Word Quiz", description: "Test your vocabulary" },
]

export default function WordsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  const currentCategoryData = selectedCategory ? wordCategories[selectedCategory as keyof typeof wordCategories] : null
  const currentWord = currentCategoryData?.words[currentWordIndex]

  const playSound = (word: string) => {
    console.log(`Playing sound for: ${word}`)
  }

  const nextWord = () => {
    if (currentCategoryData && currentWordIndex < currentCategoryData.words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1)
      setShowAnswer(false)
    } else {
      setSelectedGame(null)
      setSelectedCategory(null)
      setCurrentWordIndex(0)
    }
  }

  const resetGame = () => {
    setCurrentWordIndex(0)
    setScore(0)
    setShowAnswer(false)
  }

  if (selectedCategory && selectedGame && currentCategoryData) {
    return (
      <div className="min-h-screen p-4 max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedGame(null)
              setSelectedCategory(null)
              setCurrentWordIndex(0)
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-bold">{score}</span>
            </div>
            <Button variant="outline" size="sm" onClick={resetGame}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </header>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-display font-bold">
              {currentCategoryData.name} - {currentCategoryData.nameBangla}
            </h2>
            <span className="text-sm text-muted-foreground">
              {currentWordIndex + 1} / {currentCategoryData.words.length}
            </span>
          </div>
          <Progress value={((currentWordIndex + 1) / currentCategoryData.words.length) * 100} className="h-2" />
        </div>

        {selectedGame === "flashcard" && currentWord && (
          <WordFlashcard
            word={currentWord}
            onNext={() => nextWord()}
            showAnswer={showAnswer}
            setShowAnswer={setShowAnswer}
            onCorrect={() => setScore(score + 1)}
          />
        )}

        {selectedGame === "matching" && currentWord && (
          <WordMatchingGame
            word={currentWord}
            allWords={currentCategoryData.words}
            onCorrect={() => {
              setScore(score + 1)
              nextWord()
            }}
            onIncorrect={() => nextWord()}
          />
        )}

        {selectedGame === "spelling" && currentWord && (
          <SpellingGame
            word={currentWord}
            onCorrect={() => {
              setScore(score + 1)
              nextWord()
            }}
            onIncorrect={() => nextWord()}
          />
        )}

        {selectedGame === "quiz" && currentWord && (
          <WordQuizGame
            word={currentWord}
            allWords={currentCategoryData.words}
            onCorrect={() => {
              setScore(score + 1)
              nextWord()
            }}
            onIncorrect={() => nextWord()}
          />
        )}
      </div>
    )
  }

  if (selectedCategory && currentCategoryData) {
    return (
      <div className="min-h-screen p-4 max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => setSelectedCategory(null)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>
        </header>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{currentCategoryData.icon}</div>
          <h1 className="text-3xl font-display font-bold mb-2">
            {currentCategoryData.name} - {currentCategoryData.nameBangla}
          </h1>
          <p className="text-muted-foreground">Choose a game to practice these words</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {gameTypes.map((game) => (
            <Card
              key={game.id}
              className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 border-purple-500/20"
              onClick={() => setSelectedGame(game.id)}
            >
              <CardHeader>
                <CardTitle className="font-display text-purple-700">{game.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{game.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-display">Words in this category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {currentCategoryData.words.map((word, index) => (
                <div
                  key={index}
                  className="p-4 bg-purple-500/10 rounded-lg text-center cursor-pointer hover:bg-purple-500/20 transition-colors"
                  onClick={() => playSound(word.bangla)}
                >
                  <div className="text-2xl font-bold text-purple-700 mb-1">{word.bangla}</div>
                  <div className="text-sm text-muted-foreground">{word.english}</div>
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
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Words - শব্দ
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">Build your Bangla vocabulary with fun categories!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(wordCategories).map(([key, category]) => (
          <Card
            key={key}
            className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 border-purple-500/20"
            onClick={() => setSelectedCategory(key)}
          >
            <CardContent className="p-6 text-center">
              <div className="text-6xl mb-4 animate-bounce-gentle">{category.icon}</div>
              <h3 className="text-xl font-display font-bold mb-2 text-purple-700">{category.name}</h3>
              <p className="text-2xl font-bold text-purple-600 mb-3">{category.nameBangla}</p>
              <p className="text-muted-foreground mb-4">{category.words.length} words to learn</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>0/{category.words.length}</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Word Flashcard Component
function WordFlashcard({
  word,
  onNext,
  showAnswer,
  setShowAnswer,
  onCorrect,
}: {
  word: { bangla: string; english: string; romanization: string }
  onNext: () => void
  showAnswer: boolean
  setShowAnswer: (show: boolean) => void
  onCorrect: () => void
}) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8 text-center">
        <div className="mb-8">
          <div className="text-8xl font-bold text-purple-600 mb-4 animate-bounce-gentle">{word.bangla}</div>
          <div className="text-2xl font-bold text-purple-500 mb-2">{word.romanization}</div>
        </div>

        {!showAnswer ? (
          <Button size="lg" onClick={() => setShowAnswer(true)} className="font-display font-bold">
            Show Meaning
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="text-3xl font-bold text-green-600">{word.english}</div>
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  onCorrect()
                  onNext()
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />I knew it!
              </Button>
              <Button variant="outline" onClick={onNext}>
                <XCircle className="w-4 h-4 mr-2 text-red-500" />
                Need practice
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Word Matching Game Component
function WordMatchingGame({
  word,
  allWords,
  onCorrect,
  onIncorrect,
}: {
  word: { bangla: string; english: string; romanization: string }
  allWords: { bangla: string; english: string; romanization: string }[]
  onCorrect: () => void
  onIncorrect: () => void
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)

  const wrongAnswers = allWords
    .filter((w) => w.english !== word.english)
    .map((w) => w.english)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)

  const allAnswers = [word.english, ...wrongAnswers].sort(() => Math.random() - 0.5)

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    setShowResult(true)
    setTimeout(() => {
      if (answer === word.english) {
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
        <h3 className="text-2xl font-display font-bold mb-6 text-purple-700">What does this word mean?</h3>
        <div className="text-8xl font-bold text-purple-600 mb-4 animate-bounce-gentle">{word.bangla}</div>
        <div className="text-2xl font-bold text-purple-500 mb-8">{word.romanization}</div>
        <div className="grid grid-cols-2 gap-4">
          {allAnswers.map((answer) => (
            <Button
              key={answer}
              variant={selectedAnswer === answer ? (answer === word.english ? "default" : "destructive") : "outline"}
              size="lg"
              onClick={() => !showResult && handleAnswer(answer)}
              disabled={showResult}
              className="text-lg font-bold h-16"
            >
              {answer}
              {showResult &&
                selectedAnswer === answer &&
                (answer === word.english ? (
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

// Spelling Game Component
function SpellingGame({
  word,
  onCorrect,
  onIncorrect,
}: {
  word: { bangla: string; english: string; romanization: string }
  onCorrect: () => void
  onIncorrect: () => void
}) {
  const [userInput, setUserInput] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const checkSpelling = () => {
    const correct = userInput.toLowerCase().trim() === word.english.toLowerCase()
    setIsCorrect(correct)
    setShowResult(true)
    setTimeout(() => {
      if (correct) {
        onCorrect()
      } else {
        onIncorrect()
      }
      setUserInput("")
      setShowResult(false)
    }, 2000)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8 text-center">
        <h3 className="text-2xl font-display font-bold mb-6 text-purple-700">Spell this word in English</h3>
        <div className="text-6xl font-bold text-purple-600 mb-4 animate-bounce-gentle">{word.bangla}</div>
        <div className="text-xl font-bold text-purple-500 mb-8">{word.romanization}</div>

        <div className="space-y-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type the English word..."
            className="w-full p-4 text-xl text-center border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none"
            disabled={showResult}
            onKeyPress={(e) => e.key === "Enter" && !showResult && checkSpelling()}
          />

          <Button
            size="lg"
            onClick={checkSpelling}
            disabled={!userInput.trim() || showResult}
            className="font-display font-bold"
          >
            Check Spelling
          </Button>

          {showResult && (
            <div className="mt-4">
              {isCorrect ? (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-bold text-xl">Correct! Well done!</span>
                </div>
              ) : (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-red-600 mb-2">
                    <XCircle className="w-6 h-6" />
                    <span className="font-bold">Not quite right!</span>
                  </div>
                  <div className="text-lg">
                    Correct spelling: <span className="font-bold text-green-600">{word.english}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Word Quiz Game Component
function WordQuizGame({
  word,
  allWords,
  onCorrect,
  onIncorrect,
}: {
  word: { bangla: string; english: string; romanization: string }
  allWords: { bangla: string; english: string; romanization: string }[]
  onCorrect: () => void
  onIncorrect: () => void
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)

  const wrongAnswers = allWords
    .filter((w) => w.bangla !== word.bangla)
    .map((w) => w.bangla)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)

  const allAnswers = [word.bangla, ...wrongAnswers].sort(() => Math.random() - 0.5)

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    setShowResult(true)
    setTimeout(() => {
      if (answer === word.bangla) {
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
        <h3 className="text-2xl font-display font-bold mb-6 text-purple-700">Which word means "{word.english}"?</h3>
        <div className="text-xl text-muted-foreground mb-8">({word.romanization})</div>
        <div className="grid grid-cols-2 gap-4">
          {allAnswers.map((answer) => (
            <Button
              key={answer}
              variant={selectedAnswer === answer ? (answer === word.bangla ? "default" : "destructive") : "outline"}
              size="lg"
              onClick={() => !showResult && handleAnswer(answer)}
              disabled={showResult}
              className="text-2xl font-bold h-20"
            >
              {answer}
              {showResult &&
                selectedAnswer === answer &&
                (answer === word.bangla ? (
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
