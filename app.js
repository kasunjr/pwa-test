
function sendMessage(action, data) {
  const extensionId = "fhafdbecdohieooenndcbmgcdnabodin"; // Replace with your extension's ID
  if (typeof chrome !== "undefined" && chrome.runtime) {
    chrome.runtime.sendMessage(extensionId, { action, ...data }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message from PWA:", chrome.runtime.lastError.message);
        return;
      }
      console.log("Response from extension:", response);
      document.getElementById("result").innerText = JSON.stringify(response);
    });
  } else {
    console.error("Chrome runtime not available");
  }
}

function changeVolume() {
  sendMessage("changeVolume", { value: 70 });
}

function switchOutput() {
  sendMessage("switchOutput", { device: "Speakers" });
}

function printImage() {
  sendMessage("printImage", { image: "test.png" });
}