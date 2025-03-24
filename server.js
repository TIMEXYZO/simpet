const express = require("express");
const axios = require("axios");
const formatResponse = require("./format.js");
const chapters = require("./chapters.js");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyAoYNb5MO70jFV3Rn2CVXT9Jps29q1fTg8"; // Store API key in environment variables
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/generate", async (req, res) => {
  const { userInput, subject, selectedChapters } = req.body;

  if (!userInput || !subject || !selectedChapters || selectedChapters.length === 0) {
    return res.status(400).json({ response: "Error: Missing input, subject, or chapters." });
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
    console.error("API Error:", error.response?.data || error.message);
    res.status(500).json({ response: "Error generating text. Try again later." });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
