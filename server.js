const express = require("express");
const axios = require("axios");
const formatResponse = require("./format.js");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = "AIzaSyAoYNb5MO70jFV3Rn2CVXT9Jps29q1fTg8"; // Replace with your actual API key
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Subject-Based AI Query</title>
        <link rel="stylesheet" href="/style.css">
    </head>
    <body>
        <div class="container">
            <h2>Ask AI a Subject-Specific Question</h2>
            <form id="aiForm">
                <select id="subject">
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Maths">Maths</option>
                </select>
                <input type="text" id="userInput" placeholder="Enter your question..." required>
                <button type="submit">Generate</button>
            </form>
            <div class="response-box">
                <h3>Response:</h3>
                <div id="responseText"></div>
            </div>
        </div>
        <script src="/script.js"></script>
    </body>
    </html>
  `);
});

app.post("/generate", async (req, res) => {
  const { userInput, subject } = req.body;
  if (!userInput || !subject) {
    return res.json({ response: "Error: Missing input or subject selection." });
  }

  const modifiedQuery = `Subject: ${subject}. ${userInput}`; // Append subject to query

  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [{ parts: [{ text: modifiedQuery }] }]
    });

    const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
    const formattedText = formatResponse(generatedText);

    res.json({ response: formattedText });
  } catch (error) {
    res.json({ response: "Error generating text: " + error.message });
  }
});

app.use("/script.js", (req, res) => {
  res.type("application/javascript").send(`
    document.getElementById("aiForm").addEventListener("submit", async function(event) {
        event.preventDefault();
        const userInput = document.getElementById("userInput").value;
        const subject = document.getElementById("subject").value;
        const responseText = document.getElementById("responseText");

        responseText.innerHTML = "Generating...";

        try {
            const res = await fetch("/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userInput, subject })
            });

            const data = await res.json();
            responseText.innerHTML = data.response;
        } catch (error) {
            responseText.innerHTML = "Error fetching response.";
        }
    });
  `);
});

app.use("/style.css", (req, res) => {
  res.type("text/css").send(`
    body { font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { width: 50%; margin: 50px auto; padding: 20px; background: white; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); border-radius: 10px; }
    select, input { width: 70%; padding: 10px; margin: 10px; border: 1px solid #ccc; border-radius: 5px; }
    button { padding: 10px 15px; background-color: #007BFF; color: white; border: none; cursor: pointer; border-radius: 5px; }
    button:hover { background-color: #0056b3; }
    .response-box { margin-top: 20px; padding: 10px; background: #eee; border-radius: 5px; text-align: left; }
    .response-box h3 { color: #333; }
    .response-box p { margin: 5px 0; }
    .bold { font-weight: bold; }
    .heading { font-size: 20px; font-weight: bold; margin-top: 10px; }
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
