const EXT_ID = "djeafmejibhailmgkolpgplplgdpffmd"; // replace with real extension id
const logDiv = document.getElementById("log");

function log(msg) {
  console.log(msg);
  logDiv.innerHTML += `<p>${JSON.stringify(msg)}</p>`;
}

function sendToExtension(message) {
  chrome.runtime.sendMessage(EXT_ID, message, (response) => {
    if (chrome.runtime.lastError) {
      log("Error: " + chrome.runtime.lastError.message);
    } else {
      log("Response: " + JSON.stringify(response));
    }
  });
}

function getDevices() {
  sendToExtension({ action: "getDevices" });
}

function mute() {
  sendToExtension({ action: "setMute", mute: true });
}

function unmute() {
  sendToExtension({ action: "setMute", mute: false });
}

function playSample() {
  const audio = new Audio("sample.mp3");
  audio.play().then(() => log("Playing sample audio")).catch(e => log(e));
}
