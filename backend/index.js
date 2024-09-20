import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import Groq from "groq-sdk";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

function validatePrompt(req, res, next) {
  const tasks = req.body;
  if (!Array.isArray(tasks)) {
    return res.status(400).json({ error: "Request body must be an array of tasks." });
  }

  const allValid = tasks.every((item) => 
    typeof item === "object" && typeof item.task === "string"
  );
  if (!allValid) {
    return res
      .status(400)
      .json({ error: "All items in the tasks array must be objects with a 'task' property of type string." });
  }

  next(); // Continue if valid
}

async function getGroqChatCompletion(tasksArray) {
  const taskStrings = tasksArray.map(task => task.task);
  let prompt = `${taskStrings.join(", ")} Sort these tasks by priority. The options are: high, medium, low. Return the result as a JSON array of objects, each with 'task' and 'priority' properties. For example: [{ "task": "Task 1", "priority": "high" }] Don't return any other text!`;
  console.log(prompt);
  
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama3-8b-8192",
  });

  return completion.choices[0]?.message?.content || "[]";
}

// API route to get prioritized tasks
app.post("/sort-tasks", validatePrompt, async (req, res) => {
  try {
    const content = await getGroqChatCompletion(req.body);
    const parsedContent = JSON.parse(content);
    res.json(parsedContent);
  } catch (error) {
    console.error("Error fetching completion:", error);
    res.status(500).json({ error: "Failed to get prioritized tasks" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});