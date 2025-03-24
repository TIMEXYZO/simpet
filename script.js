const chapters = {
  Physics: [
    "Units and Measurements", "Motion in a Straight Line", "Motion in a Plane", "Laws of Motion",
    "Work, Energy, and Power", "System of Particles and Rotational Motion", "Gravitation",
    "Mechanical Properties of Solids", "Mechanical Properties of Fluids", "Thermal Properties of Matter",
    "Thermodynamics", "Kinetic Theory", "Oscillations", "Waves"
  ],
  Chemistry: [
    "Some Basic Concepts of Chemistry", "Structure of Atom", "Classification of Elements and Periodicity in Properties",
    "Chemical Bonding and Molecular Structure", "Thermodynamics", "Equilibrium", "Redox Reactions",
    "Organic Chemistry - Some Basic Principles and Techniques", "Hydrocarbons"
  ],
  Maths: [
    "Sets", "Relations and Functions", "Trigonometric Functions", "Principle of Mathematical Induction",
    "Complex Numbers and Quadratic Equations", "Linear Inequalities", "Permutations and Combinations",
    "Binomial Theorem", "Sequences and Series", "Straight Lines", "Conic Sections",
    "Introduction to Three Dimensional Geometry", "Limits and Derivatives", "Mathematical Reasoning",
    "Statistics", "Probability"
  ]
};

document.getElementById("subject").addEventListener("change", function() {
    const selectedSubject = this.value;
    const chapterList = document.getElementById("chapterList");
    chapterList.innerHTML = "";

    chapters[selectedSubject].forEach(chapter => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = chapter;
        checkbox.id = chapter;

        const label = document.createElement("label");
        label.htmlFor = chapter;
        label.textContent = chapter;

        const lineBreak = document.createElement("br");

        chapterList.appendChild(checkbox);
        chapterList.appendChild(label);
        chapterList.appendChild(lineBreak);
    });
});

document.getElementById("aiForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const userInput = document.getElementById("userInput").value;
    const subject = document.getElementById("subject").value;
    const selectedChapters = Array.from(document.querySelectorAll("#chapterList input:checked")).map(cb => cb.value);
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
            body: JSON.stringify({ userInput, subject, selectedChapters })
        });

        const data = await res.json();
        responseText.innerHTML = data.response;
    } catch (error) {
        responseText.innerHTML = "Error fetching response.";
    }
});

// Load chapters initially
document.getElementById("subject").dispatchEvent(new Event("change"));
