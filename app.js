function sendToExtension() {
  const extensionId = "fhafdbecdohieooenndcbmgcdnabodin"; // Replace with your extension's ID
  if (typeof chrome !== "undefined" && chrome.runtime) {
    chrome.runtime.sendMessage(extensionId, { message: "Hello from PWA" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message from PWA:", chrome.runtime.lastError.message);
        return;
      }
      console.log("Response from extension:", response);
    });
  } else {
    console.error("Chrome runtime not available");
  }
}