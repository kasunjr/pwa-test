function sendMessage(action, data) {
  chrome.runtime.sendMessage("YOUR_EXTENSION_ID", { action, ...data }, (response) => {
    console.log("PWA received:", response);
    document.getElementById("result").innerText = JSON.stringify(response);
  });
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
