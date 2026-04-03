// netlify/functions/revive.js
exports.handler = async (event) => {
  try {
    // Parse incoming JSON from frontend
    const data = JSON.parse(event.body);

    console.log("Received:", data);

    // Google Sheets Web App URL
    const sheetsUrl = "https://script.google.com/macros/s/AKfycbzE4Pc8Gkr5xIw4OkD3bOxTv_I99BdazyCWoNuIYfWoNGxjyMyIYr7JwG4r0lfCU5KN/exec";

    // Optional: Discord webhook URL
    // const discordUrl = "PASTE_YOUR_DISCORD_WEBHOOK_URL_HERE";

    // Send data to Google Sheets
    const sheetsResponse = await fetch(sheetsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const sheetsText = await sheetsResponse.text();
    console.log("Google Sheets response:", sheetsText);

    // Optional: send to Discord
    /*
    if (discordUrl) {
      await fetch(discordUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `Revive Request: **${data.playerName}** in **${data.suburb}** at **${data.location}**\nProfile: ${data.profileLink}\nNotes: ${data.notes}`
        })
      });
    }
    */

    return {
      statusCode: 200,
      body: sheetsText
    };

  } catch (err) {
    console.error("ERROR:", err);
    return {
      statusCode: 500,
      body: "Error sending revive request"
    };
  }
};
