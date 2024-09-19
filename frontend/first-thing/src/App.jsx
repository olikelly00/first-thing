import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
	const [tasks, setTasks] = useState([]);
	const [taskInput, setTaskInput] = useState("");

	function addNewTask(newTask) {
		setTasks([newTask, ...tasks]);
	}

	function handleTextInput(e) {
		setTaskInput(e.target.value);
	}

	function completeTask(index) {
		const updatedTasks = [...tasks.slice(0, index), ...tasks.slice(index + 1)];
		setTasks(updatedTasks);
		return updatedTasks;
	}

	return (
		<>
			<h1>Welcome to FirstThing</h1>
			<h3>We're a to-do list application with a twist.</h3>
			<h3>Add, track and tick off items as you work through them.</h3>
			<h3>Stuck on where to start? You can prioritise your tasks with our handy AI assistant.</h3>
			<h2>My list</h2>
			<ul>
				{tasks.map((task, index) => (
					<>
						<li key={index}>{task}</li> <button onClick={() => completeTask(index)}>Done</button>
					</>
				))}
			</ul>
			<input value={taskInput} onChange={handleTextInput} type="text"></input>{" "}
			<button
				onClick={() => {
					addNewTask(taskInput);
					setTaskInput("");
				}}
			>
				Add Task
			</button>
		</>
	);
}

export default App;
