import { useState, useEffect } from "react"
import Button from "./components/ui/button"
import Input from "./components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"

export default function App() {
  const [tasks, setTasks] = useState([
    { task: "Pay a bill", priority: "High" },
    { task: "Do the weeks shopping", priority: "Medium" },
    { task: "Walk the dog", priority: "Low" },
  ])
  const [taskInput, setTaskInput] = useState("")

  useEffect(() => {
    const sortTasks = async () => {
      try {
        const response = await fetch("https://3001.fais.al/sort-tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tasks),
        })

        if (!response.ok) {
          throw new Error(`Network response was not ok (status ${response.status})`)
        }

        const sortedTasks = await response.json()
        setTasks(sortedTasks)
      } catch (error) {
        console.error("Error sorting tasks:", error)
      }
    }
		sortTasks();
  }, [tasks.length])

  const addNewTask = () => {
    if (taskInput.trim()) {
      setTasks((prevTasks) => [
        { task: taskInput, priority: "Medium" },
        ...prevTasks,
      ])
      setTaskInput("")
    }
  }

  const completeTask = (index) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index))
  }

  return (
    <div className=" min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle>Welcome to FirstThing</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p className="mb-4 text-center">We're a to-do list application with a twist. Add, track and tick off items as you work through them.</p>
          <p className="mb-6 text-center">Stuck on where to start? You can prioritise your tasks with our handy AI assistant.</p>
          
          <h2 className="text-2xl font-bold mb-4 text-center">My list</h2>
          <ul className="space-y-2 w-full">
            {tasks.map((task, index) => (
              <li key={index} className="flex justify-between items-center bg-secondary p-2 rounded">
                <span className="text-center flex-grow">{task.task} - {task.priority}</span>
                <Button onClick={() => completeTask(index)} variant="outline" size="sm">
                  Done
                </Button>
              </li>
            ))}
          </ul>
          
          <div className="flex mt-4 w-full">
            <Input
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="Enter a new task"
              className="mr-2 flex-grow"
            />
            <Button onClick={addNewTask}>Add Task</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}