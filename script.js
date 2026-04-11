document.addEventListener("DOMContentLoaded", async function () {

  const REVIVE_API =
    "https://script.google.com/macros/s/AKfycbxlTTrHHJDE8D9Chh7I7kIMT5-3S0rgcg7QD5e11IU2bx0Apfotk00lfmngZhhR4Xlk/exec";

  let REVIVE_DATA = {};

  const revivePointMaintainers = {
    "Salopia Row": "Soldiers of Crossman",
    "Junkyard 6,7": "TheLast",
    "Knill Road": "NW Revive Team",
    "St. Pius's Church": "NE Revivers"
  };

  const sectorSuburbs = {
    NW: ["Chancelwood","Dakerstown","Darvall Heights","Dulston","Dunningwood","Earletown","Grigg Heights","Heytown","Judgewood","Ketchelbank","Lamport Hills","Molebank","Pescodside","Roachtown","Roftwood","Ruddlebank","Spracklingbank","Starlingtown"],
    NE: ["Brooke Hills","Brooksville","Buttonville","Chancelwood","Dentonside","Dulston","Dunningwood","East Boundwood","Edgecombe","Heytown","Houldenbank","Huntley Heights","Judgewood","Ketchelbank","Lamport Hills","Lerwill Heights","Pescodside","Rhodenbank","Richmond Hills","Roftwood","Roachtown","Santlerville","Spracklingbank"],
    SW: ["Crooketon","Crowbank","Dartside","Dunell Hills","East Grayside","Foulkes Village","Grigg Heights","Kinch Heights","Lerwill Heights","Lockettside","Lukinswood","Molebank","Mornington","New Arkham","North Blythville","Owsleybank","Reganbank","Ruddlebank","South Blythville","Tapton","West Grayside","Wyke Hills"],
    SE: ["Brooksville","Buttonville","Danversbank","Dentonside","Edgecombe","Fryerbank","Hollomstown","Houldenbank","Kempsterbank","Kinch Heights","Miltown","Osmondville","Paynterton","Pegton","Pennville","Penny Heights","Pitneybank","Vinetown","West Grayside","Williamsville","Wray Heights","Wyke Hills"],
    Central: ["Barrville","Galbraith Hills","Gatcombeton","Greentown","Havercroft","Lamport Hills","Mockridge Heights","Roftwood","Shackleville","Stanbury Village","Tapton","West Grayside"]
  };

  // -----------------------
  // LOAD REVIVE DATA (IMPORTANT FIX)
  // -----------------------
  try {
    const res = await fetch(REVIVE_API);
    REVIVE_DATA = await res.json();
    console.log("REVIVE_DATA loaded:", REVIVE_DATA);
  } catch (err) {
    console.error("Failed to load REVIVE_DATA:", err);
  }

  // -----------------------
  // ELEMENTS
  // -----------------------
  const sectorEl = document.getElementById("sector");
  const suburbEl = document.getElementById("suburb");
  const reviveEl = document.getElementById("revivePoint");
  const maintainerEl = document.getElementById("maintainer");
  const formEl = document.getElementById("reviveForm");
  const statusEl = document.getElementById("status");

  // -----------------------
  // SECTOR → SUBURB
  // -----------------------
  sectorEl.addEventListener("change", function () {
    const sector = this.value;

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

  // -----------------------
  // SUBURB → REVIVE POINT
  // -----------------------
  suburbEl.addEventListener("change", function () {
    const suburb = this.value;

    reviveEl.innerHTML = '<option value="">--</option>';
    maintainerEl.value = "";

    const points = REVIVE_DATA[suburb] || [];

    if (!points.length) {
      console.warn("No revive points for:", suburb);
      return;
    }

    points.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.name;
      opt.textContent = p.name;
      reviveEl.appendChild(opt);
    });
  });

  // -----------------------
  // REVIVE → MAINTAINER
  // -----------------------
  reviveEl.addEventListener("change", function () {
    const suburb = suburbEl.value;
    const point = this.value;

    const match = (REVIVE_DATA[suburb] || []).find(p => p.name === point);

    maintainerEl.value =
      match?.maintainer ||
      revivePointMaintainers[point] ||
      "Unknown";
  });

  // -----------------------
  // SUBMIT
  // -----------------------
  formEl.addEventListener("submit", function (e) {
    e.preventDefault();

    statusEl.textContent = "Sending...";

    const form = document.createElement("form");
    form.method = "POST";
    form.action = REVIVE_API;
    form.target = "hidden_iframe";

    function add(n, v) {
      const i = document.createElement("input");
      i.type = "hidden";
      i.name = n;
      i.value = v;
      form.appendChild(i);
    }

    add("playerName", formEl.playerName.value);
    add("profileLink", formEl.profileLink.value);
    add("sector", sectorEl.value);
    add("suburb", suburbEl.value);
    add("location", reviveEl.value);
    add("notes", formEl.notes.value);

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
