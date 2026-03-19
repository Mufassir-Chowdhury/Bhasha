"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useAuth } from "./auth-context"

// Convert interfaces to plain objects for backend migration
export type ModuleProgress = {
  id: string
  name: string
  completedLevels: number
  totalLevels: number
  xp: number
  isUnlocked: boolean
  lastAccessed?: Date
}

export type Achievement = {
  id: string
  name: string
  description: string
  icon: string
  xpReward: number
  isUnlocked: boolean
  unlockedAt?: Date
}

export type UserProgress = {
  userId: string
  totalXP: number
  currentStreak: number
  longestStreak: number
  lastStudyDate?: Date
  modules: Record<string, ModuleProgress>
  achievements: Record<string, Achievement>
}

export type ProgressContextType = {
  progress: UserProgress | null
  addXP: (amount: number, moduleId: string) => void
  completeLevel: (moduleId: string, levelId: number) => void
  unlockModule: (moduleId: string) => void
  checkAchievements: () => void
  resetProgress: () => void
  getAllUsersProgress: () => Record<string, UserProgress>
  parentalControls: {
    advanceLevel: (userId: string, moduleId: string, levelId: number) => void
    resetModule: (userId: string, moduleId: string) => void
    unlockAllModules: (userId: string) => void
    setXP: (userId: string, moduleId: string, amount: number) => void
    resetAchievements: (userId: string) => void
    resetUserProgress: (userId: string) => void
  }
}

const createDefaultProgress = (userId: string): UserProgress => ({
  userId,
  totalXP: 0,
  currentStreak: 0,
  longestStreak: 0,
  modules: {
    letters: {
      id: "letters",
      name: "Letters",
      completedLevels: 0,
      totalLevels: 11,
      xp: 0,
      isUnlocked: true,
    },
    "joint-letters": {
      id: "joint-letters",
      name: "Joint Letters",
      completedLevels: 0,
      totalLevels: 8,
      xp: 0,
      isUnlocked: false,
    },
    words: {
      id: "words",
      name: "Words",
      completedLevels: 0,
      totalLevels: 6,
      xp: 0,
      isUnlocked: false,
    },
    sentences: {
      id: "sentences",
      name: "Sentences",
      completedLevels: 0,
      totalLevels: 6,
      xp: 0,
      isUnlocked: false,
    },
  },
  achievements: {
    firstSteps: {
      id: "firstSteps",
      name: "First Steps",
      description: "Complete your first lesson",
      icon: "👶",
      xpReward: 50,
      isUnlocked: false,
    },
    letterMaster: {
      id: "letterMaster",
      name: "Letter Master",
      description: "Complete all letter levels",
      icon: "🔤",
      xpReward: 200,
      isUnlocked: false,
    },
    wordBuilder: {
      id: "wordBuilder",
      name: "Word Builder",
      description: "Learn 50 words",
      icon: "🏗️",
      xpReward: 150,
      isUnlocked: false,
    },
    conversationalist: {
      id: "conversationalist",
      name: "Conversationalist",
      description: "Master all sentence categories",
      icon: "💬",
      xpReward: 250,
      isUnlocked: false,
    },
    streakWarrior: {
      id: "streakWarrior",
      name: "Streak Warrior",
      description: "Study for 7 days in a row",
      icon: "🔥",
      xpReward: 300,
      isUnlocked: false,
    },
    xpCollector: {
      id: "xpCollector",
      name: "XP Collector",
      description: "Earn 1000 XP",
      icon: "⭐",
      xpReward: 100,
      isUnlocked: false,
    },
    perfectionist: {
      id: "perfectionist",
      name: "Perfectionist",
      description: "Complete a level with 100% accuracy",
      icon: "💯",
      xpReward: 100,
      isUnlocked: false,
    },
    explorer: {
      id: "explorer",
      name: "Explorer",
      description: "Try all learning modules",
      icon: "🗺️",
      xpReward: 200,
      isUnlocked: false,
    },
  },
})

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { currentUser, account } = useAuth()
  const [allProgress, setAllProgress] = useState<Record<string, UserProgress>>({})
  const [progress, setProgress] = useState<UserProgress | null>(null)

  // Load all users' progress from localStorage
  useEffect(() => {
    if (account) {
      const savedProgress = localStorage.getItem(`bangla-learning-progress-${account.id}`)
      if (savedProgress) {
        try {
          const parsed = JSON.parse(savedProgress)
          setAllProgress(parsed)
        } catch (error) {
          console.error("Failed to parse saved progress:", error)
        }
      }
    }
  }, [account])

  // Set current user's progress when user changes
  useEffect(() => {
    if (currentUser) {
      const userProgress = allProgress[currentUser.id] || createDefaultProgress(currentUser.id)
      setProgress(userProgress)

      // Save to allProgress if it's new
      if (!allProgress[currentUser.id]) {
        setAllProgress((prev) => ({
          ...prev,
          [currentUser.id]: userProgress,
        }))
      }
    } else {
      setProgress(null)
    }
  }, [currentUser, allProgress])

  // Save all progress to localStorage whenever it changes
  useEffect(() => {
    if (account && Object.keys(allProgress).length > 0) {
      localStorage.setItem(`bangla-learning-progress-${account.id}`, JSON.stringify(allProgress))
    }
  }, [allProgress, account])

  const updateUserProgress = useCallback(
    (userId: string, updater: (prev: UserProgress) => UserProgress) => {
      setAllProgress((prev) => {
        const userProgress = prev[userId] || createDefaultProgress(userId)
        const updated = updater(userProgress)
        return { ...prev, [userId]: updated }
      })

      // Update current progress if it's the current user
      if (currentUser?.id === userId) {
        setProgress((prev) => (prev ? updater(prev) : null))
      }
    },
    [currentUser],
  )

  const checkAchievements = useCallback(() => {
    if (!currentUser || !progress) return

    const newProgress = { ...progress }
    const achievements = { ...newProgress.achievements }
    let hasNewAchievements = false

    // First Steps - Complete first lesson
    if (!achievements.firstSteps.isUnlocked && progress.totalXP > 0) {
      achievements.firstSteps.isUnlocked = true
      achievements.firstSteps.unlockedAt = new Date()
      newProgress.totalXP += achievements.firstSteps.xpReward
      hasNewAchievements = true
    }

    // Letter Master - Complete all letter levels
    if (
      !achievements.letterMaster.isUnlocked &&
      progress.modules.letters.completedLevels >= progress.modules.letters.totalLevels
    ) {
      achievements.letterMaster.isUnlocked = true
      achievements.letterMaster.unlockedAt = new Date()
      newProgress.totalXP += achievements.letterMaster.xpReward
      hasNewAchievements = true
    }

    // Streak Warrior - 7 day streak
    if (!achievements.streakWarrior.isUnlocked && progress.currentStreak >= 7) {
      achievements.streakWarrior.isUnlocked = true
      achievements.streakWarrior.unlockedAt = new Date()
      newProgress.totalXP += achievements.streakWarrior.xpReward
      hasNewAchievements = true
    }

    // XP Collector - 1000 XP
    if (!achievements.xpCollector.isUnlocked && progress.totalXP >= 1000) {
      achievements.xpCollector.isUnlocked = true
      achievements.xpCollector.unlockedAt = new Date()
      newProgress.totalXP += achievements.xpCollector.xpReward
      hasNewAchievements = true
    }

    // Explorer - Try all modules
    const unlockedModules = Object.values(progress.modules).filter((m) => m.isUnlocked).length
    if (!achievements.explorer.isUnlocked && unlockedModules >= 4) {
      achievements.explorer.isUnlocked = true
      achievements.explorer.unlockedAt = new Date()
      newProgress.totalXP += achievements.explorer.xpReward
      hasNewAchievements = true
    }

    // Only update if there are new achievements to prevent infinite loops
    if (hasNewAchievements) {
      newProgress.achievements = achievements
      updateUserProgress(currentUser.id, () => newProgress)
    }
  }, [currentUser, progress, updateUserProgress])

  const addXP = useCallback(
    (amount: number, moduleId: string) => {
      if (!currentUser) return

      updateUserProgress(currentUser.id, (prev) => {
        const newProgress = { ...prev }
        newProgress.totalXP += amount

        if (newProgress.modules[moduleId]) {
          newProgress.modules[moduleId].xp += amount
        }

        // Update study streak
        const today = new Date().toDateString()
        const lastStudy = prev.lastStudyDate ? new Date(prev.lastStudyDate).toDateString() : null

        if (lastStudy !== today) {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayStr = yesterday.toDateString()

          if (lastStudy === yesterdayStr) {
            newProgress.currentStreak += 1
          } else if (lastStudy !== today) {
            newProgress.currentStreak = 1
          }

          newProgress.longestStreak = Math.max(newProgress.longestStreak, newProgress.currentStreak)
          newProgress.lastStudyDate = new Date()
        }

        return newProgress
      })

      setTimeout(() => checkAchievements(), 100)
    },
    [currentUser, updateUserProgress, checkAchievements],
  )

  const completeLevel = useCallback(
    (moduleId: string, levelId: number) => {
      if (!currentUser) return

      updateUserProgress(currentUser.id, (prev) => {
        const newProgress = { ...prev }

        if (newProgress.modules[moduleId]) {
          const module = newProgress.modules[moduleId]
          module.completedLevels = Math.max(module.completedLevels, levelId)
          module.lastAccessed = new Date()

          // Unlock next module based on completion
          if (moduleId === "letters" && module.completedLevels >= 3) {
            newProgress.modules["joint-letters"].isUnlocked = true
          }
          if (moduleId === "joint-letters" && module.completedLevels >= 2) {
            newProgress.modules["words"].isUnlocked = true
          }
          if (moduleId === "words" && module.completedLevels >= 3) {
            newProgress.modules["sentences"].isUnlocked = true
          }
        }

        return newProgress
      })

      setTimeout(() => checkAchievements(), 100)
    },
    [currentUser, updateUserProgress, checkAchievements],
  )

  const unlockModule = useCallback(
    (moduleId: string) => {
      if (!currentUser) return

      updateUserProgress(currentUser.id, (prev) => ({
        ...prev,
        modules: {
          ...prev.modules,
          [moduleId]: {
            ...prev.modules[moduleId],
            isUnlocked: true,
          },
        },
      }))
    },
    [currentUser, updateUserProgress],
  )

  const resetProgress = useCallback(() => {
    if (!currentUser) return

    const defaultProgress = createDefaultProgress(currentUser.id)
    updateUserProgress(currentUser.id, () => defaultProgress)
  }, [currentUser, updateUserProgress])

  const getAllUsersProgress = useCallback(() => allProgress, [allProgress])

  // Parental control functions
  const parentalControls = {
    advanceLevel: (userId: string, moduleId: string, levelId: number) => {
      updateUserProgress(userId, (prev) => {
        const newProgress = { ...prev }
        if (newProgress.modules[moduleId]) {
          newProgress.modules[moduleId].completedLevels = levelId
          newProgress.modules[moduleId].lastAccessed = new Date()
        }
        return newProgress
      })
    },

    resetModule: (userId: string, moduleId: string) => {
      updateUserProgress(userId, (prev) => ({
        ...prev,
        modules: {
          ...prev.modules,
          [moduleId]: {
            ...prev.modules[moduleId],
            completedLevels: 0,
            xp: 0,
            lastAccessed: undefined,
          },
        },
      }))
    },

    unlockAllModules: (userId: string) => {
      updateUserProgress(userId, (prev) => {
        const newModules = { ...prev.modules }
        Object.keys(newModules).forEach((moduleId) => {
          newModules[moduleId].isUnlocked = true
        })
        return { ...prev, modules: newModules }
      })
    },

    setXP: (userId: string, moduleId: string, amount: number) => {
      updateUserProgress(userId, (prev) => {
        const newProgress = { ...prev }
        const oldXP = newProgress.modules[moduleId]?.xp || 0
        const xpDifference = amount - oldXP

        newProgress.totalXP += xpDifference
        if (newProgress.modules[moduleId]) {
          newProgress.modules[moduleId].xp = amount
        }
        return newProgress
      })
    },

    resetAchievements: (userId: string) => {
      updateUserProgress(userId, (prev) => {
        const resetAchievements = { ...prev.achievements }
        Object.keys(resetAchievements).forEach((achievementId) => {
          resetAchievements[achievementId].isUnlocked = false
          resetAchievements[achievementId].unlockedAt = undefined
        })
        return { ...prev, achievements: resetAchievements }
      })
    },

    resetUserProgress: (userId: string) => {
      const defaultProgress = createDefaultProgress(userId)
      updateUserProgress(userId, () => defaultProgress)
    },
  }

  return (
    <ProgressContext.Provider
      value={{
        progress,
        addXP,
        completeLevel,
        unlockModule,
        checkAchievements,
        resetProgress,
        getAllUsersProgress,
        parentalControls,
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider")
  }
  return context
}
