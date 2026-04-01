exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);

    console.log("Sending:", data);

    const response = await fetch("https://script.google.com/macros/s/AKfycbyhNpYYi1YEMllbUmkLPgiG16V_DcbZ4oZIS0YBYPHlfzgiHnP0kRHFjpb2f19Te5n1/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
      redirect: "follow" // 👈 THIS IS THE FIX
    });

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