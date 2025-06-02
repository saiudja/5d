const redirectUrl = "https://saiudja.space/plants-activation-25.html";

async function checkCode() {
  const code = document.getElementById("codeInput").value;
  const resultElement = document.getElementById("result");
  const errorElement = document.getElementById("error");
  resultElement.textContent = "";
  errorElement.textContent = "";

  if (!code) {
    errorElement.textContent = "⚠️ Введіть код активації.";
    return;
  }

  try {
    const response = await fetch("/.netlify/functions/check-code", {
      method: "POST",
      body: JSON.stringify({ code }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();

    if (response.status === 405) {
      errorElement.textContent =
        "⚠️ Помилка 405: Сервер не підтримує цей метод.";
      return;
    }

    if (data.error) {
      errorElement.textContent = `⚠️ Помилка: ${data.error}`;
      return;
    }

    if (data.valid) {
      resultElement.textContent = "✅ Код дійсний! Перенаправляємо...";
      setTimeout(() => (window.location.href = redirectUrl), 2000);
    } else {
      errorElement.textContent = "⛔ Невірний код.";
    }
  } catch (error) {
    console.error("Помилка:", error);
    errorElement.textContent = "⚠️ Помилка сервера. Спробуйте ще раз.";
  }
}
