"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

interface XPNotificationProps {
  xp: number
  show: boolean
  onHide: () => void
}

export function XPNotification({ xp, show, onHide }: XPNotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [show, onHide])

  if (!show) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
      <Card className="border-2 border-yellow-400 bg-yellow-50 shadow-lg">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
            <Star className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-yellow-800">+{xp} XP</div>
            <div className="text-sm text-yellow-700">Great job!</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
