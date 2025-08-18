chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create("index.html", {
    id: "mainWindow",
    bounds: { width: 800, height: 600 }
  });
});

// Example function: Adjust system audio
function setVolume(level) {
  chrome.audio.getDevices({ isActive: true }, function(devices) {
    devices.forEach(device => {
      if (device.isActive) {
        chrome.audio.setProperties(device.id, { volume: level });
      }
    });
  });
}

// Example function: Submit print job (dummy content)
function printTest() {
  chrome.printing.getPrinters(printers => {
    if (!printers || printers.length === 0) {
      console.error("No printers found!");
      return;
    }

    const printerId = printers[0].id; // pick the first printer (or change manually)

    const samplePdfBase64 =
      "JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL1Jlc291cmNlcyA8PC9Gb250IDw8L0YxIDMgMCBS" +
      "Pj4+Pi9NZWRpYUJveFswIDAgNTk1IDg0Ml0vQ29udGVudHMgNCAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHMg" +
      "WzEgMCBSXT4+CmVuZG9iagozIDAgb2JqCjw8L1R5cGUvRm9udC9TdWJ0eXBlL1R5cGUxL05hbWUvRjEvQmFzZUZvbnQvSGVsdmV0aWNh" +
      "Pj4KZW5kb2JqCjQgMCBvYmoKPDwvTGVuZ3RoIDY2Pj4Kc3RyZWFtCkJUIAovRjEgMjQgVGYKMTAwIDcwMCBUZAooSGVsbG8gZnJvbSBL" +
      "aW9zayBBcHApIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMTAxIDAwMDAw" +
      "IG4gCjAwMDAwMDAwNzYgMDAwMDAgbiAKMDAwMDAwMDE3NSAwMDAwMCBuIAowMDAwMDAwMzA1IDAwMDAwIG4gCjAwMDAwMDA0NzQgMDAw" +
      "MDAgbiAKdHJhaWxlcgo8PC9TaXplIDYvUm9vdCAyIDAgUi9JRCBbPDI4YmM3NTg1ZjgyZjVhYzQzN2Q4ODhmNmRjMWMxZDE1Pl0+Pgpl" +
      "bmR0cmFpbGVyCjU5NQolJUVPRgo=";

    chrome.printing.submitJob({
      printerId: printerId,
      title: "Test Job",
      ticket: {},
      content: [
        {
          type: "application/pdf",
          document: samplePdfBase64
        }
      ]
    }, jobId => {
      if (chrome.runtime.lastError) {
        console.error("Print error:", chrome.runtime.lastError.message);
      } else {
        console.log("Print job submitted with ID:", jobId);
      }
    });
  });
}

