// assets/js/app.js

// 1. Firebase Configuration
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

// 2. Tab Switching Logic
document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');

        // Hide all sections
        document.querySelectorAll('.dashboard-section').forEach(sec => sec.classList.remove('active'));
        // Show target section
        const targetId = tab.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');

        // Resize map if the tracking tab is opened (Leaflet quirk)
        if (targetId === 'tracking' && window.mapInstance) {
            setTimeout(() => { window.mapInstance.invalidateSize(); }, 100);
        }
    });
});

// 3. Map Initialization
let mapInstance;
let busMarker;
const defaultLocation = [13.0827, 80.2707]; // Chennai coordinates (implied by "TN92")

function initMap() {
    mapInstance = L.map('map').setView(defaultLocation, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstance);

    // Custom Bus Icon
    const busIcon = L.divIcon({
        html: '<div style="font-size: 24px;">🚌</div>',
        className: 'bus-marker-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    busMarker = L.marker(defaultLocation, { icon: busIcon }).addTo(mapInstance);
    busMarker.bindPopup("<b>Bus: TN92 4044</b><br>Status: Idle").openPopup();
}

// 4. Real-time Tracking & Seat Monitoring
function startTracking() {
    console.log("Starting listener...");

    // Listen to Bus Location
    // Assuming structure: / (root) or /gps for location
    const dbRef = database.ref();
    dbRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // Location
            let lat = data.lat || data.latitude;
            let lng = data.lng || data.long || data.longitude;

            // Seat Count (IR Sensor)
            // Assuming structure: /seats or /ir_sensor
            // If it's single value: 5 (seats filled)
            let filledSeats = data.seats || data.seat_count || 0;
            let totalSeats = 40; // Default capacity
            let occupancyPercent = Math.min(100, Math.round((filledSeats / totalSeats) * 100));

            if (lat && lng) {
                updateBusPosition(lat, lng, data.speed || 0, occupancyPercent, filledSeats);
            }
        }
    });
}

function updateBusPosition(lat, lng, speed, occupancy, filledSeats) {
    if (!mapInstance) return;

    const newLatLng = new L.LatLng(lat, lng);
    busMarker.setLatLng(newLatLng);
    mapInstance.panTo(newLatLng);

    // Color code occupancy
    let occColor = occupancy < 50 ? '#10B981' : (occupancy < 80 ? '#F59E0B' : '#EF4444');

    busMarker.setPopupContent(`
        <b>Bus: TN92 4044</b><br>
        Speed: ${speed} km/h<br>
        <div style="margin-top:5px; font-weight:bold; color:${occColor}">
            Occupancy: ${occupancy}% (${filledSeats} Filled)
        </div>
    `);

    // Update Sidebar/Overlay stats
    const statsHtml = `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
            <span>Speed:</span> <strong>${speed} km/h</strong>
        </div>
        <div style="margin-bottom:5px;">
             <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
                <span>Seat Occupancy:</span> 
                <strong style="color:${occColor}">${filledSeats} / 40</strong>
             </div>
             <div style="width:100%; height:8px; background:#E5E7EB; border-radius:4px; overflow:hidden;">
                <div style="width:${occupancy}%; height:100%; background:${occColor}; transition:width 0.5s;"></div>
             </div>
        </div>
        <div style="display:flex; justify-content:space-between; margin-top:10px;">
             <span>Next Stop:</span> <strong>Guindy Estate</strong>
        </div>
    `;
    document.getElementById('live-stats-content').innerHTML = statsHtml;
}

// 5. Initialize Charts (Mock Data for Visuals)
function initCharts() {
    const ctxPass = document.getElementById('chartPass').getContext('2d');
    new Chart(ctxPass, {
        type: 'line',
        data: {
            labels: ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM'],
            datasets: [{
                label: 'Passenger Count',
                data: [12, 45, 30, 25, 50, 65, 40],
                borderColor: '#D32F2F',
                tension: 0.4
            }]
        }
    });

    const ctxFuel = document.getElementById('chartFuel').getContext('2d');
    new Chart(ctxFuel, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            datasets: [{
                label: 'Efficiency (km/l)',
                data: [4.2, 4.5, 4.1, 4.6, 4.3],
                backgroundColor: '#10B981'
            }]
        }
    });
}

// Init everything on load
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initCharts();
    startTracking();
});
