const form = document.getElementById("uploadForm");
const resultDiv = document.getElementById("result");

form.addEventListener("submit", async function (event) {
  event.preventDefault();
  const formData = new FormData(form);

  try {
    const response = await fetch(
      "https://saas-server-439519.uc.r.appspot.com/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const result = await response.json();
    let resultHTML = "<h2>Detected Labels:</h2><ul>";
    result.labels.forEach((label) => {
      resultHTML += `<li>${label}</li>`;
    });
    resultHTML += "</ul>";
    resultDiv.innerHTML = resultHTML;
  } catch (error) {
    resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
  }
});