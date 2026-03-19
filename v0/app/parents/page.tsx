"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Settings,
  RotateCcw,
  FastForward,
  Unlock,
  Trophy,
  BookOpen,
  BarChart3,
  Target,
  Award,
  Home,
  AlertTriangle,
  Users,
  Plus,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useProgress } from "@/lib/progress-context"
import type { UserProgress } from "@/lib/progress-context"

export default function ParentalControlsPage() {
  const { isAuthenticated, account, currentUser, addUser, removeUser, updateUser } = useAuth()
  const { getAllUsersProgress, parentalControls } = useProgress()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [showConfirmReset, setShowConfirmReset] = useState<string | null>(null)
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUserName, setNewUserName] = useState("")
  const [newUserAge, setNewUserAge] = useState("")
  const [newUserAvatar, setNewUserAvatar] = useState("👶")
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (currentUser && !selectedUserId) {
      setSelectedUserId(currentUser.id)
    }
  }, [currentUser, selectedUserId])

  if (!isAuthenticated || !account) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  const allProgress = getAllUsersProgress()
  const selectedProgress = selectedUserId ? allProgress[selectedUserId] : null

  const modules = [
    { id: "letters", name: "Letters", icon: "🔤", totalLevels: 11 },
    { id: "joint-letters", name: "Joint Letters", icon: "🔗", totalLevels: 8 },
    { id: "words", name: "Words", icon: "📝", totalLevels: 6 },
    { id: "sentences", name: "Sentences", icon: "💬", totalLevels: 6 },
  ]

  const avatarOptions = ["👶", "👧", "👦", "👧🏽", "👦🏽", "👧🏻", "👦🏻", "👧🏿", "👦🏿"]

  const handleAdvanceLevel = (userId: string, moduleId: string, level: number) => {
    parentalControls.advanceLevel(userId, moduleId, level)
  }

  const handleResetModule = (userId: string, moduleId: string) => {
    parentalControls.resetModule(userId, moduleId)
    setShowConfirmReset(null)
  }

  const handleSetXP = (userId: string, moduleId: string, xp: string) => {
    const amount = Number.parseInt(xp) || 0
    parentalControls.setXP(userId, moduleId, amount)
  }

  const handleAddUser = () => {
    if (newUserName.trim() && newUserAge) {
      addUser(newUserName.trim(), Number.parseInt(newUserAge), newUserAvatar)
      setNewUserName("")
      setNewUserAge("")
      setNewUserAvatar("👶")
      setShowAddUser(false)
    }
  }

  const calculateOverallProgress = (progress: UserProgress) => {
    const totalLevels = Object.values(progress.modules).reduce((sum, module) => sum + module.totalLevels, 0)
    const completedLevels = Object.values(progress.modules).reduce((sum, module) => sum + module.completedLevels, 0)
    return totalLevels > 0 ? (completedLevels / totalLevels) * 100 : 0
  }

  return (
    <div className="min-h-screen p-4 max-w-6xl mx-auto bg-gradient-to-br from-slate-50 to-gray-100">
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-gray-700 rounded-full flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Parental Controls</h1>
              <p className="text-gray-600">Manage your family's learning progress</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Home className="w-4 h-4" />
              Back to App
            </Button>
          </Link>
        </div>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Family Members ({account.users.length})
            </CardTitle>
            <Button onClick={() => setShowAddUser(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Child
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {account.users.map((user) => {
              const userProgress = allProgress[user.id]
              const overallProgress = userProgress ? calculateOverallProgress(userProgress) : 0
              const unlockedAchievements = userProgress
                ? Object.values(userProgress.achievements).filter((a) => a.isUnlocked).length
                : 0

              return (
                <Card
                  key={user.id}
                  className={`cursor-pointer transition-all ${
                    selectedUserId === user.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{user.avatar}</span>
                        <div>
                          <h3 className="font-bold">{user.name}</h3>
                          <p className="text-sm text-gray-600">Age {user.age}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeUser(user.id)
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {userProgress && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{Math.round(overallProgress)}%</span>
                        </div>
                        <Progress value={overallProgress} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>{userProgress.totalXP} XP</span>
                          <span>{unlockedAchievements}/8 achievements</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {selectedProgress && selectedUserId && (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Overall Progress</p>
                    <p className="text-2xl font-bold">{Math.round(calculateOverallProgress(selectedProgress))}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-600">Total XP</p>
                    <p className="text-2xl font-bold">{selectedProgress.totalXP}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Target className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Current Streak</p>
                    <p className="text-2xl font-bold">{selectedProgress.currentStreak} days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">Achievements</p>
                    <p className="text-2xl font-bold">
                      {Object.values(selectedProgress.achievements).filter((a) => a.isUnlocked).length}/8
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FastForward className="w-5 h-5" />
                Quick Actions for {account.users.find((u) => u.id === selectedUserId)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => parentalControls.unlockAllModules(selectedUserId)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Unlock className="w-4 h-4 mr-2" />
                  Unlock All Modules
                </Button>
                <Button onClick={() => parentalControls.resetAchievements(selectedUserId)} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Achievements
                </Button>
                <Button onClick={() => setShowConfirmReset(`user-${selectedUserId}`)} variant="destructive">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Reset All Progress
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Module Management */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Module Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modules.map((module) => {
                  const moduleProgress = selectedProgress.modules[module.id]
                  const progressPercent = moduleProgress
                    ? (moduleProgress.completedLevels / moduleProgress.totalLevels) * 100
                    : 0

                  return (
                    <Card key={module.id} className="border-2">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{module.icon}</span>
                            <div>
                              <h3 className="font-bold">{module.name}</h3>
                              <Badge variant={moduleProgress?.isUnlocked ? "default" : "secondary"}>
                                {moduleProgress?.isUnlocked ? "Unlocked" : "Locked"}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              {moduleProgress?.completedLevels || 0}/{module.totalLevels} levels
                            </p>
                            <p className="text-xs text-gray-500">{moduleProgress?.xp || 0} XP</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Progress value={progressPercent} className="h-2" />

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor={`level-${module.id}`} className="text-xs">
                              Set Level
                            </Label>
                            <div className="flex gap-1">
                              <Input
                                id={`level-${module.id}`}
                                type="number"
                                min="0"
                                max={module.totalLevels}
                                defaultValue={moduleProgress?.completedLevels || 0}
                                className="h-8 text-xs"
                              />
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  const input = e.currentTarget.previousElementSibling as HTMLInputElement
                                  handleAdvanceLevel(selectedUserId, module.id, Number.parseInt(input.value) || 0)
                                }}
                                className="h-8 px-2"
                              >
                                Set
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor={`xp-${module.id}`} className="text-xs">
                              Set XP
                            </Label>
                            <div className="flex gap-1">
                              <Input
                                id={`xp-${module.id}`}
                                type="number"
                                min="0"
                                defaultValue={moduleProgress?.xp || 0}
                                className="h-8 text-xs"
                              />
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  const input = e.currentTarget.previousElementSibling as HTMLInputElement
                                  handleSetXP(selectedUserId, module.id, input.value)
                                }}
                                className="h-8 px-2"
                              >
                                Set
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => parentalControls.unlockAllModules(selectedUserId)}
                            disabled={moduleProgress?.isUnlocked}
                            className="flex-1"
                          >
                            <Unlock className="w-3 h-3 mr-1" />
                            Unlock
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setShowConfirmReset(`${selectedUserId}-${module.id}`)}
                            className="flex-1"
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Reset
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Achievements Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Achievements ({Object.values(selectedProgress.achievements).filter((a) => a.isUnlocked).length}/8)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.values(selectedProgress.achievements).map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-lg border text-center ${
                      achievement.isUnlocked
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-gray-50 border-gray-200 opacity-60"
                    }`}
                  >
                    <div className="text-2xl mb-1">{achievement.icon}</div>
                    <div className="text-sm font-bold">{achievement.name}</div>
                    <div className="text-xs text-gray-600">{achievement.xpReward} XP</div>
                    {achievement.unlockedAt && (
                      <div className="text-xs text-green-600 mt-1">
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Add New Child</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Enter child's name"
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="3"
                  max="12"
                  value={newUserAge}
                  onChange={(e) => setNewUserAge(e.target.value)}
                  placeholder="Enter age"
                />
              </div>
              <div>
                <Label>Avatar</Label>
                <div className="flex gap-2 mt-2">
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() => setNewUserAvatar(avatar)}
                      className={`text-2xl p-2 rounded border ${
                        newUserAvatar === avatar ? "border-blue-500 bg-blue-50" : "border-gray-300"
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowAddUser(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser} disabled={!newUserName.trim() || !newUserAge}>
                  Add Child
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Confirmation Dialogs */}
      {showConfirmReset && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                Confirm Reset
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Are you sure you want to reset{" "}
                {showConfirmReset.startsWith("user-")
                  ? "all progress for this user"
                  : showConfirmReset.includes("-")
                    ? `the ${showConfirmReset.split("-")[1]} module`
                    : "this item"}
                ? This action cannot be undone.
              </p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowConfirmReset(null)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (showConfirmReset.startsWith("user-")) {
                      const userId = showConfirmReset.replace("user-", "")
                      parentalControls.resetUserProgress(userId)
                    } else if (showConfirmReset.includes("-")) {
                      const [userId, moduleId] = showConfirmReset.split("-")
                      handleResetModule(userId, moduleId)
                    }
                    setShowConfirmReset(null)
                  }}
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
