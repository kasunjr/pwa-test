const extensionId = "cmbheebgjbdgkgghkgpnlapkoblhmcbf"; // replace with your loaded extension ID
const logs = document.getElementById("logs");
const audio = document.getElementById("audioPlayer");

function log(msg){
  const div = document.createElement("div");
  div.textContent = msg;
  logs.appendChild(div);
  logs.scrollTop = logs.scrollHeight;
}

// Send message directly to extension
function sendToExtension(msg){
  log("Sending: " + JSON.stringify(msg));
  chrome.runtime.sendMessage(extensionId, msg, response => {
    log("Extension replied: " + JSON.stringify(response));
    // Fill outputs select if array
    if(Array.isArray(response.reply)){
      const sel = document.getElementById("outputs");
      sel.innerHTML = "";
      response.reply.forEach(dev=>{
        const opt = document.createElement("option");
        opt.value = dev.id;
        opt.textContent = dev.name || dev.id;
        sel.appendChild(opt);
      });
    }
  });
}

// Audio control
document.getElementById("playAudio").addEventListener("click", ()=>{
  audio.play(); log("Audio started");
});
document.getElementById("pauseAudio").addEventListener("click", ()=>{
  audio.pause(); log("Audio paused");
});

// Volume
document.getElementById("setVolume").addEventListener("click", ()=>{
  const level = parseFloat(document.getElementById("volume").value);
  sendToExtension({type:"SET_VOLUME", level});
});

// Mute/unmute
document.getElementById("mute").addEventListener("click", ()=>sendToExtension({type:"MUTE", muted:true}));
document.getElementById("unmute").addEventListener("click", ()=>sendToExtension({type:"MUTE", muted:false}));

// Output devices
document.getElementById("getOutputs").addEventListener("click", ()=>sendToExtension({type:"GET_OUTPUTS"}));
document.getElementById("setOutput").addEventListener("click", ()=>{
  const sel = document.getElementById("outputs");
  if(sel.value) sendToExtension({type:"SET_OUTPUT", deviceId: sel.value});
});

// Print
document.getElementById("printBtn").addEventListener("click", ()=>{
  const text = document.getElementById("printText").value || "Hello";
  sendToExtension({type:"PRINT", text});
});
