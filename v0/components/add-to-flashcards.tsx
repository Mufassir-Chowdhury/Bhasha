"use client"

import { Button } from "@/components/ui/button"
import { useFlashcards } from "@/lib/flashcard-context"
import { BookOpen, Check } from "lucide-react"
import { useState } from "react"

interface AddToFlashcardsProps {
  moduleId: string
  type: "letter" | "joint-letter" | "word" | "sentence"
  bangla: string
  english: string
  romanization?: string
  category?: string
  difficulty?: number
}

export function AddToFlashcards({
  moduleId,
  type,
  bangla,
  english,
  romanization,
  category,
  difficulty = 3,
}: AddToFlashcardsProps) {
  const { addFlashcard, flashcards } = useFlashcards()
  const [added, setAdded] = useState(false)

  // Check if already added
  const isAlreadyAdded = flashcards.some(
    (card) => card.bangla === bangla && card.moduleId === moduleId && card.type === type,
  )

  const handleAdd = () => {
    if (isAlreadyAdded) return

    addFlashcard({
      moduleId,
      type,
      bangla,
      english,
      romanization,
      category,
      difficulty,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (isAlreadyAdded) {
    return (
      <Button variant="outline" size="sm" disabled className="text-green-600 bg-transparent">
        <Check className="w-4 h-4 mr-1" />
        In Deck
      </Button>
    )
  }

  return (
    <Button variant="outline" size="sm" onClick={handleAdd} className={added ? "text-green-600 border-green-300" : ""}>
      {added ? (
        <>
          <Check className="w-4 h-4 mr-1" />
          Added!
        </>
      ) : (
        <>
          <BookOpen className="w-4 h-4 mr-1" />
          Add to Deck
        </>
      )}
    </Button>
  )
}
