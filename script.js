const chapters = {
    maths: [
        "Sets", "Relations and Functions", "Trigonometric Functions", "Principle of Mathematical Induction", "Complex Numbers and Quadratic Equations",
        "Linear Inequalities", "Permutations and Combinations", "Binomial Theorem", "Sequences and Series", "Straight Lines",
        "Conic Sections", "Introduction to Three Dimensional Geometry", "Limits and Derivatives", "Mathematical Reasoning", "Statistics", "Probability"
    ],
    chemistry: [
        "Some Basic Concepts of Chemistry", "Structure of Atom", "Classification of Elements and Periodicity in Properties",
        "Chemical Bonding and Molecular Structure", "Thermodynamics", "Equilibrium", "Redox Reactions",
        "Organic Chemistry - Some Basic Principles and Techniques", "Hydrocarbons"
    ],
    physics: [
        "Units and Measurements", "Motion in a Straight Line", "Motion in a Plane", "Laws of Motion", "Work, Energy, and Power",
        "System of Particles and Rotational Motion", "Gravitation", "Mechanical Properties of Solids", "Mechanical Properties of Fluids",
        "Thermal Properties of Matter", "Thermodynamics", "Kinetic Theory", "Oscillations", "Waves"
    ]
};

document.getElementById("subjectSelect").addEventListener("change", function () {
    const subject = this.value;
    const chapterTable = document.getElementById("chapterTable");
    chapterTable.innerHTML = ""; // Clear previous content

    if (!subject || !chapters[subject]) return;

    let rows = "";
    for (let i = 0; i < chapters[subject].length; i += 2) {
        const col1 = chapters[subject][i] || "";
        const col2 = chapters[subject][i + 1] || "";
        rows += `
            <tr>
                <td><label>${col1} <input type="checkbox" value="${col1}"></label></td>
                <td><label>${col2} <input type="checkbox" value="${col2}"></label></td>
            </tr>
        `;
    }

    chapterTable.innerHTML = rows;
});

document.getElementById("Generate").addEventListener("click", function () {
    const selectedChapters = [];
    document.querySelectorAll("#chapterTable input:checked").forEach(checkbox => {
        selectedChapters.push(checkbox.value);
    });

    document.getElementById("responseText").textContent = selectedChapters.length > 0 
        ? "Selected Chapters: " + selectedChapters.join(", ")  
        : "No chapters selected!";
});
