exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);

    const response = await fetch("https://script.google.com/macros/s/AKfycbyhNpYYi1YEMllbUmkLPgiG16V_DcbZ4oZIS0YBYPHlfzgiHnP0kRHFjpb2f19Te5n1/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const text = await response.text();

    return {
      statusCode: 200,
      body: text
    };

  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: "Error sending request"
    };
  }
};