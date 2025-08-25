const audioElement = document.getElementById('audio');
const volumeSlider = document.getElementById('volumeSlider');
const outputSelect = document.getElementById('outputSelect');
const logs = document.getElementById('logs');

function log(msg) {
  console.log(msg);
  logs.textContent += msg + "\n";
  logs.scrollTop = logs.scrollHeight;
}

// Web Audio API for volume control
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const track = audioCtx.createMediaElementSource(audioElement);
const gainNode = audioCtx.createGain();
track.connect(gainNode).connect(audioCtx.destination);

// Volume slider
volumeSlider.addEventListener('input', () => {
  gainNode.gain.value = parseFloat(volumeSlider.value);
  log(`Volume set to: ${gainNode.gain.value}`);
});

// List available audio outputs
async function listOutputs() {
  await navigator.mediaDevices.getUserMedia({ audio: true });
  const devices = await navigator.mediaDevices.enumerateDevices();
  const outputs = devices.filter(d => d.kind === 'audiooutput');
  outputSelect.innerHTML = '';
  outputs.forEach(device => {
    const opt = document.createElement('option');
    opt.value = device.deviceId;
    opt.textContent = device.label || `Device ${device.deviceId}`;
    outputSelect.appendChild(opt);
  });
  log('Available audio outputs: ' + outputs.map(d => d.label).join(', '));
}

// Change output device
outputSelect.addEventListener('change', async () => {
  const deviceId = outputSelect.value;
  try {
    await audioElement.setSinkId(deviceId);
    log(`Output device changed to: ${outputSelect.selectedOptions[0].text}`);
  } catch (err) {
    log('Error changing output device: ' + err);
  }
});

// Initial setup
audioElement.addEventListener('play', () => {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
    log('AudioContext resumed');
  }
});

// Load outputs on start
listOutputs();

// Update outputs when devices change
navigator.mediaDevices.ondevicechange = () => {
  log('Device list changed');
  listOutputs();
};
