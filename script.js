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

document.addEventListener("DOMContentLoaded", function () {
    const subjectSelect = document.getElementById("subjectSelect");
    const chapterTable = document.getElementById("chapterTable");

    subjectSelect.addEventListener("change", function () {
        const subject = this.value;
        chapterTable.innerHTML = ""; // Clear previous content

        if (!subject || !chapters[subject]) return;

        let tableHTML = "<tr>";
        chapters[subject].forEach((chapter, index) => {
            tableHTML += `
                <td><label>${chapter} <input type="checkbox" value="${chapter}"></label></td>
            `;
            if ((index + 1) % 2 === 0) {
                tableHTML += "</tr><tr>"; // Start a new row every 2 chapters
            }
        });
        tableHTML += "</tr>";

        chapterTable.innerHTML = tableHTML;
    });
});


// Load chapters initially
document.getElementById("subject").dispatchEvent(new Event("change"));
