import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import Groq from "groq-sdk";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

function validatePrompt(req, res, next) {
  const tasks = req.body.tasks;

  if (!Array.isArray(tasks)) {
    return res.status(400).json({ error: "tas must be an array." });
  }

  const allStrings = tasks.every((item) => typeof item === "string");
  if (!allStrings) {
    return res
      .status(400)
      .json({ error: "All items in the tasks array must be strings." });
  }

  next(); // Continue if valid
}

async function getGroqChatCompletion(tasksArray) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `${tasksArray.join(
          ", "
        )} Sort these tasks by priority. The options are: high, medium, low. For example: [{ "task": "Task 1", "priority": "high" }] Don't return any other text!
`,
      },
    ],
    model: "llama3-8b-8192",
  });
}

// API route to get prioritized tasks
app.post("/sort-tasks", validatePrompt, async (req, res) => {
  try {
    const completion = await getGroqChatCompletion(req.body.tasks);
    const content = completion.choices[0]?.message?.content || "No response";
    res.json(content); // Parse the response as JSON
  } catch (error) {
    console.error("Error fetching completion:", error);
    res.status(500).json({ error: "Failed to get prioritized tasks" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
