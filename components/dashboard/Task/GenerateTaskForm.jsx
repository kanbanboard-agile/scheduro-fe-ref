"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sparkles } from "lucide-react"

export function GenerateTaskForm({ onSuccess }) {
  const [taskIdea, setTaskIdea] = useState("")
  const [taskSteps, setTaskSteps] = useState(5)
  const [taskField, setTaskField] = useState("")
  const [generatedTask, setGeneratedTask] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateTask = async () => {
    if (!taskIdea.trim() || !taskField) {
      return
    }

    setIsGenerating(true)

    try {
      // Simulasi delay seperti API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate ID sederhana
      const newTask = {
        id: `TASK-${Math.floor(Math.random() * 10000)}`,
        steps: taskSteps,
        idea: taskIdea.trim(),
        field: taskField,
      }

      setGeneratedTask(newTask)

      if (onSuccess) {
        setTimeout(onSuccess, 2000)
      }
    } catch (error) {
      console.error("Error generating task:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleStepsChange = (value) => {
    const numValue = Number.parseInt(value, 10)
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 20) {
      setTaskSteps(numValue)
    }
  }

  return (
    <div className="space-y-6 py-4">
      {/* My Idea Section */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <span>✏️</span>
          My Idea
        </Label>
        <Textarea
          placeholder="I want to create a To-Do List application"
          value={taskIdea}
          onChange={(e) => setTaskIdea(e.target.value)}
          className="min-h-[80px] bg-gray-50"
          disabled={isGenerating}
        />
      </div>

      {/* Number of Steps Section */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <span>📋</span>
          Number of Steps
        </Label>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTaskSteps(Math.max(1, taskSteps - 1))}
            disabled={taskSteps <= 1 || isGenerating}
            type="button"
          >
            -
          </Button>
          <Input
            type="number"
            value={taskSteps}
            onChange={(e) => handleStepsChange(e.target.value)}
            className="w-20 text-center"
            min="1"
            max="20"
            disabled={isGenerating}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTaskSteps(Math.min(20, taskSteps + 1))}
            disabled={taskSteps >= 20 || isGenerating}
            type="button"
          >
            +
          </Button>
        </div>
      </div>

      {/* Select Field Section */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <span>📁</span>
          Select Field
        </Label>
        <Select value={taskField} onValueChange={setTaskField} disabled={isGenerating}>
          <SelectTrigger className="bg-gray-50">
            <SelectValue placeholder="Select field..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="frontend">Front End</SelectItem>
            <SelectItem value="backend">Back End</SelectItem>
            <SelectItem value="fullstack">Full Stack</SelectItem>
            <SelectItem value="mobile">Mobile Development</SelectItem>
            <SelectItem value="design">UI/UX Design</SelectItem>
            <SelectItem value="devops">DevOps</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerateTask}
        disabled={!taskIdea.trim() || !taskField || isGenerating}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3"
        type="button"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        {isGenerating ? "Generating..." : "Generate Task"}
      </Button>

      {/* Generated Task Result */}
      {generatedTask && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Task Generated Successfully!</h4>
          <div className="text-sm text-green-700 space-y-1">
            <p>
              <strong>Task ID:</strong> {generatedTask.id}
            </p>
            <p>
              <strong>Steps:</strong> {generatedTask.steps}
            </p>
            <p>
              <strong>Idea:</strong> {generatedTask.idea}
            </p>
            <p>
              <strong>Field:</strong> {generatedTask.field}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
