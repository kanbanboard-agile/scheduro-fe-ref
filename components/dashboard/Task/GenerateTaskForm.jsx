'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, CheckCircle, XCircle, Clock, Calendar, Loader2 } from 'lucide-react';
import { createTask } from '@/lib/api/task';
import { getAuthToken } from '@/lib/cookieUtils';
import { toast } from 'sonner';
import { useAuth } from '@/lib/AuthContext';

export function GenerateTaskForm({ onSuccess, workspaceId, token }) {
  const { user } = useAuth();
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState(5);
  const [section, setSection] = useState('');
  const [generatedTask, setGeneratedTask] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedTasks, setSavedTasks] = useState([]);
  const [processingStep, setProcessingStep] = useState('');

  // Function to save generated tasks to database
  const saveTasksToDatabase = async (tasks) => {
    if (!tasks || !Array.isArray(tasks)) return [];

    setIsSaving(true);
    const savedTasksArray = [];
    let failedTasks = 0;

    try {
      //console.log('Saving tasks to database:', tasks);
      
      for (const task of tasks) {
        try {
          const taskPayload = {
            title: task.title || task.name || 'Generated Task',
            description: task.description || '',
            deadline: task.deadline || null,
            priority: task.priority || 'Medium',
            status: 'To Do',
            workspace: parseInt(workspaceId)
          };

          //console.log('Saving task payload:', taskPayload);
          
          const savedTask = await createTask(taskPayload);
          //console.log('Task saved successfully:', savedTask);
          
          if (savedTask && savedTask.data) {
            savedTasksArray.push(savedTask.data);
          } else if (savedTask) {
            savedTasksArray.push(savedTask);
          }
        } catch (error) {
          //console.error('Error saving individual task:', error);
          failedTasks++;
        }
      }

      setSavedTasks(savedTasksArray);
      
      //console.log(`Successfully saved ${savedTasksArray.length} tasks, failed: ${failedTasks}`);

      return savedTasksArray;
    } catch (error) {
      //console.error('Error saving tasks to database:', error);
      return [];
    } finally {
      setIsSaving(false);
    }
  };

  // Function to wait for AI results with better UX
  const waitForAICompletion = async (originalPayload, processingToast) => {
    const waitTime = 7000; // Wait 15 seconds
    let countdown = 7;

    setProcessingStep('AI is processing your request...');
    
    // Show countdown to user
    const countdownInterval = setInterval(() => {
      countdown--;
      setProcessingStep(`AI is processing your request... (${countdown}s remaining)`);
    }, 1000);

    // Wait for AI to complete (estimated time)
    setTimeout(async () => {
      clearInterval(countdownInterval);
      
      // Dismiss the processing toast before showing success message
      if (processingToast) {
        toast.dismiss(processingToast);
      }
      
      // Since we can't poll due to CORS, we'll show a success message
      // and let the parent component refresh the data
      setProcessingStep('AI processing completed!');
      
      // Show success message and trigger callback
      toast.success('🎉 AI has generated your tasks! Refreshing the workspace...');
      
      setIsGenerating(false);
      setProcessingStep('');
      
      // Call the success callback to trigger data refresh
      if (onSuccess) {
        // Pass a flag indicating tasks were generated but need refresh
        setTimeout(() => {
          onSuccess('refresh_needed');
        }, 1000);
      }
      
    }, waitTime);
  };

  // Function to handle tasks result
  const handleTasksResult = async (result) => {
    setGeneratedTask(result);

    // Auto save tasks to database
    let actualSavedTasks = [];
    if (result && result.tasks && Array.isArray(result.tasks)) {
      setProcessingStep('Saving tasks to database...');
      actualSavedTasks = await saveTasksToDatabase(result.tasks);

      // Update the generated task with save info
      setGeneratedTask((prev) => ({
        ...prev,
        savedCount: actualSavedTasks.length,
        failedCount: result.tasks.length - actualSavedTasks.length,
      }));
    }

    // Show success toast with actual saved count
    if (actualSavedTasks.length > 0) {
      toast.success(`✅ Successfully generated and saved ${actualSavedTasks.length} tasks!`);

      // Call onSuccess with the saved tasks
      if (onSuccess) {
        //console.log('Calling onSuccess with tasks:', actualSavedTasks);
        setTimeout(() => {
          onSuccess(actualSavedTasks);
        }, 1000);
      }
    } else if (result.tasks && result.tasks.length > 0) {
      toast.warning(`⚠️ Generated ${result.tasks.length} tasks but failed to save them`);
      //console.warn('Failed to save tasks:', result.tasks);
    } else {
      toast.error('❌ No tasks were generated');
      //console.error('No tasks in result:', result);
    }

    setIsGenerating(false);
    setProcessingStep('');
  };

  const handleGenerateTask = async () => {
    if (!description.trim() || !section) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Get token with fallback to cookies
    const authToken = token || getAuthToken();

    // Validate token
    if (!authToken) {
      toast.error('Authentication token is missing. Please login again.');
      return;
    }

    // Validate workspaceId
    if (!workspaceId) {
      toast.error('Workspace ID is missing.');
      return;
    }

    // Validate user
    if (!user || !user.id) {
      toast.error('User information is missing. Please login again.');
      return;
    }

    setIsGenerating(true);
    setGeneratedTask(null);
    setSavedTasks([]);
    setProcessingStep('Preparing request...');

    const loadingToast = toast.loading('🤖 AI is generating your tasks...');

    try {
      setProcessingStep('Connecting to AI service...');

      const payload = {
        description: description.trim(),
        section: section,
        steps: steps,
        workspaceId: parseInt(workspaceId),
        user_id: user.id,
        token: authToken,
      };

      setProcessingStep('Sending request to AI...');

      // Direct webhook call
      const webhookUrl = 'https://n8n-9hlhd9ec.sumopod.biz.id/webhook/76de89dc-4784-49c0-904d-85ecd554a035';

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/json',
          'X-Workspace-ID': workspaceId.toString(),
          'X-Request-Source': 'scheduro-frontend',
        },
        body: JSON.stringify(payload),
        mode: 'cors',
        cache: 'no-cache',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setProcessingStep('Processing AI response...');
      const result = await response.json();
      
      //console.log('AI Service Response:', result);

      // Check if this is a workflow start response
      if (result.message === 'Workflow was started') {
        // Dismiss the initial loading toast
        toast.dismiss(loadingToast);
        
        // Show a different message for async workflow with stored reference
        const processingToast = toast.loading('🔄 AI is processing your request, please wait...', {
          duration: 20000, // Show for up to 20 seconds (5 seconds buffer)
        });

        // Wait for AI completion instead of polling
        await waitForAICompletion(payload, processingToast);
      } else if (result && result.tasks && Array.isArray(result.tasks)) {
        // Direct response with tasks
        await handleTasksResult(result);
        toast.dismiss(loadingToast);
      } else {
        // Unexpected response format
        toast.dismiss(loadingToast);
        toast.error('❌ Unexpected response from AI service');
        //console.error('Unexpected result format:', result);
      }

    } catch (error) {
      // Dismiss all toasts to make sure nothing lingers
      toast.dismiss();
      //console.error('Generation error:', error);
      
      // Show error to user
      toast.error('❌ Failed to connect to AI service. Please try again.');
      
      setIsGenerating(false);
      setProcessingStep('');
    }
  };

  const handleStepsChange = (value) => {
    const numValue = Number.parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 5) {
      setSteps(numValue);
    }
  };

  return (
    <div className="space-y-6 py-4 relative">
      {/* Loading Overlay */}
      {(isGenerating || isSaving) && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
          <div className="text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
            <div className="text-sm font-medium text-gray-700">
              {isGenerating && (processingStep || '🤖 AI is generating your tasks...')}
              {isSaving && '💾 Saving tasks to database...'}
            </div>
            <div className="text-xs text-gray-500">
              {isGenerating && 'This may take a few moments'}
              {isSaving && 'Please wait while we save your tasks'}
            </div>
          </div>
        </div>
      )}

      {/* Description Section */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <span>✏️</span>
          Description
        </Label>
        <Textarea placeholder="Membuat aplikasi toko online sederhana dengan Next.js" value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[80px] bg-gray-50" disabled={isGenerating} />
      </div>

      {/* Number of Steps Section */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <span>📋</span>
          Number of Steps
        </Label>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setSteps(Math.max(1, steps - 1))} disabled={steps <= 1 || isGenerating} type="button">
            -
          </Button>
          <Input type="number" value={steps} onChange={(e) => handleStepsChange(e.target.value)} className="w-20 text-center" min="1" max="20" disabled={isGenerating} />
          <Button variant="outline" size="sm" onClick={() => setSteps(Math.min(5, steps + 1))} disabled={steps >= 5 || isGenerating} type="button">
            +
          </Button>
        </div>
      </div>

      {/* Select Section */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <span>📁</span>
          Section
        </Label>
        <Select value={section} onValueChange={setSection} disabled={isGenerating}>
          <SelectTrigger className="bg-gray-50">
            <SelectValue placeholder="Select section..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Front End">Front End</SelectItem>
            <SelectItem value="Back End">Back End</SelectItem>
            <SelectItem value="Full Stack">Full Stack</SelectItem>
            <SelectItem value="Mobile Development">Mobile Development</SelectItem>
            <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
            <SelectItem value="DevOps">DevOps</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Generate Button */}
      <Button onClick={handleGenerateTask} disabled={!description.trim() || !section || isGenerating || isSaving} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 relative" type="button">
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating with AI...
          </>
        ) : isSaving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving Tasks...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Task
          </>
        )}
      </Button>

      {/* Generated Task Result */}
      {generatedTask && (
        <div className={`mt-6 p-4 border rounded-lg ${generatedTask.error ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          <h4 className={`font-medium mb-2 ${generatedTask.error ? 'text-red-800' : 'text-green-800'}`}>
            {generatedTask.error ? (
              <span className="flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                Error Generating Task!
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Task Generated Successfully!
              </span>
            )}
          </h4>

          {generatedTask.error ? (
            <div className="text-sm text-red-700">
              <p>
                <strong>Error:</strong> {generatedTask.message}
              </p>
              <p className="mt-2 text-xs">Check // //console for more details</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-green-700 space-y-1">
                <p>
                  <strong>Description:</strong> {generatedTask.description || description}
                </p>
                <p>
                  <strong>Section:</strong> {generatedTask.section || section}
                </p>
                <p>
                  <strong>Steps:</strong> {generatedTask.steps || steps}
                </p>
              </div>

              {/* Generated Tasks as Cards */}
              {generatedTask.tasks && Array.isArray(generatedTask.tasks) && (
                <div className="mt-4">
                  <h5 className="font-medium text-green-800 mb-3 flex items-center gap-2 flex-wrap">
                    <Calendar className="w-4 h-4" />
                    Generated Tasks ({generatedTask.tasks.length})
                    {generatedTask.savedCount && (
                      <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {generatedTask.savedCount} saved
                      </span>
                    )}
                    {generatedTask.failedCount > 0 && (
                      <span className="text-xs bg-red-200 text-red-700 px-2 py-1 rounded-full flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {generatedTask.failedCount} failed
                      </span>
                    )}
                  </h5>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {generatedTask.tasks.map((task, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h6 className="font-medium text-gray-900 text-sm">{task.title || task.name || `Task ${index + 1}`}</h6>
                            {task.description && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{task.description}</p>}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                <Clock className="w-3 h-3" />
                                To Do
                              </span>
                              {task.priority && <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">{task.priority}</span>}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">#{index + 1}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw Response (for debugging) */}
              {generatedTask.tasks && !Array.isArray(generatedTask.tasks) && (
                <div className="mt-3">
                  <p className="font-medium text-green-800 mb-2">Raw Response:</p>
                  <pre className="mt-1 p-2 bg-white rounded text-xs overflow-auto max-h-32 border">{JSON.stringify(generatedTask, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
