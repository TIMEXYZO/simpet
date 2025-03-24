const express = require("express");
const axios = require("axios");
const formatResponse = require("./format.js");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = "AIzaSyAoYNb5MO70jFV3Rn2CVXT9Jps29q1fTg8"; // Replace with actual API key
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const chapters = require("./chapters.js"); // Moved chapters to a separate file

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/generate", async (req, res) => {
  const { userInput, subject, selectedChapters } = req.body;

  if (!userInput || !subject || !selectedChapters || selectedChapters.length === 0) {
    return res.json({ response: "Error: Missing input, subject, or chapter selection." });
  }

  const modifiedQuery = `Subject: ${subject}, Chapters: ${selectedChapters.join(", ")}. ${userInput}`;

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

app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
