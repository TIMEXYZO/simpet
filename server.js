const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Home route to check if server is running
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Gemini API Route
app.get("/generate", async (req, res) => {
  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAoYNb5MO70jFV3Rn2CVXT9Jps29q1fTg8",
      {
        contents: [{ parts: [{ text: "Explain how AI works" }] }]
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
