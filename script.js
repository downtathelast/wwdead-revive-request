document.addEventListener("DOMContentLoaded", function () {

  // Optional fallback maintainer map
  const revivePointMaintainers = {
    "Salopia Row": "Soldiers of Crossman",
    "Junkyard 6,7": "TheLast",
    "Knill Road": "NW Revive Team",
    "St. Pius's Church": "NE Revivers"
  };

  const sectorSuburbs = {
    NW: ["Chancelwood", "Dakerstown", "Darvall Heights", "Dulston", "Dunningwood", "Earletown", "Grigg Heights", "Heytown", "Judgewood", "Ketchelbank", "Lamport Hills", "Molebank", "Pescodside", "Roachtown", "Roftwood", "Ruddlebank", "Spracklingbank", "Starlingtown"],
    NE: ["Brooke Hills", "Brooksville", "Buttonville", "Chancelwood", "Dentonside", "Dulston", "Dunningwood", "East Boundwood", "Edgecombe", "Heytown", "Houldenbank", "Huntley Heights", "Judgewood", "Ketchelbank", "Lamport Hills", "Lerwill Heights", "Pescodside", "Rhodenbank", "Richmond Hills", "Roftwood", "Roachtown", "Santlerville", "Spracklingbank"],
    SW: ["Crooketon", "Crowbank", "Dartside", "Dunell Hills", "East Grayside", "Foulkes Village", "Grigg Heights", "Kinch Heights", "Lerwill Heights", "Lockettside", "Lukinswood", "Molebank", "Mornington", "New Arkham", "North Blythville", "Owsleybank", "Reganbank", "Ruddlebank", "South Blythville", "Tapton", "West Grayside", "Wyke Hills"],
    SE: ["Brooksville", "Buttonville", "Danversbank", "Dentonside", "Edgecombe", "Fryerbank", "Hollomstown", "Houldenbank", "Kempsterbank", "Kinch Heights", "Miltown", "Osmondville", "Paynterton", "Pegton", "Pennville", "Penny Heights", "Pitneybank", "Vinetown", "West Grayside", "Williamsville", "Wray Heights", "Wyke Hills"],
    Central: ["Barrville", "Galbraith Hills", "Gatcombeton", "Greentown", "Havercroft", "Lamport Hills", "Mockridge Heights", "Roftwood", "Shackleville", "Stanbury Village", "Tapton", "West Grayside"]
  };

  // -----------------------------
  // ELEMENTS
  // -----------------------------
  const sectorEl = document.getElementById("sector");
  const suburbEl = document.getElementById("suburb");
  const reviveEl = document.getElementById("revivePoint");
  const maintainerEl = document.getElementById("maintainer");
  const formEl = document.getElementById("reviveForm");
  const statusEl = document.getElementById("status");

  // -----------------------------
  // SECTOR → SUBURB
  // -----------------------------
  sectorEl.addEventListener("change", function () {
    const sector = this.value;

    suburbEl.innerHTML = '<option value="">--</option>';
    reviveEl.innerHTML = '<option value="">--</option>';
    maintainerEl.value = "";

    (sectorSuburbs[sector] || []).forEach(s => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      suburbEl.appendChild(opt);
    });
  });

  // -----------------------------
  // SUBURB → REVIVE POINTS
  // -----------------------------
  suburbEl.addEventListener("change", function () {
    const suburb = this.value;

    reviveEl.innerHTML = '<option value="">--</option>';
    maintainerEl.value = "";

    if (!suburb) return;

    const data = (typeof REVIVE_DATA !== "undefined") ? REVIVE_DATA : null;

    if (!data || !data[suburb]) {
      console.warn("REVIVE_DATA missing or suburb not found:", suburb);
      return;
    }

    data[suburb].forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.name;
      opt.textContent = p.name;
      reviveEl.appendChild(opt);
    });
  });

  // -----------------------------
  // REVIVE POINT → MAINTAINER
  // -----------------------------
  reviveEl.addEventListener("change", function () {
    const point = this.value;

    if (!point) {
      maintainerEl.value = "";
      return;
    }

    const suburb = suburbEl.value;
    const data = (typeof REVIVE_DATA !== "undefined") ? REVIVE_DATA : null;

    const points = data?.[suburb] || [];

    const match = points.find(p => p.name === point);

    maintainerEl.value =
      match?.maintainer ||
      revivePointMaintainers[point] ||
      "Unknown";
  });

  // -----------------------------
  // SUBMIT FORM
  // -----------------------------
  formEl.addEventListener("submit", function (e) {
    e.preventDefault();

    statusEl.textContent = "Sending...";

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://script.google.com/macros/s/AKfycbzoQy6STaMnIh6Y8pda03PV0PdokBB1y_ejCFf_z1QhdjajZKpW0MxmLCXErgezruV4/exec";
    form.target = "hidden_iframe";

    function addField(name, value) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    }

    addField("playerName", formEl.playerName.value);
    addField("profileLink", formEl.profileLink.value);
    addField("sector", sectorEl.value);
    addField("suburb", suburbEl.value);
    addField("location", reviveEl.value);
    addField("notes", formEl.notes.value);

    document.body.appendChild(form);
    form.submit();
    form.remove();

    statusEl.textContent = "✅ Revive request sent!";
    formEl.reset();

    suburbEl.innerHTML = '<option value="">--</option>';
    reviveEl.innerHTML = '<option value="">--</option>';
    maintainerEl.value = "";
  });

});
