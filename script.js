// ----------------------
// Suburbs by array
// ----------------------
const suburbNames = [
  [
    "Dakerstown","Jensentown","Quarlesbank","West Boundwood","East Boundwood",
    "Lamport Hills","Chancelwood","Earletown","Rhodenbank","Dulston",
  ],
  [
    "Roywood","Judgewood","Gatcombeton","Shuttlebank","Yagoton",
    "Millen Hills","Raines Hills","Pashenton","Rolt Heights","Pescodside",
  ],
  [
    "Peddlesden Village","Chudleyton","Darvall Heights","Eastonwood","Brooke Hills",
    "Shearbank","Huntley Heights","Santlerville","Gibsonton","Dunningwood",
  ],
  [
    "Dunell Hills","West Becktown","East Becktown","Richmond Hills","Ketchelbank",
    "Roachtown","Randallbank","Heytown","Spracklingbank","Paynterton",
  ],
  [
    "Owsleybank","Molebank","Lukinswood","Havercroft","Barrville",
    "Ridleybank","Pimbank","Peppardville","Pitneybank","Starlingtown",
  ],
  [
    "Grigg Heights","Reganbank","Lerwill Heights","Shore Hills","Galbraith Hills",
    "Stanbury Village","Roftwood","Edgecombe","Pegton","Dentonside",
  ],
  [
    "Crooketon","Mornington","North Blythville","Brooksville","Mockridge Heights",
    "Shackleville","Tollyton","Crowbank","Vinetown","Houldenbank",
  ],
  [
    "Nixbank","Wykewood","South Blythville","Greentown","Tapton",
    "Kempsterbank","Wray Heights","Gulsonside","Osmondville","Penny Heights",
  ],
  [
    "Foulkes Village","Ruddlebank","Lockettside","Dartside","Kinch Heights",
    "West Grayside","East Grayside","Scarletwood","Pennville","Fryerbank",
  ],
  [
    "New Arkham","Old Arkham","Spicer Hills","Williamsville","Buttonville",
    "Wyke Hills","Hollomstown","Danversbank","Whittenside","Miltown",
  ],
];

// ----------------------
// Sector → suburbs mapping
// ----------------------
const sectors = {
  NW: suburbNames[0].concat(suburbNames[1]),
  NE: suburbNames[2].concat(suburbNames[3]),
  SW: suburbNames[4].concat(suburbNames[5]),
  SE: suburbNames[6].concat(suburbNames[7]),
  Central: suburbNames[8].concat(suburbNames[9]),
};

// Example revive points per suburb (add as needed)
const revivePoints = {
  "Dakerstown": ["St Ambrose's Church", "Pound Place School"],
  "Jensentown": ["Town Hall", "Library"],
  "Roywood": ["Community Center", "School"],
  "Default": ["Main Revive Point"]
};

// ----------------------
// DOM elements
// ----------------------
const sectorSelect = document.getElementById("sector");
const suburbSelect = document.getElementById("suburb");
const reviveSelect = document.getElementById("revivePoint");
const form = document.getElementById("reviveForm");
const status = document.getElementById("status");

// ----------------------
// Populate suburbs based on sector
// ----------------------
sectorSelect.addEventListener("change", () => {
  const suburbs = sectors[sectorSelect.value] || [];
  suburbSelect.innerHTML = `<option value="">-- Select Suburb --</option>`;
  suburbs.forEach(sub => {
    const opt = document.createElement("option");
    opt.value = sub;
    opt.textContent = sub;
    suburbSelect.appendChild(opt);
  });
  reviveSelect.innerHTML = `<option value="">-- Select Revive Point --</option>`;
});

// ----------------------
// Populate revive points based on suburb
// ----------------------
suburbSelect.addEventListener("change", () => {
  const points = revivePoints[suburbSelect.value] || revivePoints["Default"];
  reviveSelect.innerHTML = `<option value="">-- Select Revive Point --</option>`;
  points.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p;
    reviveSelect.appendChild(opt);
  });
});

// ----------------------
// Submit form → Netlify function
// ----------------------
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.textContent = "⏳ Sending...";

  const data = {
    playerName: form.playerName.value,
    profileLink: form.profileLink.value,
    sector: form.sector.value,
    suburb: form.suburb.value,
    location: form.revivePoint.value,
    notes: form.notes.value
  };

  try {
    const response = await fetch("/.netlify/functions/revive", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.text();

    status.textContent = response.ok
      ? "✅ Revive request sent!"
      : `❌ Failed: ${result}`;

    if (response.ok) form.reset();
    suburbSelect.innerHTML = `<option value="">-- Select Suburb --</option>`;
    reviveSelect.innerHTML = `<option value="">-- Select Revive Point --</option>`;
  } catch (err) {
    console.error(err);
    status.textContent = "❌ Failed to send request.";
  }
});
