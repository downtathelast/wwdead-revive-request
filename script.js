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
    "https://script.google.com/macros/s/AKfycbyDen5PT6HtocyEKufMnpXqt51rDtX_fQYV8BeIlk_0d8eeqEntpd-KYlnbSXOLEPFY/exec";

  // -----------------------------
  // SECTOR → SUBURB MAP (STATIC)
  // -----------------------------
  const sectorSuburbs = {
    NW: ["Chancelwood","Dakerstown","Darvall Heights","Dulston","Dunningwood","Earletown","Grigg Heights","Heytown","Judgewood","Ketchelbank","Lamport Hills","Molebank","Pescodside","Roachtown","Roftwood","Ruddlebank","Spracklingbank","Starlingtown"],
    NE: ["Brooke Hills","Brooksville","Buttonville","Chancelwood","Dentonside","Dulston","Dunningwood","East Boundwood","Edgecombe","Heytown","Houldenbank","Huntley Heights","Judgewood","Ketchelbank","Lamport Hills","Lerwill Heights","Pescodside","Rhodenbank","Richmond Hills","Roftwood","Roachtown","Santlerville","Spracklingbank"],
    SW: ["Crooketon","Crowbank","Dartside","Dunell Hills","East Grayside","Foulkes Village","Grigg Heights","Kinch Heights","Lerwill Heights","Lockettside","Lukinswood","Molebank","Mornington","New Arkham","North Blythville","Owsleybank","Reganbank","Ruddlebank","South Blythville","Tapton","West Grayside","Wyke Hills"],
    SE: ["Brooksville","Buttonville","Danversbank","Dentonside","Edgecombe","Fryerbank","Hollomstown","Houldenbank","Kempsterbank","Kinch Heights","Miltown","Osmondville","Paynterton","Pegton","Pennville","Penny Heights","Pitneybank","Vinetown","West Grayside","Williamsville","Wray Heights","Wyke Hills"],
    Central: ["Barrville","Galbraith Hills","Gatcombeton","Greentown","Havercroft","Lamport Hills","Mockridge Heights","Roftwood","Shackleville","Stanbury Village","Tapton","West Grayside"]
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
