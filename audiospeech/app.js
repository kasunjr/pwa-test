// PWA: app.js
// Configuration for announcements with different volumes
const logs = document.getElementById('logs');

function log(msg) {
  console.log(msg);
  logs.textContent += msg + "\n";
  logs.scrollTop = logs.scrollHeight;
}

const announcements = [
  { text: 'Welcome to the kiosk', volume: 0.7 },
  { text: 'Please wait for assistance', volume: 0.5 },
  { text: 'System update in progress', volume: 0.9 }
];
let currentAnnouncementIndex = 0;
let currentDeviceId = ''; // Store current audio output device ID
let availableDevices = []; // Cache available audio output devices

// Web Audio API context (optional, for future audio processing)
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Function to speak text with Web Speech API
function speakText(text, volume = 1.0) {
  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.volume = Math.max(0.0, Math.min(1.0, volume)); // Ensure volume is 0.0 to 1.0
    utterance.onend = () => resolve();
    utterance.onerror = (err) => reject(err);

    // Attempt to set audio output device for media elements
    if (currentDeviceId && 'setSinkId' in HTMLMediaElement.prototype) {
      const audio = new Audio(); // Dummy audio element
      audio.setSinkId(currentDeviceId)
        .then(() => {
          window.speechSynthesis.speak(utterance);
        })
        .catch(err => {
          log('Failed to set output device:' + err);
          window.speechSynthesis.speak(utterance); // Fallback to default device
        });
    } else {
      window.speechSynthesis.speak(utterance);
    }
  });
}

// Function to get available audio output devices
async function getAudioDevices() {
  try {
    // Request microphone permission to enable device enumeration (may not work in kiosk mode)
    await navigator.mediaDevices.getUserMedia({ audio: true });
    const devices = await navigator.mediaDevices.enumerateDevices();
    const outputDevices = devices.filter(device => device.kind === 'audiooutput');
    log('Available output devices:' + outputDevices);
    return outputDevices;
  } catch (err) {
    log('Error getting audio devices:' + err);
    return [];
  }
}

// Function to set audio output device (temporary)
async function setOutputDevice(deviceId) {
  try {
    if ('setSinkId' in HTMLMediaElement.prototype && availableDevices.some(d => d.deviceId === deviceId)) {
      const audio = new Audio();
      await audio.setSinkId(deviceId);
      currentDeviceId = deviceId;
      log(`Temporarily set audio output to device: ${deviceId}`);
    } else {
      log('setSinkId not supported or invalid device ID');
    }
  } catch (err) {
    log('Error setting output device:' + err);
    currentDeviceId = ''; // Reset to default
  }
}

// Function to run periodic announcements
function startAnnouncements(intervalMs = 10000) {
  setInterval(async () => {
    const { text, volume } = announcements[currentAnnouncementIndex];
    try {
      await speakText(text, volume);
      log(`Played announcement: "${text}" at volume ${volume}`);
      currentAnnouncementIndex = (currentAnnouncementIndex + 1) % announcements.length;
    } catch (err) {
      log('Announcement error:' + err);
    }
  }, intervalMs);
}

// Function to rotate output devices periodically
async function rotateOutputDevices(intervalMs = 30000) {
  availableDevices = await getAudioDevices();
  if (availableDevices.length === 0) {
    log('No audio output devices available');
    return;
  }
  let deviceIndex = 0;
  setInterval(async () => {
    const device = availableDevices[deviceIndex];
    await setOutputDevice(device.deviceId);
    log(`Switched to output device: ${device.label || device.deviceId}`);
    deviceIndex = (deviceIndex + 1) % availableDevices.length;
  }, intervalMs);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
  // Start announcements (every 10 seconds)
  startAnnouncements(10000);

  // Start rotating output devices (every 30 seconds)
  await rotateOutputDevices(30000);

  // Handle device changes (e.g., new devices plugged in)
  navigator.mediaDevices.addEventListener('devicechange', async () => {
    availableDevices = await getAudioDevices();
    log('Audio devices updated:' + availableDevices);
  });
});