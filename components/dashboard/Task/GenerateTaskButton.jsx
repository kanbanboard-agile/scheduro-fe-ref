"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { GenerateTaskForm } from "./GenerateTaskForm"
import { useAuth } from "@/lib/AuthContext"
import { getAuthToken } from "@/lib/cookieUtils"

export function GenerateTaskButton({ workspaceId }) {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  // Get token from cookies with fallback to context
  const getToken = () => {
    const cookieToken = getAuthToken()
    return cookieToken || user?.token
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-500 to-blue-500 
             hover:from-purple-600 hover:to-blue-600 text-white shadow-lg 
             hover:shadow-xl transition-all duration-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Generate with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Generate Task with AI
          </DialogTitle>
        </DialogHeader>
        <GenerateTaskForm 
          onSuccess={() => setIsOpen(false)} 
          workspaceId={workspaceId || "1"}
          token={getToken()}
        />
      </DialogContent>
    </Dialog>
  )
}

// Default export for compatibility
export default GenerateTaskButton
