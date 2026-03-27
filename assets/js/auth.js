// assets/js/auth.js

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyDRVrqFxB-Ud_aowGc-qbfpkqDxwcqe6_A",
    authDomain: "iot-app-17303.firebaseapp.com",
    databaseURL: "https://iot-app-17303-default-rtdb.firebaseio.com",
    projectId: "iot-app-17303",
    storageBucket: "iot-app-17303.firebasestorage.app",
    messagingSenderId: "396443535545",
    appId: "1:396443535545:web:50f2e992d13ca9c2b7b368",
    measurementId: "G-HL5HVXKVEC"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// UI State Management
let isSignup = false;

function switchRole(role) {
    document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (role === 'admin') {
        document.getElementById('adminForm').classList.remove('hidden');
        document.getElementById('commuterSection').classList.add('hidden');
    } else {
        document.getElementById('adminForm').classList.add('hidden');
        document.getElementById('commuterSection').classList.remove('hidden');
    }
    document.getElementById('errorMsg').style.display = 'none';
}

function toggleSignup() {
    isSignup = !isSignup;
    const title = document.getElementById('commuterTitle');
    const btn = document.getElementById('commuterBtn');
    const toggleText = document.getElementById('toggleText');

    if (isSignup) {
        title.innerText = "Commuter Sign Up";
        btn.innerText = "Create Account";
        toggleText.innerHTML = 'Already have an account? <span onclick="toggleSignup()">Login</span>';
    } else {
        title.innerText = "Commuter Login";
        btn.innerText = "Login";
        toggleText.innerHTML = 'New to the service? <span onclick="toggleSignup()">Sign Up</span>';
    }
    document.getElementById('errorMsg').style.display = 'none';
}

function showError(msg) {
    const el = document.getElementById('errorMsg');
    el.innerText = msg;
    el.style.display = 'block';
}

// Admin Login
document.getElementById('adminForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;

    if (user === 'admin' && pass === 'admin') {
        window.location.href = 'dashboard.php';
    } else {
        showError('Invalid Admin Credentials (Try admin/admin)');
    }
});

// Commuter Login/Signup
document.getElementById('commuterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('commuterUser').value.trim();
    const pass = document.getElementById('commuterPass').value.trim();

    if (!user || !pass) {
        showError('Please fill in all fields');
        return;
    }

    if (isSignup) {
        // Handle Sign Up
        // Check if user exists first
        database.ref('users/' + user).once('value').then(snapshot => {
            if (snapshot.exists()) {
                showError('Username already taken');
            } else {
                // Create user
                database.ref('users/' + user).set({
                    password: pass, // Plaintext as requested
                    joined: new Date().toISOString()
                }).then(() => {
                    alert('Account created! Please login.');
                    toggleSignup();
                }).catch(err => {
                    showError('Error creating account: ' + err.message);
                });
            }
        });
    } else {
        // Handle Login
        database.ref('users/' + user).once('value').then(snapshot => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                if (userData.password === pass) {
                    window.location.href = 'dashboard.php';
                } else {
                    showError('Incorrect password');
                }
            } else {
                showError('User not found');
            }
        });
    }
});
