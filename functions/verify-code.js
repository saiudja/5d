const fs = require("fs").promises;
const path = require("path");

exports.handler = async function (event, context) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const { code } = JSON.parse(event.body);
    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ valid: false, error: "Код не надано" }),
      };
    }

    const data = await fs.readFile(
      path.join(__dirname, "../codes.json"),
      "utf8"
    );
    const { codes } = JSON.parse(data);

    const isValid = codes.includes(code.trim());

    return {
      statusCode: 200,
      body: JSON.stringify({ valid: isValid }),
    };
  } catch (err) {
    console.error("Помилка на сервері:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ valid: false, error: "Помилка сервера" }),
    };
  }
};
