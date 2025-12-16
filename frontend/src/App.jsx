import { useState, useEffect } from 'react'

const API_BASE = ''

function App() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [aiPrompt, setAiPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showAiInput, setShowAiInput] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE}/tasks`)
      const data = await res.json()
      setTasks(data)
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
    }
  }

  const addTask = async (e) => {
    e.preventDefault()
    if (!newTask.trim()) return
    
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTask })
      })
      const task = await res.json()
      setTasks([task, ...tasks])
      setNewTask('')
    } catch (err) {
      console.error('Failed to add task:', err)
    }
  }

  const generateTasks = async (e) => {
    e.preventDefault()
    if (!aiPrompt.trim()) return
    
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/tasks/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      })
      const newTasks = await res.json()
      setTasks([...newTasks, ...tasks])
      setAiPrompt('')
      setShowAiInput(false)
    } catch (err) {
      console.error('Failed to generate tasks:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTask = async (taskId, completed) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
      })
      const updatedTask = await res.json()
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t))
    } catch (err) {
      console.error('Failed to toggle task:', err)
    }
  }

  const deleteTask = async (taskId) => {
    try {
      await fetch(`${API_BASE}/tasks/${taskId}`, { method: 'DELETE' })
      setTasks(tasks.filter(t => t.id !== taskId))
    } catch (err) {
      console.error('Failed to delete task:', err)
    }
  }

  const completedCount = tasks.filter(t => t.completed).length
  const totalCount = tasks.length
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
            AI Task Architect
          </h1>
          <p className="text-white/80 text-lg">
            Break down complex goals into actionable steps
          </p>
        </header>

        <div className="glass rounded-3xl p-6 mb-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-medium">
              Progress: {completedCount} / {totalCount} tasks
            </span>
            <span className="text-white/80 text-sm">
              {progressPercent.toFixed(0)}%
            </span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="glass rounded-3xl p-6 mb-6 shadow-2xl">
          <form onSubmit={addTask} className="flex gap-3">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a task manually..."
              className="flex-1 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl border border-white/30 transition-all hover:scale-105 active:scale-95"
            >
              Add
            </button>
          </form>
        </div>

        <div className="glass rounded-3xl p-6 mb-6 shadow-2xl">
          {!showAiInput ? (
            <button
              onClick={() => setShowAiInput(true)}
              className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 pulse-glow"
            >
              <span className="text-xl">✨</span>
              Magic Add - Let AI Break Down Your Goal
            </button>
          ) : (
            <form onSubmit={generateTasks} className="space-y-3">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe your goal (e.g., 'Plan a birthday party')"
                className="w-full px-4 py-3 rounded-xl bg-violet-500/30 text-white placeholder-white/60 border border-violet-400/50 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
                autoFocus
                disabled={isLoading}
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowAiInput(false); setAiPrompt('') }}
                  className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !aiPrompt.trim()}
                  className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin">✨</span>
                      AI is thinking...
                    </>
                  ) : (
                    <>Generate Tasks</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="glass rounded-3xl p-6 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-4">Your Tasks</h2>
          
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              <div className="text-5xl mb-4 float">📋</div>
              <p>No tasks yet. Add one manually or use Magic Add!</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className={`group flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                    task.completed 
                      ? 'bg-green-500/20 border border-green-400/30' 
                      : 'bg-white/10 border border-white/20 hover:bg-white/15'
                  }`}
                >
                  <button
                    onClick={() => toggleTask(task.id, task.completed)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      task.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-white/40 hover:border-white/60'
                    }`}
                  >
                    {task.completed && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  
                  <span className={`flex-1 text-white transition-all ${
                    task.completed ? 'line-through opacity-60' : ''
                  }`}>
                    {task.title}
                  </span>
                  
                  {task.is_ai_generated && (
                    <span className="px-2 py-1 text-xs font-medium bg-violet-500/30 text-violet-200 rounded-full border border-violet-400/30">
                      AI Generated
                    </span>
                  )}
                  
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-white/50 hover:text-red-400 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="text-center mt-8 text-white/50 text-sm">
          Built with FastAPI + React + Tailwind CSS
        </footer>
      </div>
    </div>
  )
}

export default App
