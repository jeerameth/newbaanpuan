// Import stylesheets
import './style.css';
import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  child,
  set,
  update,
  get,
  onValue,
} from 'firebase/database';

// Declare global variablke
var profile = {};
var checkedIn = false;
var checkingOut = false;

const firebaseConfig = {
  apiKey: 'AIzaSyCLpvX8JAIcIBwZQdC2IQgIydG8_p6S9VA',
  authDomain: 'project-5263135622667023955.firebaseapp.com',
  databaseURL:
    'https://project-5263135622667023955-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'project-5263135622667023955',
  storageBucket: 'project-5263135622667023955.appspot.com',
  messagingSenderId: '472522199928',
  appId: '1:472522199928:web:3bb5195d399dfbe6722e8d',
  measurementId: 'G-WHGR3VD6VP',
};
// Initialize FIREBASE
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM elements declaration
const checkInButton = document.getElementById('checkIn');
const profileImg = document.getElementById('profileImg');
const displayName = document.getElementById('profileName');
const statusMessage = document.getElementById('profileStatus');
const memberContainer = document.getElementById('memberContainer');

// Checking In
checkInButton.onclick = function () {
  if (checkedIn) {
    if (checkingOut) {
      set(ref(db, `userActive/${profile.id}`), false);
      checkedIn = false;
      checkingOut = false;
      checkInButton.value = '😢 Bye 😢';
      checkInButton.style.padding = '8px 18px';
      checkInButton.style.backgroundColor = 'purple';
      setTimeout(function () {
        checkInButton.value = '🖐 Check in';
        checkInButton.style.padding = '8px 20px';
        checkInButton.style.backgroundColor = 'darkorange';
      }, 3000);
    } else {
      checkingOut = true;
      checkInButton.value = '😱 Leaving?';
      checkInButton.style.padding = '8px 15px';
      checkInButton.style.backgroundColor = 'black';
      setTimeout(function () {
        if (checkedIn) {
          checkingOut = false;
          checkInButton.value = '🥳 Checked in';
          checkInButton.style.padding = '8px 13px';
          checkInButton.style.backgroundColor = 'darkorange';
        }
      }, 1500);
    }
  } else {
    set(ref(db, `userActive/${profile.id}`), true);
    checkedIn = true;
    checkInButton.value = '🥳 Checked in';
    checkInButton.style.padding = '8px 13px';
  }
};

// Check for membership
async function checkMember() {
  get(child(ref(db), `userActive/${profile.id}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        if (snapshot.val()) {
          checkedIn = snapshot.val();
          checkInButton.value = '🥳 Checked in';
          checkInButton.style.padding = '8px 13px';
        }
        get(child(ref(db), `users/${profile.id}/imgUrl`)).then((snapshot) => {
          if (snapshot.exists()) {
            if (snapshot.val() !== profile.imgUrl) {
              update(ref(db, `users/${profile.id}`), {
                imgUrl: profile.imgUrl,
              });
            }
          }
        });
      } else {
        set(ref(db, `userActive/${profile.id}`), false);
        set(ref(db, `users/${profile.id}`), {
          name: profile.name,
          imgUrl: profile.imgUrl,
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
// Get active users
async function getActiveUser() {
  onValue(ref(db, `userActive/`), (snapshot) => {
    if (snapshot.exists()) {
      while (memberContainer.hasChildNodes()) {
        memberContainer.removeChild(memberContainer.firstChild);
      }
      snapshot.forEach((childSnapshot) => {
        if (childSnapshot.val()) {
          get(child(ref(db), `users/${childSnapshot.key}/imgUrl`)).then(
            (memberSnapshot) => {
              if (memberSnapshot.exists()) {
                const eCon = document.createElement('div');
                const eImg = document.createElement('img');
                eImg.src = memberSnapshot.val();
                eImg.classList.add('memberImg');
                eCon.appendChild(eImg);
                memberContainer.appendChild(eCon);
              }
            }
          );
        }
      });
    }
  });
}
// Get user profile
async function getUserProfile() {
  const liffProfile = await liff.getProfile();
  // Cache data
  profile.id = liffProfile.userId;
  profile.imgUrl = liffProfile.pictureUrl;
  profile.name = liffProfile.displayName;
  // Assign to DOM
  profileImg.src = liffProfile.pictureUrl;
  // statusMessage.innerHTML = liffProfile.pictureUrl;
  // statusMessage.innerHTML = liffProfile.statusMessage;
  displayName.innerHTML = liffProfile.displayName;
}

async function main() {
  // Initialize LIFF app)
  getActiveUser();
  await liff.init({ liffId: '1657402535-dDW7EMAl' });
  await getUserProfile();
  checkMember();
}
main();
