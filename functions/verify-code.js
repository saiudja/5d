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

    // Спроба прочитати codes.json
    let codes = [];
    try {
      const fs = require("fs").promises;
      const path = require("path");
      const data = await fs.readFile(
        path.join(process.cwd(), "codes.json"),
        "utf8"
      );
      codes = JSON.parse(data).codes;
    } catch (fileError) {
      console.error("Помилка читання codes.json:", fileError);
      // Альтернатива: використання змінної середовища
      codes = process.env.ACTIVATION_CODES
        ? process.env.ACTIVATION_CODES.split(",")
        : ["K9N4-P8M2-L5Q7"]; // Резервний код
    }

    const isValid = codes.includes(code.trim());

    return {
      statusCode: 200,
      body: JSON.stringify({ valid: isValid }),
    };
  } catch (err) {
    console.error("Помилка на сервері:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        valid: false,
        error: `Помилка сервера: ${err.message}`,
      }),
    };
  }
};
