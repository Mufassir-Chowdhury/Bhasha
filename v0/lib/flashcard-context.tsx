"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export interface FlashcardItem {
  id: string
  moduleId: string
  type: "letter" | "joint-letter" | "word" | "sentence"
  bangla: string
  english: string
  romanization?: string
  category?: string
  difficulty: number // 1-5
  nextReview: Date
  interval: number // days until next review
  easeFactor: number // spaced repetition ease factor
  reviewCount: number
  correctCount: number
  addedAt: Date
  lastReviewed?: Date
}

export interface FlashcardStats {
  totalCards: number
  dueToday: number
  newCards: number
  reviewedToday: number
  accuracy: number
}

interface FlashcardContextType {
  flashcards: FlashcardItem[]
  stats: FlashcardStats
  addFlashcard: (
    item: Omit<
      FlashcardItem,
      "id" | "nextReview" | "interval" | "easeFactor" | "reviewCount" | "correctCount" | "addedAt"
    >,
  ) => void
  reviewFlashcard: (id: string, correct: boolean) => void
  getDueCards: () => FlashcardItem[]
  getNewCards: () => FlashcardItem[]
  removeFlashcard: (id: string) => void
  resetFlashcards: () => void
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined)

export function FlashcardProvider({ children }: { children: React.ReactNode }) {
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>([])

  // Load flashcards from localStorage on mount
  useEffect(() => {
    const savedFlashcards = localStorage.getItem("bangla-learning-flashcards")
    if (savedFlashcards) {
      try {
        const parsed = JSON.parse(savedFlashcards)
        // Convert date strings back to Date objects
        const flashcardsWithDates = parsed.map((card: any) => ({
          ...card,
          nextReview: new Date(card.nextReview),
          addedAt: new Date(card.addedAt),
          lastReviewed: card.lastReviewed ? new Date(card.lastReviewed) : undefined,
        }))
        setFlashcards(flashcardsWithDates)
      } catch (error) {
        console.error("Failed to parse saved flashcards:", error)
      }
    }
  }, [])

  // Save flashcards to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("bangla-learning-flashcards", JSON.stringify(flashcards))
  }, [flashcards])

  const addFlashcard = (
    item: Omit<
      FlashcardItem,
      "id" | "nextReview" | "interval" | "easeFactor" | "reviewCount" | "correctCount" | "addedAt"
    >,
  ) => {
    const newCard: FlashcardItem = {
      ...item,
      id: `${item.moduleId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      nextReview: new Date(), // Available immediately for new cards
      interval: 1,
      easeFactor: 2.5,
      reviewCount: 0,
      correctCount: 0,
      addedAt: new Date(),
    }

    setFlashcards((prev) => {
      // Check if card already exists
      const exists = prev.some(
        (card) => card.bangla === item.bangla && card.moduleId === item.moduleId && card.type === item.type,
      )
      if (exists) return prev
      return [...prev, newCard]
    })
  }

  const reviewFlashcard = (id: string, correct: boolean) => {
    setFlashcards((prev) =>
      prev.map((card) => {
        if (card.id !== id) return card

        const newReviewCount = card.reviewCount + 1
        const newCorrectCount = card.correctCount + (correct ? 1 : 0)

        // Spaced repetition algorithm (simplified SM-2)
        let newEaseFactor = card.easeFactor
        let newInterval = card.interval

        if (correct) {
          if (newReviewCount === 1) {
            newInterval = 1
          } else if (newReviewCount === 2) {
            newInterval = 6
          } else {
            newInterval = Math.round(card.interval * newEaseFactor)
          }
          newEaseFactor = newEaseFactor + (0.1 - (5 - card.difficulty) * (0.08 + (5 - card.difficulty) * 0.02))
        } else {
          newInterval = 1
          newEaseFactor = Math.max(1.3, newEaseFactor - 0.2)
        }

        newEaseFactor = Math.max(1.3, Math.min(2.5, newEaseFactor))

        const nextReview = new Date()
        nextReview.setDate(nextReview.getDate() + newInterval)

        return {
          ...card,
          reviewCount: newReviewCount,
          correctCount: newCorrectCount,
          easeFactor: newEaseFactor,
          interval: newInterval,
          nextReview,
          lastReviewed: new Date(),
        }
      }),
    )
  }

  const getDueCards = (): FlashcardItem[] => {
    const now = new Date()
    return flashcards.filter((card) => card.nextReview <= now)
  }

  const getNewCards = (): FlashcardItem[] => {
    return flashcards.filter((card) => card.reviewCount === 0)
  }

  const removeFlashcard = (id: string) => {
    setFlashcards((prev) => prev.filter((card) => card.id !== id))
  }

  const resetFlashcards = () => {
    setFlashcards([])
    localStorage.removeItem("bangla-learning-flashcards")
  }

  // Calculate stats
  const stats: FlashcardStats = {
    totalCards: flashcards.length,
    dueToday: getDueCards().length,
    newCards: getNewCards().length,
    reviewedToday: flashcards.filter((card) => {
      if (!card.lastReviewed) return false
      const today = new Date().toDateString()
      return card.lastReviewed.toDateString() === today
    }).length,
    accuracy:
      flashcards.length > 0
        ? Math.round(
            (flashcards.reduce((sum, card) => sum + card.correctCount, 0) /
              Math.max(
                1,
                flashcards.reduce((sum, card) => sum + card.reviewCount, 0),
              )) *
              100,
          )
        : 0,
  }

  return (
    <FlashcardContext.Provider
      value={{
        flashcards,
        stats,
        addFlashcard,
        reviewFlashcard,
        getDueCards,
        getNewCards,
        removeFlashcard,
        resetFlashcards,
      }}
    >
      {children}
    </FlashcardContext.Provider>
  )
}

export function useFlashcards() {
  const context = useContext(FlashcardContext)
  if (context === undefined) {
    throw new Error("useFlashcards must be used within a FlashcardProvider")
  }
  return context
}
