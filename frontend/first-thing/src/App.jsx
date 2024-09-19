import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  
  //const tasks = ['Task 1', 'Task 2', 'Task 3', 'Task 4']
  const [tasks, setTasks] = useState(['Task 1', 'Task 2', 'Task 3', 'Task 4']);


  
  function completeTask(index) {
    const updatedTasks = tasks.filter((task, i) => i !== index);
    setTasks(updatedTasks)
    console.log(updatedTasks)
    return updatedTasks

}

  return (
    <>
      <h1>Welcome to FirstThing</h1>
      <h3>We're a to-do list application with a twist.</h3>
      <h3>Add, track and tick off items as you work through them.</h3>
      <h3>Stuck on where to start, you can prioritise your tasks with our handy AI assistant.</h3>

      <h2>My list</h2>
      <ul>
        {tasks.map((task, index) => (
          <>
          <li key={index}>{task}</li> <button onClick={completeTask}>Done</button>
          </>
        ))}
  
        </ul>
    </>
  )
}

export default App
