
function sendMessage(action, data) {
  const extensionId = "damoodaceljmfneokopemggkoflfjdje"; // Replace with your extension's ID
  if (typeof chrome !== "undefined" && chrome.runtime) {
    chrome.runtime.sendMessage(extensionId, { action, ...data }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message from PWA:", chrome.runtime.lastError.message);
        return;
      }
      console.log("Response from extension:", response);
      //document.getElementById("result").innerText = JSON.stringify(response);
    });
  } else {
    console.error("Chrome runtime not available");
  }

  window.postMessage({ type: action, payload: { ...data } }, "*");
}

document.getElementById("playAudio").addEventListener("click", ()=>{
  audio.play(); log("Audio started");
});
document.getElementById("pauseAudio").addEventListener("click", ()=>{
  audio.pause(); log("Audio paused");
});

// Listen for response
window.addEventListener("message", (event) => {
  console.log("Printer response:", event.data.payload);
  
});

const consoleDiv = document.getElementById("result");

    function printToScreen(type, args) {
      const msg = args.map(a =>
        (typeof a === "object" ? JSON.stringify(a) : a)
      ).join(" ");

      const line = document.createElement("div");
      line.textContent = `[${type}] ${msg}`;
      consoleDiv.appendChild(line);

      // Keep auto-scroll to bottom
      consoleDiv.scrollTop = consoleDiv.scrollHeight;
    }

    // Backup original methods
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;

    // Override
    console.log = (...args) => { printToScreen("log", args); originalLog.apply(console, args); }
    console.error = (...args) => { printToScreen("error", args); originalError.apply(console, args); }
    console.warn = (...args) => { printToScreen("warn", args); originalWarn.apply(console, args); }
    console.info = (...args) => { printToScreen("info", args); originalInfo.apply(console, args); }


function changeVolume() {
  sendMessage("changeVolume", { value: 70 });
}

function switchOutput() {
  sendMessage("switchOutput", { device: "Speakers" });
}

function printImage() {
  sendMessage("printImage", { image: "test.png" });
}