module.exports = function formatResponse(text) {
  let formattedText = "";
  let lines = text.split("\n");

  for (let line of lines) {
    if (line.startsWith("**") && line.endsWith("**")) {
      // Convert **bold** to bold text
      formattedText += `<p class="heading">${line.slice(2, -2)}</p>`;
    } else {
      let words = line.split(" ");
      let formattedLine = "";

      for (let word of words) {
        if (word.startsWith("**") && word.endsWith("**")) {
          formattedLine += `<span class="bold">${word.slice(2, -2)}</span> `;
        } else {
          formattedLine += word + " ";
        }
      }

      formattedText += `<p>${formattedLine.trim()}</p>`;
    }
  }

  return formattedText;
};
