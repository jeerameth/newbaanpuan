// Import stylesheets
import './style.css';

// Body element
const body = document.getElementById('body');

// Button elements
const btnSend = document.getElementById('btnSend');
const btnClose = document.getElementById('btnClose');
const btnShare = document.getElementById('btnShare');
const btnLogIn = document.getElementById('btnLogIn');
const btnLogOut = document.getElementById('btnLogOut');
const btnScanCode = document.getElementById('btnScanCode');
const btnOpenWindow = document.getElementById('btnOpenWindow');

// Profile elements
const profileImg = document.getElementById('profileImg');
const displayName = document.getElementById('profileName');
const statusMessage = document.getElementById('profileStatus');

// QR element
const code = document.getElementById('code');
const friendShip = document.getElementById('friendShip');

async function getUserProfile() {
  const profile = await liff.getProfile();
  profileImg.src = profile.pictureUrl;
  statusMessage.innerHTML = profile.statusMessage;
  displayName.innerHTML = profile.displayName;
}

async function main() {
  // Initialize LIFF app)
  await liff.init({ liffId: '1657402535-dDW7EMAl' });
  getUserProfile();

  // Try a LIFF function
}
main();
