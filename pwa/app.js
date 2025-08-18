const logs = document.getElementById("logs");
const sendPingBtn = document.getElementById("sendPing");
const sendCustomBtn = document.getElementById("sendCustom");

function log(msg) {
  const div = document.createElement("div");
  div.textContent = msg;
  logs.appendChild(div);
  logs.scrollTop = logs.scrollHeight;
}

// Listen for replies from extension
window.addEventListener("message", event => {
  if (event.data && event.data.source === "Extension") {
    log("Extension replied: " + event.data.reply);
  }
});

sendPingBtn.addEventListener("click", () => {
  log("PWA: Sending PING to Extension...");
  window.postMessage({ source: "PWA", type: "PING" }, "*");
});

sendCustomBtn.addEventListener("click", () => {
  const payload = "Hello Extension!";
  log("PWA: Sending CUSTOM message: " + payload);
  window.postMessage({ source: "PWA", type: "CUSTOM", payload }, "*");
});
