document.addEventListener("DOMContentLoaded", function () {

let reviveData = {};

// 🔥 LOAD REVIVE DATA FROM GOOGLE APPS SCRIPT
fetch("https://script.google.com/macros/s/AKfycbzoQy6STaMnIh6Y8pda03PV0PdokBB1y_ejCFf_z1QhdjajZKpW0MxmLCXErgezruV4/exec")
  .then(res => res.json())
  .then(data => {
    reviveData = data;
  })
  .catch(err => console.error("Failed to load revive data:", err));


// 🔥 SECTOR → SUBURBS
const sectorSuburbs = {
  NW: ["Chancelwood","Dakerstown","Darvall Heights","Dulston","Dunningwood","Earletown","Grigg Heights","Heytown","Judgewood","Ketchelbank","Lamport Hills","Molebank","Pescodside","Roachtown","Roftwood","Ruddlebank","Spracklingbank","Starlingtown"],
  NE: ["Brooke Hills","Brooksville","Buttonville","Chancelwood","Dentonside","Dulston","Dunningwood","East Boundwood","Edgecombe","Heytown","Houldenbank","Huntley Heights","Judgewood","Ketchelbank","Lamport Hills","Lerwill Heights","Pescodside","Rhodenbank","Richmond Hills","Roftwood","Roachtown","Santlerville","Spracklingbank"],
  SW: ["Crooketon","Crowbank","Dartside","Dunell Hills","East Grayside","Foulkes Village","Grigg Heights","Kinch Heights","Lerwill Heights","Lockettside","Lukinswood","Molebank","Mornington","New Arkham","North Blythville","Owsleybank","Reganbank","Ruddlebank","South Blythville","Tapton","West Grayside","Wyke Hills"],
  SE: ["Brooksville","Buttonville","Danversbank","Dentonside","Edgecombe","Fryerbank","Hollomstown","Houldenbank","Kempsterbank","Kinch Heights","Miltown","Osmondville","Paynterton","Pegton","Pennville","Penny Heights","Pitneybank","Vinetown","West Grayside","Williamsville","Wray Heights","Wyke Hills"],
  Central: ["Barrville","Galbraith Hills","Gatcombeton","Greentown","Havercroft","Lamport Hills","Mockridge Heights","Roftwood","Shackleville","Stanbury Village","Tapton","West Grayside"]
};


// 🔥 SECTOR CHANGE → LOAD SUBURBS
document.getElementById("sector").addEventListener("change", function () {
  const sector = this.value;
  const suburbSelect = document.getElementById("suburb");
  const revivePointSelect = document.getElementById("revivePoint");

  suburbSelect.innerHTML = '<option value="">--</option>';
  revivePointSelect.innerHTML = '<option value="">--</option>';
  document.getElementById("maintainer").value = "";

  if (!sectorSuburbs[sector]) return;

  sectorSuburbs[sector].forEach(function (s) {
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s;
    suburbSelect.appendChild(opt);
  });
});


// 🔥 SUBURB CHANGE → LOAD REVIVE POINTS
document.getElementById("suburb").addEventListener("change", function () {
  const suburb = this.value;
  const revivePointSelect = document.getElementById("revivePoint");

  revivePointSelect.innerHTML = '<option value="">--</option>';
  document.getElementById("maintainer").value = "";

  if (!reviveData[suburb]) return;

  reviveData[suburb].forEach(function (rp) {
    const opt = document.createElement("option");
    opt.value = rp.name;
    opt.textContent = rp.name;
    revivePointSelect.appendChild(opt);
  });
});


// 🔥 REVIVE POINT CHANGE → SHOW MAINTAINER
document.getElementById("revivePoint").addEventListener("change", function () {
  const suburb = document.getElementById("suburb").value;
  const selected = this.value;

  const maintainerField = document.getElementById("maintainer");
  maintainerField.value = "";

  if (!reviveData[suburb]) return;

  const rp = reviveData[suburb].find(r => r.name === selected);

  if (rp && rp.maintainer) {
    maintainerField.value = rp.maintainer;
  } else {
    maintainerField.value = "—";
  }
});


// 🔥 FORM SUBMISSION
document.getElementById("reviveForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const status = document.getElementById("status");
  status.textContent = "Sending...";

  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://script.google.com/macros/s/AKfycbwqsSGaKA0zTcwSbF8regABZFcXMpyg8gXrS7l_oDiWgb170_FuuXNZxlO7c3G0Gy5E/exec";
  form.target = "hidden_iframe";

  function addField(name, value) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  addField("playerName", this.playerName.value);
  addField("profileLink", this.profileLink.value);
  addField("sector", this.sector.value);
  addField("suburb", this.suburb.value);
  addField("location", this.revivePoint.value);
  addField("notes", this.notes.value);

  document.body.appendChild(form);
  form.submit();
  form.remove();

  status.textContent = "✅ Revive request sent!";
  this.reset();

  document.getElementById("suburb").innerHTML = '<option value="">--</option>';
  document.getElementById("revivePoint").innerHTML = '<option value="">--</option>';
  document.getElementById("maintainer").value = "";
});

});
