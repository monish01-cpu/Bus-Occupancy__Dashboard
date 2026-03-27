document.addEventListener('DOMContentLoaded', () => {

    // --- UI Logic ---

    // Login Handling Removed

    // Sidebar Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target) && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        }
    });

    // Navigation / Tab Switching
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('page-title');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all links
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked link
            item.classList.add('active');

            // Hide all sections
            sections.forEach(section => section.classList.add('hidden'));

            // Show target section
            const targetId = item.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.remove('hidden');

                // Update Page Title
                const icon = item.querySelector('i').outerHTML;
                const text = item.textContent.trim();
                pageTitle.innerHTML = text; // Simplify title update
            }

            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }

            // Map resize fix
            // If checking map section, trigger resize so map renders correctly after being hidden
            if (targetId === 'dashboard') {
                setTimeout(() => {
                    map.invalidateSize();
                }, 100);
            }
        });
    });


    // --- Map Logic ---
    // Initialize map centered on Chennai (default)
    const map = L.map('map').setView([12.9716, 80.2509], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const busIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png', // Generic Bus Icon
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -10]
    });

    let busMarker = L.marker([12.9716, 80.2509], { icon: busIcon }).addTo(map);
    busMarker.bindPopup("<b>Bus-101</b><br>Active").openPopup();


    // --- Data Polling Logic ---

    function updateDashboard(data) {
        // Only update these if the element exists in current DOM (dashboard might be hidden but IDs should still be unique and accessible)
        const speedEl = document.getElementById('speed-val');
        if (speedEl) {
            speedEl.textContent = data.speed;
            document.getElementById('passenger-val').textContent = data.count;
            document.getElementById('pred-val').textContent = data.prediction;
            document.getElementById('coords-lat').textContent = `Lat: ${parseFloat(data.lat).toFixed(4)}`;
            document.getElementById('coords-lon').textContent = `Lon: ${parseFloat(data.lon).toFixed(4)}`;

            // Update Prediction Indicator
            const predIndicator = document.getElementById('pred-indicator');
            predIndicator.className = 'prediction-icon'; // Reset classes

            // Logic for indicator color based on prediction count
            if (data.prediction < 15) {
                predIndicator.classList.add('pred-green');
            } else if (data.prediction < 30) {
                predIndicator.classList.add('pred-yellow');
            } else {
                predIndicator.classList.add('pred-red');
            }
        }

        // Update Map Marker (Leaflet handles internal state well even if map is hidden)
        const newLatLng = new L.LatLng(data.lat, data.lon);
        busMarker.setLatLng(newLatLng);

        // Pan only if map is visible/being viewed to avoid jumping when switching back
        // But for this simple dashboard, panning always is fine too.
        // map.panTo(newLatLng); 
    }

    async function fetchData() {
        try {
            const response = await fetch('fetch.php');
            if (response.ok) {
                const data = await response.json();
                updateDashboard(data);
            } else {
                console.error("Fetch failed");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // Poll every 2 seconds
    setInterval(fetchData, 500);

    // Initial fetch
    fetchData();

});
