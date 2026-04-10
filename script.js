const suburbData = {
  "Barrville": ["Knill Road"],
  "Brooke Hills": ["St. Pius's Church"],
  "Brooksville": ["Cemetery 34,65", "Cemetery 38,67", "The Culling Building", "Heal Walk"],
  "Buttonville": ["Cemetery 44,93", "Cemetery 40,98", "Wasteland 47,95"],
  "Chancelwood": ["Curton Mansion", "The Harenc Building", "Parrott Plaza"],
  "Crooketon": ["Jefferson Square"],
  "Crowbank": ["Blight Park", "Cemetery 73,67", "Bruton Lane"],
  "Dakerstown": ["Junkyard 6,7"],
  "Danversbank": ["Cemetery 73,97", "Angerstein Park"],
  "Dartside": ["The Abarrow Monument", "Corless Way", "Crumpler Road", "Lyng Street"],
  "Darvall Heights": ["Edbrooke Street", "Salopia Row", "Cemetery 24,27", "Nurten Avenue"],
  "Dentonside": ["Cemetery 97,57", "Cowdry Walk", "Cowley Walk"],
  "Dulston": ["Hamerton Road", "Duport Avenue", "Cemetery 99,2"],
  "Dunell Hills": ["Cemetery 8,38", "Hilborn Walk"],
  "Dunningwood": ["Cemetery 90,20"],
  "Earletown": ["Ames Plaza"],
  "East Becktown": ["Coymer Square"],
  "East Boundwood": ["Ambrose Lane"],
  "East Grayside": ["The Wicklen Monument", "Gutch Park", "The Bligh Monument", "Prigg Alley", "Baynton Street", "Mathews Park"],
  "Edgecombe": ["Moon Way", "Digby Walk", "Oldidge Way"],
  "Foulkes Village": ["Fyfhyde Plaza"],
  "Fryerbank": ["Bulmer Street", "Cemetery 92,85", "Kingham Drive", "Pickford Park"],
  "Galbraith Hills": ["Clearey Drive"],
  "Gatcombeton": ["Blabey Park"],
  "Gibsonton": ["— Unknown, please update —"],
  "Greentown": ["North Square"],
  "Grigg Heights": ["Riddles Place", "Sherring Place", "Forshaw Drive"],
  "Gulsonside": ["— Unknown, please update —"],
  "Havercroft": ["Cemetery 31,47"],
  "Heytown": ["Cemetery 72,38", "Cemetery 74,36", "Mester Square"],
  "Hollomstown": ["Cemetery 66,92", "Cemetery 66,97"],
  "Houldenbank": ["Carpark 92,67", "Ford Drive", "The Greatorex Building"],
  "Huntley Heights": ["Cemetery 68,25"],
  "Jensentown": ["Cemetery 15,8", "Wasteland 15,1"],
  "Judgewood": ["Cemetery 11,13", "Cemetery 16,11", "Wasteland 15,18", "Wasteland 16,15"],
  "Kempsterbank": ["Ware Walk", "Ebbutt Road", "Cemetery 59,79"],
  "Ketchelbank": ["St. Matthias's Church"],
  "Kinch Heights": ["Cemetery 43,85", "Cemetery 49,88"],
  "Lamport Hills": ["The McLean Monument", "Cemetery 53,9", "Church Square"],
  "Lerwill Heights": ["Carpark 22,53", "Ebsworth Row", "The Pollitt Monument", "Bragg Park"],
  "Lockettside": ["Butler Avenue"],
  "Lukinswood": ["Cemetery 22,46", "Rayner Crescent"],
  "Millen Hills": ["— Unknown, please update —"],
  "Miltown": ["The Bizzell Monument", "Tickle Crescent", "Chiles Park"],
  "Mockridge Heights": ["Cemetery 46,63"],
  "Molebank": ["Wadden Boulevard", "Cemetery 14,42", "Hanlon Park"],
  "Mongkol Crescent": ["— Unknown, please update —"],
  "Mornington": ["Sheridan Street", "Cemetery 17,67"],
  "Mosport Hills": ["— Unknown, please update —"],
  "New Arkham": ["Methringham Grove", "Redpath Place"],
  "Nixbank": ["— Unknown, please update —"],
  "North Blythville": ["Male Boulevard", "Cemetery 27,63", "Shallet Crescent"],
  "Old Arkham": ["Cemetery 15,97"],
  "Osmondville": ["Barrington Walk"],
  "Owsleybank": ["McNamara Drive", "The Woodborne Building", "The Sendall Monument"],
  "Pashenton": ["— Unknown, please update —"],
  "Paynterton": ["The Montacute Building", "Cemetery 93,39"],
  "Peddlesden Village": ["— Unknown, please update —"],
  "Pegton": ["Cemetery 87,57"],
  "Pennville": ["Wasteland 82,82", "Cemetery 85,86"],
  "Penny Heights": ["War Crescent", "Junkyard 98,76"],
  "Peppardville": ["Kemball Avenue"],
  "Pescodside": ["Mermagen Street", "Otto Street"],
  "Pimbank": ["— Unknown, please update —"],
  "Pitneybank": ["Cemetery 81,45"],
  "Raines Hills": ["— Unknown, please update —"],
  "Randallbank": ["— Unknown, please update —"],
  "Reganbank": ["Cemetery 11,56", "Cemetery 13,58", "Cemetery 16,56"],
  "Rhodenbank": ["The Upshall Monument", "Orome Avenue"],
  "Richmond Hills": ["Shehan Boulevard"],
  "Ridleybank": ["Margery Avenue"],
  "Roachtown": ["Trotter Place"],
  "Roftwood": ["Turpin Road", "Swansborough Park"],
  "Rolt Heights": ["Cemetery 88,13"],
  "Roywood": ["— Unknown, please update —"],
  "Ruddlebank": ["Peppe Park", "Greenleaves Alley"],
  "Santlerville": ["Cookesley Avenue", "St. Emelia's Church", "Junkyard 74,26", "Cemetery 78,26", "The Dewes Building", "Wasteland 78,21"],
  "Scarletwood": ["— Unknown, please update —"],
  "Shackleville": ["The Stanbury Monument", "Copp Avenue", "Swaffield Plaza", "Cemetery 57,69"],
  "Shearbank": ["— Unknown, please update —"],
  "Shore Hills": ["— Unknown, please update —"],
  "Shuttlebank": ["Look Road"],
  "South Blythville": ["Gee Avenue", "Park Walk"],
  "Spicer Hills": ["— Unknown, please update —"],
  "Spracklingbank": ["Cemetery 80,34"],
  "Stanbury Village": ["Axworthy Square"],
  "Starlingtown": ["— Unknown, please update —"],
  "Tapton": ["Dix Place", "Rhodes Park"],
  "Tollyton": ["— Unknown, please update —"],
  "Vinetown": ["The Bhore Monument", "The Dinovan Monument"],
  "West Becktown": ["— Unknown, please update —"],
  "West Boundwood": ["Cemetery 38,7"],
  "West Grayside": ["Bunstone Alley", "Cemetery 52,83"],
  "Whittenside": ["— Unknown, please update —"],
  "Williamsville": ["Cemetery 34,97", "Carpark 36,94", "Waller Crescent"],
  "Wray Heights": ["Flynn Alley", "Last Road"],
  "Wyke Hills": ["Craddock Road", "Cemetery 54,97", "Knight Square", "The Wicksted Building", "Cemetery 51,99"],
  "Wykewood": ["— Unknown, please update —"],
  "Yagoton": ["St. Swithun's Church"]
};

const sectorSuburbs = {
  NW: ["Chancelwood", "Dakerstown", "Darvall Heights", "Dulston", "Dunningwood", "Earletown", "Grigg Heights", "Heytown", "Judgewood", "Ketchelbank", "Lamport Hills", "Molebank", "Pescodside", "Roachtown", "Roftwood", "Ruddlebank", "Spracklingbank", "Starlingtown"],
  NE: ["Brooke Hills", "Brooksville", "Buttonville", "Chancelwood", "Dentonside", "Dulston", "Dunningwood", "East Boundwood", "Edgecombe", "Heytown", "Houldenbank", "Huntley Heights", "Judgewood", "Ketchelbank", "Lamport Hills", "Lerwill Heights", "Pescodside", "Rhodenbank", "Richmond Hills", "Roftwood", "Roachtown", "Santlerville", "Spracklingbank"],
  SW: ["Crooketon", "Crowbank", "Dartside", "Dunell Hills", "East Grayside", "Foulkes Village", "Grigg Heights", "Kinch Heights", "Lerwill Heights", "Lockettside", "Lukinswood", "Molebank", "Mornington", "New Arkham", "North Blythville", "Owsleybank", "Reganbank", "Ruddlebank", "South Blythville", "Tapton", "West Grayside", "Wyke Hills"],
  SE: ["Brooksville", "Buttonville", "Danversbank", "Dentonside", "Edgecombe", "Fryerbank", "Hollomstown", "Houldenbank", "Kempsterbank", "Kinch Heights", "Miltown", "Osmondville", "Paynterton", "Pegton", "Pennville", "Penny Heights", "Pitneybank", "Vinetown", "West Grayside", "Williamsville", "Wray Heights", "Wyke Hills"],
  Central: ["Barrville", "Galbraith Hills", "Gatcombeton", "Greentown", "Havercroft", "Lamport Hills", "Mockridge Heights", "Roftwood", "Shackleville", "Stanbury Village", "Tapton", "West Grayside"]
};

// Populate suburb dropdown when sector changes
document.getElementById("sector").addEventListener("change", function () {
  const sector = this.value;
  const suburbSelect = document.getElementById("suburb");
  const revivePointSelect = document.getElementById("revivePoint");

  suburbSelect.innerHTML = '<option value="">--</option>';
  revivePointSelect.innerHTML = '<option value="">--</option>';

  if (sectorSuburbs[sector]) {
    sectorSuburbs[sector].forEach(function (s) {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      suburbSelect.appendChild(opt);
    });
  }
});

// Populate revive point dropdown when suburb changes
document.getElementById("suburb").addEventListener("change", function () {
  const suburb = this.value;
  const revivePointSelect = document.getElementById("revivePoint");

  revivePointSelect.innerHTML = '<option value="">--</option>';

  if (suburbData[suburb]) {
    suburbData[suburb].forEach(function (rp) {
      const opt = document.createElement("option");
      opt.value = rp;
      opt.textContent = rp;
      revivePointSelect.appendChild(opt);
    });
  }
});

// Handle form submission
document.getElementById("reviveForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const status = document.getElementById("status");
  status.textContent = "Sending...";

  // 1. Collect form values once
  const data = {
    playerName: this.querySelector('[name="playerName"]').value,
    profileLink: this.querySelector('[name="profileLink"]').value,
    sector: this.querySelector('[name="sector"]').value,
    suburb: this.querySelector('[name="suburb"]').value,
    revivePoint: this.querySelector('[name="revivePoint"]').value,
    notes: this.querySelector('[name="notes"]').value
  };

  // 2. Build FormData correctly
  const formData = new FormData();
  formData.append("playerName", data.playerName);
  formData.append("profileLink", data.profileLink);
  formData.append("sector", data.sector);
  formData.append("suburb", data.suburb);
  formData.append("location", data.revivePoint);
  formData.append("notes", data.notes);

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbxmRlsXfjOi0ayc1eERu1qKbKX65i6t-4PlKgbw9gNfthI316Y9mEbwQjKS35UzW0m4/exec", {
      method: "POST",
      body: formData
    });

    const text = await response.text();
    console.log("Apps Script response:", text);

    if (response.ok) {
      status.textContent = "✅ Revive request sent!";
      this.reset();
      document.getElementById("suburb").innerHTML = '<option value="">--</option>';
      document.getElementById("revivePoint").innerHTML = '<option value="">--</option>';
    } else {
      status.textContent = "❌ Server error: " + text;
    }

  } catch (err) {
    console.error(err);
    status.textContent = "❌ Failed to send. Check console.";
  }
});
