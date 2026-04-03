exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);

    console.log("Sending:", data);

    // Await the fetch and store the response
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbx_HIshLFMJ1TfP3hsJYmqrWohOh4KTcfSRnGJWq75898PuHgam3UqV7yQTaGPhup8/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        redirect: "follow"
      }
    );

    const text = await response.text();

    console.log("Google said:", text);

    return {
      statusCode: 200,
      body: text
    };

  } catch (err) {
    console.error("ERROR:", err);
    return {
      statusCode: 500,
      body: "Error"
    };
  }
};
