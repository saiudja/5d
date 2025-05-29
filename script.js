const contractAddress = "0x07f2dda4f4ce04e56308f1165e30c53430bdbe62";
const redirectUrl = "https://saiudja.space/plants-activation-25.html";

const abi = [
  "function balanceOfBatch(address[] accounts, uint256[] ids) view returns (uint256[])",
];

async function switchToBaseMainnet(provider) {
  try {
    await provider.send("wallet_switchEthereumChain", [{ chainId: "0x2105" }]);
  } catch (switchError) {
    if (switchError.code === 4902) {
      await provider.send("wallet_addEthereumChain", [
        {
          chainId: "0x2105",
          chainName: "Base Mainnet",
          rpcUrls: ["https://mainnet.base.org"],
          nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
          blockExplorerUrls: ["https://basescan.org"],
        },
      ]);
    } else {
      throw switchError;
    }
  }
}

document.getElementById("connectWallet").addEventListener("click", async () => {
  try {
    if (!window.ethereum) {
      document.getElementById("status").innerText =
        "⚠️ Гаманець не виявлено. Відкрийте цю сторінку у браузері MetaMask, Trust Wallet або іншому Web3-гаманці.";
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    document.getElementById("status").innerText =
      "🔗 Підключення до гаманця...";

    await provider.send("eth_requestAccounts", []);

    const network = await provider.getNetwork();
    if (network.chainId !== 8453) {
      await switchToBaseMainnet(provider);
    }

    const signer = provider.getSigner();
    const walletAddress = await signer.getAddress();
    document.getElementById(
      "status"
    ).innerText = `🔍 Перевіряємо NFT для адреси ${walletAddress}...`;

    const contract = new ethers.Contract(contractAddress, abi, provider);
    const tokenIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const accounts = Array(tokenIds.length).fill(walletAddress);
    const balances = await contract.balanceOfBatch(accounts, tokenIds);

    console.log("Token IDs:", tokenIds);
    console.log(
      "Balances:",
      balances.map((b) => b.toNumber())
    );

    const hasNFT = balances.some((balance) => balance.toNumber() > 0);

    if (hasNFT) {
      document.getElementById("status").innerText =
        "✅ Доступ надано! Перенаправляємо...";
      setTimeout(() => (window.location.href = redirectUrl), 2000);
    } else {
      document.getElementById("status").innerText =
        "⛔ У вас немає потрібного NFT. Спробуйте ввести код активації.";
    }
  } catch (err) {
    console.error("Помилка:", err);
    document.getElementById("status").innerText = `⚠️ Помилка: ${
      err.message || "Невідома помилка при з’єднанні з гаманцем."
    }`;
  }
});

document
  .getElementById("activationForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const inputCode = document.getElementById("activationCode").value.trim();
    const statusElement = document.getElementById("status");
    statusElement.innerText = "🔍 Перевіряємо код активації...";

    try {
      const response = await fetch("/.netlify/functions/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inputCode }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (result.valid) {
        statusElement.innerText = "✅ Код підтверджено! Перенаправляємо...";
        setTimeout(() => (window.location.href = redirectUrl), 2000);
      } else {
        statusElement.innerText = `⛔ Неправильний код активації: ${
          result.error || "Перевірте код і спробуйте ще раз."
        }`;
      }
    } catch (err) {
      console.error("Помилка при перевірці коду:", err);
      statusElement.innerText = `⚠️ Помилка при перевірці коду: ${
        err.message || "Спробуйте ще раз."
      }`;
    }
  });

document
  .getElementById("connectWallet")
  .addEventListener("touchstart", async () => {
    document.getElementById("connectWallet").click();
  });
