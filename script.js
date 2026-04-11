document.addEventListener("DOMContentLoaded", function () {

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

  console.log("Revive UI loaded");

  // -----------------------------
  // SECTOR → SUBURB
  // -----------------------------
  sectorEl.addEventListener("change", function () {
    const sector = this.value;

    console.log("Sector changed:", sector);

    suburbEl.innerHTML = '<option value="">--</option>';
    reviveEl.innerHTML = '<option value="">--</option>';
    maintainerEl.value = "";

    if (sectorSuburbs[sector]) {
      sectorSuburbs[sector].forEach(s => {
        const opt = document.createElement("option");
        opt.value = s;
        opt.textContent = s;
        suburbEl.appendChild(opt);
      });
    }
  });

  // -----------------------------
  // SUBURB → REVIVE POINTS (DEBUG VERSION)
  // -----------------------------
  suburbEl.addEventListener("change", async function () {
    const suburb = this.value;

    console.log("Suburb changed:", suburb);

    reviveEl.innerHTML = '<option value="">--</option>';
    maintainerEl.value = "";

    if (!suburb) return;

    try {
      console.log("Fetching revive points...");

      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbzoQy6STaMnIh6Y8pda03PV0PdokBB1y_ejCFf_z1QhdjajZKpW0MxmLCXErgezruV4/exec"
      );

      console.log("HTTP status:", res.status);

      const data = await res.json();

      console.log("RAW SHEET DATA:", data);

      const points = data[suburb];

      if (!points) {
        console.warn("❌ No data found for suburb:", suburb);
        return;
      }

      points.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.name;
        opt.textContent = p.name;
        reviveEl.appendChild(opt);
      });

      console.log("Revive points loaded:", points.length);

    } catch (err) {
      console.error("❌ Failed to load revive points:", err);
    }
  });

  // -----------------------------
  // REVIVE POINT → MAINTAINER
  // -----------------------------
  reviveEl.addEventListener("change", function () {
    const point = this.value;

    console.log("Revive point selected:", point);

    if (!point) {
      maintainerEl.value = "";
      return;
    }

    maintainerEl.value = revivePointMaintainers[point] || "Unknown";
  });

  // -----------------------------
  // FORM SUBMIT
  // -----------------------------
  formEl.addEventListener("submit", function (e) {
    e.preventDefault();

    statusEl.textContent = "Sending...";

    const form = document.createElement("form");
    form.method = "POST";
    form.action =
      "https://script.google.com/macros/s/AKfycbzoQy6STaMnIh6Y8pda03PV0PdokBB1y_ejCFf_z1QhdjajZKpW0MxmLCXErgezruV4/exec";
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

});
