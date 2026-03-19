"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useFlashcards } from "@/lib/flashcard-context"
import { useProgress } from "@/lib/progress-context"
import { ArrowLeft, RotateCcw, Plus, BookOpen, Clock, Target, TrendingUp } from "lucide-react"

export default function FlashcardsPage() {
  const router = useRouter()
  const { flashcards, stats, reviewFlashcard, getDueCards, getNewCards } = useFlashcards()
  const { addXP } = useProgress()

  const [currentCard, setCurrentCard] = useState<any>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [sessionCards, setSessionCards] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 })

  useEffect(() => {
    // Start with due cards, then new cards
    const dueCards = getDueCards()
    const newCards = getNewCards().slice(0, 5) // Limit new cards per session
    const cards = [...dueCards, ...newCards]

    if (cards.length > 0) {
      setSessionCards(cards)
      setCurrentCard(cards[0])
    }
  }, [flashcards])

  const handleAnswer = (correct: boolean) => {
    if (!currentCard) return

    reviewFlashcard(currentCard.id, correct)
    addXP(correct ? 10 : 5, currentCard.moduleId)

    setSessionStats((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }))

    // Move to next card
    const nextIndex = currentIndex + 1
    if (nextIndex < sessionCards.length) {
      setCurrentIndex(nextIndex)
      setCurrentCard(sessionCards[nextIndex])
      setShowAnswer(false)
    } else {
      // Session complete
      setCurrentCard(null)
    }
  }

  const resetSession = () => {
    const dueCards = getDueCards()
    const newCards = getNewCards().slice(0, 5)
    const cards = [...dueCards, ...newCards]

    setSessionCards(cards)
    setCurrentCard(cards[0] || null)
    setCurrentIndex(0)
    setShowAnswer(false)
    setSessionStats({ correct: 0, total: 0 })
  }

  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => router.push("/")} className="p-2">
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">Flashcards</h1>
          </div>

          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-4">No Flashcards Yet</h2>
              <p className="text-gray-600 mb-6">
                Start learning in any module to automatically add items to your flashcard deck!
              </p>
              <Button onClick={() => router.push("/")} className="bg-blue-500 hover:bg-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Start Learning
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => router.push("/")} className="p-2">
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">Flashcards</h1>
          </div>

          <Card className="text-center py-12">
            <CardContent>
              <Target className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-4">Session Complete!</h2>
              <p className="text-gray-600 mb-2">
                You reviewed {sessionStats.total} cards with{" "}
                {Math.round((sessionStats.correct / sessionStats.total) * 100)}% accuracy
              </p>
              <p className="text-sm text-gray-500 mb-6">Great job! Come back tomorrow for more reviews.</p>
              <div className="flex gap-4 justify-center">
                <Button onClick={resetSession} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Review Again
                </Button>
                <Button onClick={() => router.push("/")} className="bg-blue-500 hover:bg-blue-600">
                  Continue Learning
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.push("/")} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Flashcards</h1>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalCards}</div>
              <div className="text-sm text-gray-600">Total Cards</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.dueToday}</div>
              <div className="text-sm text-gray-600">Due Today</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Plus className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.newCards}</div>
              <div className="text-sm text-gray-600">New Cards</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.accuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Session Progress</span>
            <span className="text-sm text-gray-600">
              {currentIndex + 1} / {sessionCards.length}
            </span>
          </div>
          <Progress value={((currentIndex + 1) / sessionCards.length) * 100} className="h-2" />
        </div>

        {/* Flashcard */}
        <Card className="mb-8 min-h-[300px]">
          <CardHeader>
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="capitalize">
                {currentCard.type.replace("-", " ")}
              </Badge>
              <Badge variant="secondary">{currentCard.moduleId.replace("-", " ")}</Badge>
            </div>
          </CardHeader>
          <CardContent className="text-center py-12">
            <div className="text-4xl font-bold text-gray-800 mb-4">{currentCard.bangla}</div>
            {currentCard.romanization && <div className="text-lg text-gray-600 mb-4">{currentCard.romanization}</div>}
            {showAnswer && <div className="text-2xl text-blue-600 font-semibold">{currentCard.english}</div>}
            {currentCard.category && (
              <Badge variant="outline" className="mt-4">
                {currentCard.category}
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          {!showAnswer ? (
            <Button onClick={() => setShowAnswer(true)} className="bg-blue-500 hover:bg-blue-600 px-8 py-3 text-lg">
              Show Answer
            </Button>
          ) : (
            <>
              <Button
                onClick={() => handleAnswer(false)}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50 px-8 py-3 text-lg"
              >
                Hard
              </Button>
              <Button onClick={() => handleAnswer(true)} className="bg-green-500 hover:bg-green-600 px-8 py-3 text-lg">
                Easy
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
