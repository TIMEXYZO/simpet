const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = "AIzaSyAoYNb5MO70jFV3Rn2CVXT9Jps29q1fTg8"; // Replace with your actual API key
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.get("/generate", async (req, res) => {
  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [{ parts: [{ text: "Explain benefits of playing piano" }] }]
    });

    // Extract text response from Gemini API
    const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
    res.send(generatedText);
  } catch (error) {
    res.status(500).send("Error generating text: " + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
