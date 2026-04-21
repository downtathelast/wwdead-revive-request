document.addEventListener("REVIVE_DATA_READY", function () {

  // -----------------------------
  // SAFETY CHECK
  // -----------------------------
  if (typeof REVIVE_DATA === "undefined") {
    console.error("❌ REVIVE_DATA not loaded. Check revive-data.js import order.");
    return;
  }

  console.log("✅ REVIVE_DATA loaded:", REVIVE_DATA);

  // -----------------------------
  // ELEMENTS
  // -----------------------------
  const sectorEl = document.getElementById("sector");
  const suburbEl = document.getElementById("suburb");
  const reviveEl = document.getElementById("revivePoint");
  const maintainerEl = document.getElementById("maintainer");
  const formEl = document.getElementById("reviveForm");
  const statusEl = document.getElementById("status");

  const REVIVE_API =
    "https://script.google.com/macros/s/AKfycbzl_1YdjjVHtdXwyqptvlelJPin1xzwR2ZJhpTzDSjkA9D2h6aWUi49q-rSnVHKz3sf/exec";

  // -----------------------------
  // SECTOR → SUBURB MAP (STATIC)
  // -----------------------------
  const sectorSuburbs = {
  NW: ["Dakerstown","Jensentown","Quarlesbank","West Boundwood","East Boundwood","Roywood","Judgewood","Gatcombeton","Shuttlebank","Yagoton","Peddlesden Village","Chudleyton","Darvall Heights","Eastonwood","Brooke Hills","Dunell Hills","West Becktown","East Becktown","Owsleybank","Molebank","Lukinswood"],
  NE: ["Lamport Hills","Chancelwood","Earletown","Rhodenbank","Dulston","Millen Hills","Raines Hills","Pashenton","Rolt Heights","Pescodside","Shearbank","Huntley Heights","Santlerville","Gibsonton","Dunningwood","Heytown","Spracklingbank","Paynterton","Peppardville","Pitneybank","Starlington"],
  SW: ["Grigg Heights","Reganbank","Lerwill Heights","Crooketon","Mornington","North Blythville","Nixbank","Wykewood","South Blythville","Greentown","Tapton","Foulkes Village","Ruddlebank","Lockettside","Dartside","Kinch Heights","New Arkham","Old Arkham","Spicer Hills","Williamsville","Buttonville"],
  SE: ["Edgecombe","Pegton","Dentonside","Crowbank","Vinetown","Houldenbank","Kempsterbank","Wray Heights","Gulsonside","Osmondville","Penny Heights","West Grayside","East Grayside","Scarletwood","Pennville","Fryerbank","Wyke Hills","Hollomstown","Danversbank","Whittenside","Miltown"],
  Central: ["Richmond Hills","Ketchelbank","Roachtown","Randallbank","Havercroft","Barrville","Ridleybank","Pimbank","Shore Hills","Galbraith Hills","Stanbury Village","Roftwood","Brooksville","Mockridge Heights","Shackleville","Tollyton"]
};
  // -----------------------------
  // SECTOR → SUBURB
  // -----------------------------
  sectorEl.addEventListener("change", function () {

    const sector = this.value;

    suburbEl.innerHTML = '<option value="">--</option>';
    reviveEl.innerHTML = '<option value="">--</option>';
    maintainerEl.value = "";

    if (!sectorSuburbs[sector]) return;

    sectorSuburbs[sector].forEach(sub => {
      const opt = document.createElement("option");
      opt.value = sub;
      opt.textContent = sub;
      suburbEl.appendChild(opt);
    });
  });

  // -----------------------------
  // SUBURB → REVIVE POINTS
  // -----------------------------
  suburbEl.addEventListener("change", function () {

    const suburb = this.value.trim();

    reviveEl.innerHTML = '<option value="">--</option>';
    maintainerEl.value = "";

    console.log("➡ Suburb selected:", suburb);

    const points = REVIVE_DATA[suburb];

    if (!points) {
      console.warn("❌ No revive points found for:", suburb);
      return;
    }

    points.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.name;
      opt.textContent = p.name;
      reviveEl.appendChild(opt);
    });

    console.log("✅ Loaded revive points:", points.length);
  });

  // -----------------------------
  // REVIVE POINT → MAINTAINER
  // -----------------------------
  reviveEl.addEventListener("change", function () {

    const suburb = suburbEl.value.trim();
    const point = this.value;

    const match = (REVIVE_DATA[suburb] || []).find(p => p.name === point);

    maintainerEl.value =
      match?.maintainer ||
      "Not maintained";
  });

  // -----------------------------
  // SUBMIT FORM
  // -----------------------------
  formEl.addEventListener("submit", function (e) {

    e.preventDefault();

    statusEl.textContent = "Sending...";

    const form = document.createElement("form");
    form.method = "POST";
    form.action = REVIVE_API;
    form.target = "hidden_iframe";

    function add(name, value) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
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
