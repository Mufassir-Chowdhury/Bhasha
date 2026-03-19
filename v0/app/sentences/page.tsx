"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Star, CheckCircle, XCircle, RotateCcw, MessageSquare } from "lucide-react"
import Link from "next/link"

// Sentence categories with common Bangla phrases
const sentenceCategories = {
  greetings: {
    name: "Greetings",
    nameBangla: "শুভেচ্ছা",
    icon: "👋",
    color: "bg-orange-500",
    sentences: [
      { bangla: "আসসালামু আলাইকুম", english: "Peace be upon you", romanization: "Assalamu alaikum" },
      { bangla: "নমস্কার", english: "Hello/Goodbye", romanization: "Nomoshkar" },
      { bangla: "সুপ্রভাত", english: "Good morning", romanization: "Suprobhat" },
      { bangla: "শুভ সন্ধ্যা", english: "Good evening", romanization: "Shubho shondha" },
      { bangla: "শুভ রাত্রি", english: "Good night", romanization: "Shubho ratri" },
      { bangla: "আপনি কেমন আছেন?", english: "How are you?", romanization: "Apni kemon achen?" },
      { bangla: "আমি ভালো আছি", english: "I am fine", romanization: "Ami bhalo achi" },
      { bangla: "ধন্যবাদ", english: "Thank you", romanization: "Dhonnobad" },
    ],
  },
  introductions: {
    name: "Introductions",
    nameBangla: "পরিচয়",
    icon: "🤝",
    color: "bg-blue-500",
    sentences: [
      { bangla: "আমার নাম রহিম", english: "My name is Rahim", romanization: "Amar naam Rahim" },
      { bangla: "আপনার নাম কি?", english: "What is your name?", romanization: "Apnar naam ki?" },
      { bangla: "আমি বাংলাদেশী", english: "I am Bangladeshi", romanization: "Ami Bangladeshi" },
      { bangla: "আমি ঢাকায় থাকি", english: "I live in Dhaka", romanization: "Ami Dhakay thaki" },
      { bangla: "আমার বয়স দশ বছর", english: "I am ten years old", romanization: "Amar boyosh dosh bochor" },
      { bangla: "এটা আমার বন্ধু", english: "This is my friend", romanization: "Eta amar bondhu" },
      { bangla: "আপনি কোথায় থাকেন?", english: "Where do you live?", romanization: "Apni kothay thaken?" },
      { bangla: "আমি স্কুলে পড়ি", english: "I study at school", romanization: "Ami school-e pori" },
    ],
  },
  family: {
    name: "Family Talk",
    nameBangla: "পারিবারিক কথা",
    icon: "👨‍👩‍👧‍👦",
    color: "bg-red-500",
    sentences: [
      { bangla: "এটা আমার মা", english: "This is my mother", romanization: "Eta amar ma" },
      { bangla: "আমার বাবা কাজে গেছেন", english: "My father has gone to work", romanization: "Amar baba kaje gechen" },
      { bangla: "আমার একটি ভাই আছে", english: "I have one brother", romanization: "Amar ekti bhai ache" },
      { bangla: "আমার বোন খুব সুন্দর", english: "My sister is very beautiful", romanization: "Amar bon khub shundor" },
      { bangla: "দাদা গল্প বলেন", english: "Grandfather tells stories", romanization: "Dada golpo bolen" },
      { bangla: "দাদি রান্না করেন", english: "Grandmother cooks", romanization: "Dadi ranna koren" },
      { bangla: "আমরা সবাই একসাথে খাই", english: "We all eat together", romanization: "Amra sobai ekshathe khai" },
      { bangla: "পরিবার আমার প্রিয়", english: "Family is my favorite", romanization: "Poribar amar priyo" },
    ],
  },
  daily: {
    name: "Daily Activities",
    nameBangla: "দৈনন্দিন কাজ",
    icon: "🌅",
    color: "bg-green-500",
    sentences: [
      {
        bangla: "আমি সকালে ঘুম থেকে উঠি",
        english: "I wake up in the morning",
        romanization: "Ami shokale ghum theke uthi",
      },
      { bangla: "আমি দাঁত ব্রাশ করি", english: "I brush my teeth", romanization: "Ami daat brush kori" },
      { bangla: "আমি স্নান করি", english: "I take a bath", romanization: "Ami snan kori" },
      { bangla: "আমি নাশতা খাই", english: "I eat breakfast", romanization: "Ami nashta khai" },
      { bangla: "আমি স্কুলে যাই", english: "I go to school", romanization: "Ami school-e jai" },
      { bangla: "আমি বই পড়ি", english: "I read books", romanization: "Ami boi pori" },
      { bangla: "আমি খেলা করি", english: "I play games", romanization: "Ami khela kori" },
      { bangla: "আমি রাতে ঘুমাই", english: "I sleep at night", romanization: "Ami rate ghumai" },
    ],
  },
  questions: {
    name: "Questions",
    nameBangla: "প্রশ্ন",
    icon: "❓",
    color: "bg-purple-500",
    sentences: [
      { bangla: "এটা কি?", english: "What is this?", romanization: "Eta ki?" },
      { bangla: "এটা কোথায়?", english: "Where is this?", romanization: "Eta kothay?" },
      { bangla: "কখন আসবেন?", english: "When will you come?", romanization: "Kokhon ashben?" },
      { bangla: "কেন দেরি হলো?", english: "Why are you late?", romanization: "Keno deri holo?" },
      { bangla: "কিভাবে করবো?", english: "How to do it?", romanization: "Kibhabe korbo?" },
      { bangla: "কতটা লাগবে?", english: "How much will it take?", romanization: "Kotota lagbe?" },
      { bangla: "কার সাথে যাবে?", english: "With whom will you go?", romanization: "Kar shathe jabe?" },
      { bangla: "কোনটা ভালো?", english: "Which one is better?", romanization: "Konota bhalo?" },
    ],
  },
  polite: {
    name: "Polite Expressions",
    nameBangla: "ভদ্রতার কথা",
    icon: "🙏",
    color: "bg-pink-500",
    sentences: [
      { bangla: "দয়া করে", english: "Please", romanization: "Doya kore" },
      { bangla: "মাফ করবেন", english: "Excuse me/Sorry", romanization: "Maaf korben" },
      { bangla: "কোন সমস্যা নেই", english: "No problem", romanization: "Kon shomoshsha nei" },
      { bangla: "আপনাকে স্বাগতম", english: "You are welcome", romanization: "Apnake shagatom" },
      { bangla: "সাহায্য করবেন?", english: "Will you help?", romanization: "Shahajjo korben?" },
      { bangla: "অনুমতি আছে?", english: "May I have permission?", romanization: "Onumoti ache?" },
      { bangla: "আমি দুঃখিত", english: "I am sorry", romanization: "Ami dukhito" },
      { bangla: "আপনি খুব ভালো", english: "You are very good", romanization: "Apni khub bhalo" },
    ],
  },
}

const gameTypes = [
  { id: "reading", name: "Sentence Reading", description: "Learn to read sentences" },
  { id: "translation", name: "Translation", description: "Translate sentences" },
  { id: "building", name: "Sentence Building", description: "Build sentences from words" },
  { id: "fillblanks", name: "Fill the Blanks", description: "Complete the sentences" },
]

export default function SentencesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  const currentCategoryData = selectedCategory
    ? sentenceCategories[selectedCategory as keyof typeof sentenceCategories]
    : null
  const currentSentence = currentCategoryData?.sentences[currentSentenceIndex]

  const playSound = (sentence: string) => {
    console.log(`Playing sound for: ${sentence}`)
  }

  const nextSentence = () => {
    if (currentCategoryData && currentSentenceIndex < currentCategoryData.sentences.length - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1)
      setShowAnswer(false)
    } else {
      setSelectedGame(null)
      setSelectedCategory(null)
      setCurrentSentenceIndex(0)
    }
  }

  const resetGame = () => {
    setCurrentSentenceIndex(0)
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
              setCurrentSentenceIndex(0)
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
              {currentSentenceIndex + 1} / {currentCategoryData.sentences.length}
            </span>
          </div>
          <Progress value={((currentSentenceIndex + 1) / currentCategoryData.sentences.length) * 100} className="h-2" />
        </div>

        {selectedGame === "reading" && currentSentence && (
          <SentenceReading
            sentence={currentSentence}
            onNext={() => nextSentence()}
            showAnswer={showAnswer}
            setShowAnswer={setShowAnswer}
            onCorrect={() => setScore(score + 1)}
          />
        )}

        {selectedGame === "translation" && currentSentence && (
          <TranslationGame
            sentence={currentSentence}
            onCorrect={() => {
              setScore(score + 1)
              nextSentence()
            }}
            onIncorrect={() => nextSentence()}
          />
        )}

        {selectedGame === "building" && currentSentence && (
          <SentenceBuildingGame
            sentence={currentSentence}
            onCorrect={() => {
              setScore(score + 1)
              nextSentence()
            }}
            onIncorrect={() => nextSentence()}
          />
        )}

        {selectedGame === "fillblanks" && currentSentence && (
          <FillBlanksGame
            sentence={currentSentence}
            onCorrect={() => {
              setScore(score + 1)
              nextSentence()
            }}
            onIncorrect={() => nextSentence()}
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
          <p className="text-muted-foreground">Choose a game to practice these sentences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {gameTypes.map((game) => (
            <Card
              key={game.id}
              className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 border-orange-500/20"
              onClick={() => setSelectedGame(game.id)}
            >
              <CardHeader>
                <CardTitle className="font-display text-orange-700">{game.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{game.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-display">Sentences in this category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentCategoryData.sentences.map((sentence, index) => (
                <div
                  key={index}
                  className="p-4 bg-orange-500/10 rounded-lg cursor-pointer hover:bg-orange-500/20 transition-colors"
                  onClick={() => playSound(sentence.bangla)}
                >
                  <div className="text-xl font-bold text-orange-700 mb-1">{sentence.bangla}</div>
                  <div className="text-sm text-orange-600 mb-1">{sentence.romanization}</div>
                  <div className="text-sm text-muted-foreground">{sentence.english}</div>
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
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Sentences - বাক্য
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">Learn common Bangla phrases and sentences!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(sentenceCategories).map(([key, category]) => (
          <Card
            key={key}
            className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 border-orange-500/20"
            onClick={() => setSelectedCategory(key)}
          >
            <CardContent className="p-6 text-center">
              <div className="text-6xl mb-4 animate-bounce-gentle">{category.icon}</div>
              <h3 className="text-xl font-display font-bold mb-2 text-orange-700">{category.name}</h3>
              <p className="text-2xl font-bold text-orange-600 mb-3">{category.nameBangla}</p>
              <p className="text-muted-foreground mb-4">{category.sentences.length} sentences to learn</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>0/{category.sentences.length}</span>
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

// Sentence Reading Component
function SentenceReading({
  sentence,
  onNext,
  showAnswer,
  setShowAnswer,
  onCorrect,
}: {
  sentence: { bangla: string; english: string; romanization: string }
  onNext: () => void
  showAnswer: boolean
  setShowAnswer: (show: boolean) => void
  onCorrect: () => void
}) {
  return (
    <Card className="max-w-3xl mx-auto">
      <CardContent className="p-8 text-center">
        <div className="mb-8">
          <div className="text-4xl font-bold text-orange-600 mb-4 animate-bounce-gentle leading-relaxed">
            {sentence.bangla}
          </div>
          <div className="text-xl font-bold text-orange-500 mb-2">{sentence.romanization}</div>
        </div>

        {!showAnswer ? (
          <Button size="lg" onClick={() => setShowAnswer(true)} className="font-display font-bold">
            Show Meaning
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="text-2xl font-bold text-green-600">{sentence.english}</div>
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  onCorrect()
                  onNext()
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />I understood!
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

// Translation Game Component
function TranslationGame({
  sentence,
  onCorrect,
  onIncorrect,
}: {
  sentence: { bangla: string; english: string; romanization: string }
  onCorrect: () => void
  onIncorrect: () => void
}) {
  const [userInput, setUserInput] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const checkTranslation = () => {
    const userWords = userInput.toLowerCase().trim().split(/\s+/)
    const correctWords = sentence.english.toLowerCase().split(/\s+/)

    // Check if at least 70% of words match
    const matchingWords = userWords.filter((word) =>
      correctWords.some((correctWord) => correctWord.includes(word) || word.includes(correctWord)),
    )

    const correct = matchingWords.length >= Math.ceil(correctWords.length * 0.7)
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
    }, 2500)
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardContent className="p-8 text-center">
        <h3 className="text-2xl font-display font-bold mb-6 text-orange-700">Translate this sentence to English</h3>
        <div className="text-3xl font-bold text-orange-600 mb-4 leading-relaxed">{sentence.bangla}</div>
        <div className="text-lg font-bold text-orange-500 mb-8">{sentence.romanization}</div>

        <div className="space-y-4">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type the English translation..."
            className="w-full p-4 text-lg text-center border-2 border-orange-300 rounded-lg focus:border-orange-500 focus:outline-none resize-none"
            rows={3}
            disabled={showResult}
          />

          <Button
            size="lg"
            onClick={checkTranslation}
            disabled={!userInput.trim() || showResult}
            className="font-display font-bold"
          >
            Check Translation
          </Button>

          {showResult && (
            <div className="mt-4">
              {isCorrect ? (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-bold text-xl">Great translation!</span>
                </div>
              ) : (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-red-600 mb-2">
                    <XCircle className="w-6 h-6" />
                    <span className="font-bold">Good try!</span>
                  </div>
                  <div className="text-lg">
                    Correct translation: <span className="font-bold text-green-600">{sentence.english}</span>
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

// Sentence Building Game Component
function SentenceBuildingGame({
  sentence,
  onCorrect,
  onIncorrect,
}: {
  sentence: { bangla: string; english: string; romanization: string }
  onCorrect: () => void
  onIncorrect: () => void
}) {
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)

  // Split sentence into words and shuffle
  const correctWords = sentence.bangla.split(" ")
  const shuffledWords = [...correctWords].sort(() => Math.random() - 0.5)

  const handleWordClick = (word: string, index: number) => {
    if (selectedWords.includes(`${word}-${index}`)) {
      setSelectedWords(selectedWords.filter((w) => w !== `${word}-${index}`))
    } else {
      setSelectedWords([...selectedWords, `${word}-${index}`])
    }
  }

  const checkSentence = () => {
    const userSentence = selectedWords.map((w) => w.split("-")[0]).join(" ")
    const isCorrect = userSentence === sentence.bangla
    setShowResult(true)

    setTimeout(() => {
      if (isCorrect) {
        onCorrect()
      } else {
        onIncorrect()
      }
      setSelectedWords([])
      setShowResult(false)
    }, 2000)
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardContent className="p-8 text-center">
        <h3 className="text-2xl font-display font-bold mb-6 text-orange-700">Build this sentence</h3>
        <div className="text-xl text-muted-foreground mb-2">{sentence.english}</div>
        <div className="text-lg text-orange-500 mb-8">{sentence.romanization}</div>

        <div className="mb-6">
          <p className="text-lg mb-4">Your sentence:</p>
          <div className="min-h-16 p-4 bg-orange-50 rounded-lg border-2 border-dashed border-orange-300 flex flex-wrap gap-2 items-center justify-center">
            {selectedWords.length > 0 ? (
              selectedWords.map((wordWithIndex, index) => {
                const word = wordWithIndex.split("-")[0]
                return (
                  <span key={index} className="px-3 py-1 bg-orange-200 rounded-lg text-lg font-bold">
                    {word}
                  </span>
                )
              })
            ) : (
              <span className="text-muted-foreground">Select words to build the sentence</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {shuffledWords.map((word, index) => (
            <Button
              key={`${word}-${index}`}
              variant={selectedWords.includes(`${word}-${index}`) ? "default" : "outline"}
              onClick={() => !showResult && handleWordClick(word, index)}
              disabled={showResult}
              className="text-lg font-bold h-12"
            >
              {word}
            </Button>
          ))}
        </div>

        <Button
          size="lg"
          onClick={checkSentence}
          disabled={selectedWords.length !== correctWords.length || showResult}
          className="font-display font-bold"
        >
          Check Sentence
        </Button>

        {showResult && (
          <div className="mt-4">
            {selectedWords.map((w) => w.split("-")[0]).join(" ") === sentence.bangla ? (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="w-6 h-6" />
                <span className="font-bold text-xl">Perfect sentence!</span>
              </div>
            ) : (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-red-600 mb-2">
                  <XCircle className="w-6 h-6" />
                  <span className="font-bold">Try again!</span>
                </div>
                <div className="text-lg">
                  Correct sentence: <span className="font-bold text-green-600">{sentence.bangla}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Fill in the Blanks Game Component
function FillBlanksGame({
  sentence,
  onCorrect,
  onIncorrect,
}: {
  sentence: { bangla: string; english: string; romanization: string }
  onCorrect: () => void
  onIncorrect: () => void
}) {
  const [userInput, setUserInput] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  // Remove a random word from the sentence
  const words = sentence.bangla.split(" ")
  const randomIndex = Math.floor(Math.random() * words.length)
  const missingWord = words[randomIndex]
  const sentenceWithBlank = words.map((word, index) => (index === randomIndex ? "____" : word)).join(" ")

  const checkAnswer = () => {
    const correct = userInput.trim() === missingWord
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
    <Card className="max-w-3xl mx-auto">
      <CardContent className="p-8 text-center">
        <h3 className="text-2xl font-display font-bold mb-6 text-orange-700">Fill in the missing word</h3>
        <div className="text-xl text-muted-foreground mb-2">{sentence.english}</div>
        <div className="text-lg text-orange-500 mb-8">{sentence.romanization}</div>

        <div className="text-3xl font-bold text-orange-600 mb-8 leading-relaxed">{sentenceWithBlank}</div>

        <div className="space-y-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type the missing word..."
            className="w-full max-w-md p-4 text-xl text-center border-2 border-orange-300 rounded-lg focus:border-orange-500 focus:outline-none"
            disabled={showResult}
            onKeyPress={(e) => e.key === "Enter" && !showResult && checkAnswer()}
          />

          <Button
            size="lg"
            onClick={checkAnswer}
            disabled={!userInput.trim() || showResult}
            className="font-display font-bold"
          >
            Check Answer
          </Button>

          {showResult && (
            <div className="mt-4">
              {isCorrect ? (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-bold text-xl">Correct!</span>
                </div>
              ) : (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-red-600 mb-2">
                    <XCircle className="w-6 h-6" />
                    <span className="font-bold">Not quite!</span>
                  </div>
                  <div className="text-lg">
                    Correct word: <span className="font-bold text-green-600">{missingWord}</span>
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
