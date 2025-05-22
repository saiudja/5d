const contractAddress = "0x07f2dda4f4ce04e56308f1165e30c53430bdbe62";
const redirectUrl = "https://saiudja.space/plants-activation-25.html";

// ABI для виклику balanceOfBatch (ERC-1155)
const abi = [
  "function balanceOfBatch(address[] accounts, uint256[] ids) view returns (uint256[])",
];

document.getElementById("connectWallet").addEventListener("click", async () => {
  try {
    // Перевірка наявності гаманця (MetaMask або іншого)
    if (!window.ethereum) {
      document.getElementById("status").innerText =
        "⚠️ Гаманець не виявлено. Встановіть MetaMask або інший Web3-гаманець.";
      return;
    }

    // Підключення до гаманця
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    document.getElementById("status").innerText =
      "🔗 Підключення до гаманця...";
    await provider.send("eth_requestAccounts", []);

    // Перевірка мережі (Base Mainnet, chainId: 8453)
    const network = await provider.getNetwork();
    if (network.chainId !== 8453) {
      document.getElementById("status").innerText =
        "⚠️ Будь ласка, підключіться до мережі Base Mainnet.";
      return;
    }

    const signer = provider.getSigner();
    const walletAddress = await signer.getAddress();
    document.getElementById(
      "status"
    ).innerText = `🔍 Перевіряємо NFT для адреси ${walletAddress}...`;

    // Створення екземпляра контракту
    const contract = new ethers.Contract(contractAddress, abi, provider);

    // Перевірка балансу для кількох tokenId
    const tokenIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // Список можливих tokenId
    const accounts = Array(tokenIds.length).fill(walletAddress);
    const balances = await contract.balanceOfBatch(accounts, tokenIds);

    // Логування для діагностики
    console.log("Token IDs:", tokenIds);
    console.log(
      "Balances:",
      balances.map((b) => b.toNumber())
    );

    // Перевірка, чи є хоча б один токен із ненульовим балансом
    const hasNFT = balances.some((balance) => balance.toNumber() > 0);

    if (hasNFT) {
      document.getElementById("status").innerText =
        "✅ Доступ надано! Перенаправляємо...";
      setTimeout(() => (window.location.href = redirectUrl), 2000);
    } else {
      document.getElementById("status").innerText =
        "⛔ У вас немає потрібного NFT. Перевірте свій гаманець.";
    }
  } catch (err) {
    console.error("Помилка:", err);
    document.getElementById("status").innerText = `⚠️ Помилка: ${
      err.message || "Невідома помилка при з’єднанні з гаманцем."
    }`;
  }
});
