const express = require("express");
const axios = require("axios");
const formatResponse = require("./format.js");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = "YOUR_API_KEY"; // Replace with actual API key
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const chapters = {
  Maths: [
    "Sets", "Relations and Functions", "Trigonometric Functions", "Principle of Mathematical Induction",
    "Complex Numbers and Quadratic Equations", "Linear Inequalities", "Permutations and Combinations",
    "Binomial Theorem", "Sequences and Series", "Straight Lines", "Conic Sections",
    "Introduction to Three Dimensional Geometry", "Limits and Derivatives", "Mathematical Reasoning",
    "Statistics", "Probability"
  ],
  Chemistry: [
    "Some Basic Concepts of Chemistry", "Structure of Atom", "Classification of Elements and Periodicity in Properties",
    "Chemical Bonding and Molecular Structure", "Thermodynamics", "Equilibrium", "Redox Reactions",
    "Organic Chemistry - Some Basic Principles and Techniques", "Hydrocarbons"
  ],
  Physics: [
    "Units and Measurements", "Motion in a Straight Line", "Motion in a Plane", "Laws of Motion",
    "Work, Energy, and Power", "System of Particles and Rotational Motion", "Gravitation",
    "Mechanical Properties of Solids", "Mechanical Properties of Fluids", "Thermal Properties of Matter",
    "Thermodynamics", "Kinetic Theory", "Oscillations", "Waves"
  ]
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Subject & Chapter-Based AI Query</title>
        <link rel="stylesheet" href="/style.css">
    </head>
    <body>
        <div class="container">
            <h2>Ask AI a Subject-Specific Question</h2>
            <form id="aiForm">
                <label>Select Subject:</label>
                <select id="subject">
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Maths">Maths</option>
                </select>
                
                <label>Select Chapters:</label>
                <select id="chapters" multiple></select>
                
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
  const { userInput, subject, chapters } = req.body;
  if (!userInput || !subject || !chapters || chapters.length === 0) {
    return res.json({ response: "Error: Missing input, subject, or chapter selection." });
  }

  const modifiedQuery = `Subject: ${subject}, Chapters: ${chapters.join(", ")}. ${userInput}`;

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
    const chapters = ${JSON.stringify(chapters)};
    
    document.getElementById("subject").addEventListener("change", function() {
        const selectedSubject = this.value;
        const chapterSelect = document.getElementById("chapters");
        chapterSelect.innerHTML = "";
        
        chapters[selectedSubject].forEach(chapter => {
            const option = document.createElement("option");
            option.value = chapter;
            option.textContent = chapter;
            chapterSelect.appendChild(option);
        });
    });

    document.getElementById("aiForm").addEventListener("submit", async function(event) {
        event.preventDefault();
        const userInput = document.getElementById("userInput").value;
        const subject = document.getElementById("subject").value;
        const selectedChapters = Array.from(document.getElementById("chapters").selectedOptions).map(option => option.value);
        const responseText = document.getElementById("responseText");

        if (selectedChapters.length === 0) {
            responseText.innerHTML = "Please select at least one chapter.";
            return;
        }

        responseText.innerHTML = "Generating...";

        try {
            const res = await fetch("/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userInput, subject, chapters: selectedChapters })
            });

            const data = await res.json();
            responseText.innerHTML = data.response;
        } catch (error) {
            responseText.innerHTML = "Error fetching response.";
        }
    });

    document.getElementById("subject").dispatchEvent(new Event("change"));
  `);
});

app.use("/style.css", (req, res) => {
  res.type("text/css").send(`
    body { font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { width: 50%; margin: 50px auto; padding: 20px; background: white; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); border-radius: 10px; }
    select, input { width: 70%; padding: 10px; margin: 10px; border: 1px solid #ccc; border-radius: 5px; }
    select[multiple] { height: 150px; }
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
