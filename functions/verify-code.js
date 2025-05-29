const fs = require("fs").promises;
const path = require("path");

exports.handler = async function (event) {
  try {
    const { code } = JSON.parse(event.body);
    const filePath = path.join(__dirname, "codes.json");

    // Перевірка наявності файлу
    let codesData;
    try {
      const fileContent = await fs.readFile(filePath, "utf8");
      codesData = JSON.parse(fileContent);
    } catch (error) {
      if (error.code === "ENOENT") {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "Файл кодів не знайдено" }),
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
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Помилка сервера" }),
    };
  }
};
