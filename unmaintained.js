const API =
"https://script.google.com/macros/s/AKfycbwuyxqKSXNRI4SmOcy8-aeDxi1bgKvGcI-0OGbZjjmGJIjL6AzLImEL1nORZUC2arWq/exec?view=unmaintained";

fetch(API)
  .then(r => r.json())
  .then(data => render(data));

function render(data) {

  const container = document.getElementById("sectors");

  for (const sector in data) {

    const requests = data[sector];

    if (!requests.length) continue;

    const section = document.createElement("div");

    section.innerHTML = `
      <h2>${sector}</h2>
      <div class="sector"></div>
    `;

    const list = section.querySelector(".sector");

    requests.forEach(r => {

      const row = document.createElement("div");

      row.className = "request";

      row.innerHTML = `
        <div class="rp">${r.location}</div>
        <div class="suburb">${r.suburb}</div>
        <div class="player">
          <a href="${r.profile}" target="_blank">
            ${r.player}
          </a>
        </div>
        <div class="age">${r.days}d</div>
      `;

      list.appendChild(row);

    });

    container.appendChild(section);

  }

}
