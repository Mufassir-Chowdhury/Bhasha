"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

// Plain objects instead of interfaces for backend migration
export type User = {
  id: string
  name: string
  age: number
  avatar: string
  createdAt: Date
  lastActive: Date
}

export type Account = {
  id: string
  parentName: string
  email: string
  users: User[]
  createdAt: Date
}

export type AuthContextType = {
  account: Account | null
  currentUser: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  switchUser: (userId: string) => void
  addUser: (name: string, age: number, avatar: string) => void
  removeUser: (userId: string) => void
  updateUser: (userId: string, updates: Partial<User>) => void
}

// Dummy accounts for demonstration
const dummyAccounts: Account[] = [
  {
    id: "acc1",
    parentName: "Sarah Johnson",
    email: "sarah@example.com",
    users: [
      {
        id: "user1",
        name: "Emma",
        age: 6,
        avatar: "👧",
        createdAt: new Date("2024-01-15"),
        lastActive: new Date(),
      },
      {
        id: "user2",
        name: "Liam",
        age: 8,
        avatar: "👦",
        createdAt: new Date("2024-01-20"),
        lastActive: new Date(Date.now() - 86400000), // Yesterday
      },
    ],
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "acc2",
    parentName: "Ahmed Rahman",
    email: "ahmed@example.com",
    users: [
      {
        id: "user3",
        name: "Zara",
        age: 7,
        avatar: "👧🏽",
        createdAt: new Date("2024-02-01"),
        lastActive: new Date(Date.now() - 172800000), // 2 days ago
      },
    ],
    createdAt: new Date("2024-02-01"),
  },
]

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Load auth state from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem("bangla-learning-auth")
    if (savedAuth) {
      try {
        const { accountId, userId } = JSON.parse(savedAuth)
        const foundAccount = dummyAccounts.find((acc) => acc.id === accountId)
        if (foundAccount) {
          setAccount(foundAccount)
          const foundUser = foundAccount.users.find((user) => user.id === userId)
          if (foundUser) {
            setCurrentUser(foundUser)
          }
        }
      } catch (error) {
        console.error("Failed to parse saved auth:", error)
      }
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Dummy authentication - accept any password for demo accounts
    const foundAccount = dummyAccounts.find((acc) => acc.email === email)
    if (foundAccount) {
      setAccount(foundAccount)
      // Auto-select first user if available
      if (foundAccount.users.length > 0) {
        setCurrentUser(foundAccount.users[0])
        localStorage.setItem(
          "bangla-learning-auth",
          JSON.stringify({
            accountId: foundAccount.id,
            userId: foundAccount.users[0].id,
          }),
        )
      }
      return true
    }
    return false
  }

  const logout = () => {
    setAccount(null)
    setCurrentUser(null)
    localStorage.removeItem("bangla-learning-auth")
  }

  const switchUser = (userId: string) => {
    if (account) {
      const user = account.users.find((u) => u.id === userId)
      if (user) {
        setCurrentUser(user)
        localStorage.setItem(
          "bangla-learning-auth",
          JSON.stringify({
            accountId: account.id,
            userId: user.id,
          }),
        )
      }
    }
  }

  const addUser = (name: string, age: number, avatar: string) => {
    if (account) {
      const newUser: User = {
        id: `user_${Date.now()}`,
        name,
        age,
        avatar,
        createdAt: new Date(),
        lastActive: new Date(),
      }

      const updatedAccount = {
        ...account,
        users: [...account.users, newUser],
      }

      setAccount(updatedAccount)

      // Update the dummy accounts array (in real app, this would be API call)
      const accountIndex = dummyAccounts.findIndex((acc) => acc.id === account.id)
      if (accountIndex !== -1) {
        dummyAccounts[accountIndex] = updatedAccount
      }
    }
  }

  const removeUser = (userId: string) => {
    if (account) {
      const updatedAccount = {
        ...account,
        users: account.users.filter((u) => u.id !== userId),
      }

      setAccount(updatedAccount)

      // If current user was removed, switch to first available user
      if (currentUser?.id === userId) {
        if (updatedAccount.users.length > 0) {
          setCurrentUser(updatedAccount.users[0])
        } else {
          setCurrentUser(null)
        }
      }

      // Update the dummy accounts array
      const accountIndex = dummyAccounts.findIndex((acc) => acc.id === account.id)
      if (accountIndex !== -1) {
        dummyAccounts[accountIndex] = updatedAccount
      }
    }
  }

  const updateUser = (userId: string, updates: Partial<User>) => {
    if (account) {
      const updatedAccount = {
        ...account,
        users: account.users.map((user) => (user.id === userId ? { ...user, ...updates } : user)),
      }

      setAccount(updatedAccount)

      // Update current user if it's the one being updated
      if (currentUser?.id === userId) {
        setCurrentUser({ ...currentUser, ...updates })
      }

      // Update the dummy accounts array
      const accountIndex = dummyAccounts.findIndex((acc) => acc.id === account.id)
      if (accountIndex !== -1) {
        dummyAccounts[accountIndex] = updatedAccount
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        account,
        currentUser,
        isAuthenticated: !!account,
        login,
        logout,
        switchUser,
        addUser,
        removeUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
