"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Star, BookOpen, Type, Layers, MessageSquare, Trophy, Play, Award, Flame, Users, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useProgress } from "@/lib/progress-context"
import { useFlashcards } from "@/lib/flashcard-context"

const learningModules = [
  {
    id: "letters",
    title: "Letters",
    titleBangla: "বর্ণমালা",
    description: "Learn Bangla alphabet",
    icon: Type,
    color: "bg-blue-500",
  },
  {
    id: "joint-letters",
    title: "Joint Letters",
    titleBangla: "যুক্তবর্ণ",
    description: "Master conjunct consonants",
    icon: Layers,
    color: "bg-green-500",
  },
  {
    id: "words",
    title: "Words",
    titleBangla: "শব্দ",
    description: "Build vocabulary",
    icon: BookOpen,
    color: "bg-purple-500",
  },
  {
    id: "sentences",
    title: "Sentences",
    titleBangla: "বাক্য",
    description: "Common phrases",
    icon: MessageSquare,
    color: "bg-orange-500",
  },
]

export default function HomePage() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showUserSwitcher, setShowUserSwitcher] = useState(false)
  const { isAuthenticated, currentUser, account, switchUser, logout } = useAuth()
  const { progress } = useProgress()
  const { stats } = useFlashcards()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !currentUser || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  const totalLevels = Object.values(progress.modules).reduce((sum, module) => sum + module.totalLevels, 0)
  const completedLevels = Object.values(progress.modules).reduce((sum, module) => sum + module.completedLevels, 0)
  const overallProgress = totalLevels > 0 ? (completedLevels / totalLevels) * 100 : 0

  const unlockedAchievements = Object.values(progress.achievements).filter((a) => a.isUnlocked)

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <header className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Star className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            BanglaKids
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">Learn Bangla the fun way! 🌟</p>

        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUserSwitcher(!showUserSwitcher)}
              className="flex items-center gap-2"
            >
              <span className="text-lg">{currentUser.avatar}</span>
              <span className="font-bold">{currentUser.name}</span>
              <Users className="w-4 h-4" />
            </Button>

            {showUserSwitcher && account && (
              <div className="absolute top-full mt-2 left-0 bg-white border rounded-lg shadow-lg p-2 z-10 min-w-48">
                <div className="text-xs text-gray-500 mb-2 px-2">Switch User:</div>
                {account.users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      switchUser(user.id)
                      setShowUserSwitcher(false)
                    }}
                    className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 flex items-center gap-2 ${
                      user.id === currentUser.id ? "bg-blue-50 border border-blue-200" : ""
                    }`}
                  >
                    <span className="text-lg">{user.avatar}</span>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500">Age {user.age}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link href="/parents" className="text-xs text-gray-400 hover:text-gray-600 underline">
            Parental Controls
          </Link>

          <Button variant="ghost" size="sm" onClick={logout} className="text-gray-400 hover:text-gray-600">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {stats.totalCards > 0 && (
        <Card className="mb-6 border-2 border-pink-200 shadow-lg bg-gradient-to-r from-pink-50 to-rose-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-display font-bold text-pink-700 mb-2">Flashcards Ready!</h3>
                <div className="flex items-center gap-4 text-sm text-pink-600">
                  <span>{stats.totalCards} cards</span>
                  <span>{stats.dueToday} due today</span>
                  <span>{stats.accuracy}% accuracy</span>
                </div>
              </div>
              <Link href="/flashcards">
                <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Review Cards
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-8 border-2 border-primary/20 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-display font-bold">Your Progress</h2>
              <p className="text-muted-foreground">Keep learning every day!</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <span className="text-2xl font-bold">{progress.totalXP}</span>
                <span className="text-sm text-muted-foreground">XP</span>
              </div>
              {progress.currentStreak > 0 && (
                <div className="flex items-center gap-2">
                  <Flame className="w-6 h-6 text-orange-500" />
                  <span className="text-2xl font-bold">{progress.currentStreak}</span>
                  <span className="text-sm text-muted-foreground">day streak</span>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>
                {completedLevels}/{totalLevels} levels
              </span>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </div>
          {unlockedAchievements.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="font-bold">{unlockedAchievements.length} Achievements</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowAchievements(!showAchievements)}>
                  {showAchievements ? "Hide" : "Show"}
                </Button>
              </div>
              {showAchievements && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                  {unlockedAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="text-center p-2 bg-yellow-50 rounded-lg border border-yellow-200"
                    >
                      <div className="text-2xl mb-1">{achievement.icon}</div>
                      <div className="text-xs font-bold">{achievement.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-display font-bold text-center mb-6">Choose Your Learning Path</h2>

        {learningModules.map((module, index) => {
          const Icon = module.icon
          const moduleProgress = progress.modules[module.id]
          const isLocked = !moduleProgress?.isUnlocked
          const moduleProgressPercent = moduleProgress
            ? (moduleProgress.completedLevels / moduleProgress.totalLevels) * 100
            : 0

          return (
            <Card
              key={module.id}
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer border-2 ${
                isLocked ? "opacity-60 border-gray-300" : "border-primary/20 shadow-lg hover:shadow-xl"
              }`}
              onClick={() => !isLocked && setSelectedModule(module.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 ${module.color} rounded-full flex items-center justify-center ${!isLocked && "animate-bounce-gentle"}`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-display font-bold">{module.title}</h3>
                      <span className="text-2xl font-bold text-primary">{module.titleBangla}</span>
                    </div>
                    <p className="text-muted-foreground mb-3">{module.description}</p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>
                          {moduleProgress?.completedLevels || 0}/{moduleProgress?.totalLevels || 0} levels
                        </span>
                      </div>
                      <Progress value={moduleProgressPercent} className="h-2" />
                      {moduleProgress && moduleProgress.xp > 0 && (
                        <div className="text-xs text-muted-foreground">{moduleProgress.xp} XP earned</div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    {!isLocked ? (
                      <Link
                        href={
                          module.id === "letters"
                            ? "/letters"
                            : module.id === "joint-letters"
                              ? "/joint-letters"
                              : module.id === "words"
                                ? "/words"
                                : module.id === "sentences"
                                  ? "/sentences"
                                  : "#"
                        }
                      >
                        <Button size="lg" className="font-display font-bold">
                          <Play className="w-4 h-4 mr-2" />
                          {moduleProgress && moduleProgress.completedLevels > 0 ? "Continue" : "Start"}
                        </Button>
                      </Link>
                    ) : (
                      <div className="text-center">
                        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center mb-1">
                          <span className="text-white text-sm">🔒</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {module.id === "joint-letters" && "Complete 3 letter levels"}
                          {module.id === "words" && "Complete 2 joint letter levels"}
                          {module.id === "sentences" && "Complete 3 word categories"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="text-center mt-12 mb-8">
        <p className="text-lg font-display text-muted-foreground">Start your Bangla learning journey today! 🚀</p>
      </div>
    </div>
  )
}
