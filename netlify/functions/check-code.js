const fs = require("fs").promises;
const path = require("path");

exports.handler = async function (event) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({
          error: "Метод не дозволено. Використовуйте POST.",
        }),
      };
    }

    const { code } = JSON.parse(event.body);
    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Код не надано" }),
      };
    }

    const filePath = path.join(__dirname, "codes.json");
    let codesData;
    try {
      const fileContent = await fs.readFile(filePath, "utf8");
      codesData = JSON.parse(fileContent);
    } catch (error) {
      if (error.code === "ENOENT") {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "Файл codes.json не знайдено" }),
        };
      }
      throw error;
    }

    const isValid = codesData.codes.includes(code);
    return {
      statusCode: 200,
      body: JSON.stringify({ valid: isValid }),
    };
  } catch (error) {
    console.error("Помилка сервера:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Помилка сервера" }),
    };
  }
};
