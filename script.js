// Suburb data by sector
const suburbs = {
  NW: ["Chancelwood", "Dakerstown", "Darvall Heights", "Dulston", "Dunningwood", "Earletown", "Gibsonton", "Grigg Heights", "Heytown", "Judgewood", "Ketchelbank", "Kinch Heights", "Lamport Hills", "Lumber Mall", "Malton", "Molebank", "Mongkol Crescent", "Mosport Hills", "New Arkham", "Nixbank", "Pescodside", "Pimbank", "Roachtown", "Roftwood", "Roywood", "Ruddlebank", "Spracklingbank", "Starlingtown", "Raines Hills"],
  NE: ["Amber Hills", "Andrewsville", "Beale Hills", "Brooke Hills", "Brooksville", "Buttonville", "Calvert Hills", "Chudleyton", "Clapton", "Cordinier Place", "Dentonside", "Dibb Square", "East Boundwood", "Edgecombe", "Foulkes Village", "Gibsonton", "Giddings", "Grigg Heights", "Houldenbank", "Huntley Heights", "Judgewood", "Kinch Heights", "Kinnell", "Lamport Hills", "Lerwill Heights", "Millen Hills", "Molebank", "Mongkol Crescent", "Mosport Hills", "Nixbank", "Pescodside", "Pimbank", "Quarlesbank", "Randallbank", "Richmond Hills", "Roftwood", "Roywood", "Ruddlebank", "Shearbank", "Spracklingbank", "Starlingtown", "Stickling", "Tapton", "Tolman Heights", "Treeby", "Vinetown", "Wray Heights", "Wyke Hills"],
  SW: ["Alexis Drive", "Bale Mall", "Borehamwood", "Brooke Hills", "Buttonville", "Cinderwall", "Cordinier Place", "Crooketon", "Crowbank", "Dartside", "Dentonside", "Dibb Square", "Dunell Hills", "East Grayside", "Foulkes Village", "Gatcombeton", "Grigg Heights", "Gulsonside", "Houldenbank", "Huntley Heights", "Ketchelbank", "Kinch Heights", "Lamport Hills", "Lerwill Heights", "Lukinswood", "Millen Hills", "Molebank", "Mongkol Crescent", "Mosport Hills", "Nixbank", "Paynterton", "Pescodside", "Pimbank", "Quarlesbank", "Randallbank", "Roftwood", "Roywood", "Ruddlebank", "Shearbank", "South Blythville", "Spracklingbank", "Starlingtown", "Stickling", "Tapton", "Tolman Heights", "Treeby", "Vinetown", "Wray Heights", "Wyke Hills"],
  SE: ["Abbeywood", "Ainslie Row", "Amber Hills", "Andrewsville", "Beale Hills", "Brooke Hills", "Brooksville", "Buttonville", "Calvert Hills", "Chudleyton", "Clapton", "Cordinier Place", "Dentonside", "Dibb Square", "East Boundwood", "Edgecombe", "Foulkes Village", "Giddings", "Grigg Heights", "Houldenbank", "Huntley Heights", "Kinch Heights", "Kinnell", "Lamport Hills", "Lerwill Heights", "Millen Hills", "Molebank", "Mongkol Crescent", "Mosport Hills", "Nixbank", "Pescodside", "Pimbank", "Quarlesbank", "Randallbank", "Richmond Hills", "Roftwood", "Roywood", "Ruddlebank", "Shearbank", "Spracklingbank", "Starlingtown", "Stickling", "Tapton", "Tolman Heights", "Treeby", "Vinetown", "Wray Heights", "Wyke Hills"],
  Central: ["Barrville", "Berkstead", "Borehamwood", "Brooke Hills", "Buttonville", "Cordinier Place", "Crooketon", "Dentonside", "Dibb Square", "Dunell Hills", "East Grayside", "Foulkes Village", "Gatcombeton", "Grigg Heights", "Gulsonside", "Houldenbank", "Huntley Heights", "Kinch Heights", "Lamport Hills", "Lerwill Heights", "Millen Hills", "Molebank", "Mongkol Crescent", "Mosport Hills", "Nixbank", "Pescodside", "Pimbank", "Quarlesbank", "Randallbank", "Roftwood", "Roywood", "Ruddlebank", "Shearbank", "Spracklingbank", "Starlingtown", "Stickling", "Tapton", "Tolman Heights", "Treeby", "Vinetown", "Wray Heights", "Wyke Hills"]
};

// Populate suburb dropdown when sector changes
document.getElementById("sector").addEventListener("change", function () {
  const sector = this.value;
  const suburbSelect = document.getElementById("suburb");
  const revivePointSelect = document.getElementById("revivePoint");

  suburbSelect.innerHTML = '<option value="">--</option>';
  revivePointSelect.innerHTML = '<option value="">--</option>';

  if (suburbs[sector]) {
    suburbs[sector].forEach(function (s) {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      suburbSelect.appendChild(opt);
    });
  }
});

// Handle form submission
document.getElementById("reviveForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const status = document.getElementById("status");
  status.textContent = "Sending...";

  const formData = {
    playerName: this.querySelector('[name="playerName"]').value,
    profileLink: this.querySelector('[name="profileLink"]').value,
    sector: this.querySelector('[name="sector"]').value,
    suburb: this.querySelector('[name="suburb"]').value,
    revivePoint: this.querySelector('[name="revivePoint"]').value,
    notes: this.querySelector('[name="notes"]').value
  };

  try {
    const response = await fetch("/.netlify/functions/revive", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      status.textContent = "✅ Revive request sent!";
      this.reset();
      document.getElementById("suburb").innerHTML = '<option value="">--</option>';
      document.getElementById("revivePoint").innerHTML = '<option value="">--</option>';
    } else {
      status.textContent = "❌ Something went wrong. Try again.";
    }
  } catch (err) {
    console.error(err);
    status.textContent = "❌ Failed to send. Check your connection.";
  }
});
