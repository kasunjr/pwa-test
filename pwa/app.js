const logs = document.getElementById("logs");
const sendBtn = document.getElementById("sendBtn");

// Replace this with your installed Extension ID after loading
const EXTENSION_ID = "hcbhdceaikcohkplinmibhjjcpnfbfbc";

function log(msg) {
  const div = document.createElement("div");
  div.textContent = msg;
  logs.appendChild(div);
}

sendBtn.addEventListener("click", () => {
  log("PWA: Sending PING to Extension...");

  chrome.runtime.sendMessage(EXTENSION_ID, { type: "PING" }, response => {
    if (chrome.runtime.lastError) {
      log("PWA: Error - " + chrome.runtime.lastError.message);
    } else {
      log("Extension replied: " + response.reply);
    }
  });
});
