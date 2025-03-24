const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = "AIzaSyAoYNb5MO70jFV3Rn2CVXT9Jps29q1fTg8"; // Replace with your actual API key
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Enable JSON parsing

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>QuAI Text Generator</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { width: 50%; margin: 50px auto; padding: 20px; background: white; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); border-radius: 10px; }
            input { width: 70%; padding: 10px; margin: 10px; border: 1px solid #ccc; border-radius: 5px; }
            button { padding: 10px 15px; background-color: #007BFF; color: white; border: none; cursor: pointer; border-radius: 5px; }
            button:hover { background-color: #0056b3; }
            .response-box { margin-top: 20px; padding: 10px; background: #eee; border-radius: 5px; text-align: left; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Gemini AI Text Generator</h2>
            <form id="aiForm">
                <input type="text" id="userInput" placeholder="Enter your question..." required>
                <button type="submit">Generate</button>
            </form>
            <div class="response-box">
                <h3>Response:</h3>
                <div id="responseText"></div>
            </div>
        </div>
        <script>
            document.getElementById("aiForm").addEventListener("submit", async function(event) {
                event.preventDefault();
                const userInput = document.getElementById("userInput").value;
                const responseText = document.getElementById("responseText");

                responseText.innerHTML = "Generating...";

                try {
                    const res = await fetch("/generate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userInput })
                    });

                    const data = await res.json();
                    responseText.innerHTML = formatText(data.response);
                } catch (error) {
                    responseText.textContent = "Error fetching response.";
                }
            });

                function formatText(text) {
                    return text
                        .replace(/(?:\r\n|\r|\n)/g, "<br>")  // Convert \n to <br>
                        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") // Fix bold formatting
                        .replace(/^# (.+)$/gm, "<h2>$1</h2>"); // Fix headings
                }

        </script>
    </body>
    </html>
  `);
});

app.post("/generate", async (req, res) => {
  const userInput = req.body.userInput;
  if (!userInput) {
    return res.json({ response: "Error: No input provided." });
  }

  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [{ parts: [{ text: userInput }] }]
    });

    const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
    res.json({ response: generatedText });
  } catch (error) {
    res.json({ response: "Error generating text: " + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
