const API_URL = "https://ozonous-vivien-pancratic.ngrok-free.dev";

document.addEventListener('DOMContentLoaded', () => {
    populateHours();
    setupEventListeners();
});

function populateHours() {
    const hourSelect = document.getElementById('hour');
    for (let i = 0; i < 24; i++) {
        const option = document.createElement('option');
        const hourFormatted = i.toString().padStart(2, '0');
        option.value = i;
        option.textContent = `${hourFormatted}:00`;
        hourSelect.appendChild(option);
    }
    // Set default to current hour
    const currentHour = new Date().getHours();
    hourSelect.value = currentHour;
}

function setupEventListeners() {
    const form = document.getElementById('predictionForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('predictBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const loader = submitBtn.querySelector('.loader');
        const errorMsg = document.getElementById('error-message');
        const resultCard = document.getElementById('resultCard');

        // Reset state
        errorMsg.classList.add('hidden');
        errorMsg.textContent = '';
        btnText.style.opacity = '0';
        loader.classList.remove('hidden');
        submitBtn.disabled = true;

        try {
            const formData = getFormData();
            const data = await fetchPrediction(formData);

            if (data.error) {
                throw new Error(data.error);
            }

            displayResults(data);

            // Show result card locally if on mobile/small screen to scroll to it
            if (window.innerWidth < 768) {
                resultCard.scrollIntoView({ behavior: 'smooth' });
            }

        } catch (error) {
            console.error('Prediction failed:', error);
            errorMsg.textContent = `Error: ${error.message || 'Failed to connect to the prediction API.'}`;
            errorMsg.classList.remove('hidden');
        } finally {
            // Restore button state
            btnText.style.opacity = '1';
            loader.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });
}

function getFormData() {
    return {
        route: document.getElementById('route').value,
        stop: document.getElementById('stop').value,
        hour: document.getElementById('hour').value,
        weekday: document.getElementById('weekday').value,
        weather: document.getElementById('weather').value
    };
}

async function fetchPrediction(params) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_URL}/predict?${queryString}`;

    // Note: Since this is calling a user's local tunnel, it might be slow.
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        }
    });

    if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
    }

    return await response.json();
}

function displayResults(data) {
    const resultCard = document.getElementById('resultCard');
    const statusBadge = document.getElementById('statusBadge');
    const passengerCount = document.getElementById('passengerCount');
    const totalSeats = document.getElementById('totalSeats');
    const crowdLevel = document.getElementById('crowdLevel');
    const explanationText = document.getElementById('explanationText');
    const occupancyCircle = document.getElementById('occupancyCircle');

    // Make visible
    resultCard.classList.remove('hidden');
    resultCard.classList.add('visible');

    // Update Text
    passengerCount.textContent = data.predicted_passengers;
    totalSeats.textContent = data.total_seats;

    // Calculate percentage for the SVG circle (approximate)
    // Max capacity visualization logic: assume max reasonable is 150% of seats
    const maxReference = data.total_seats * 1.5;
    let percentage = (data.predicted_passengers / maxReference) * 100;
    if (percentage > 100) percentage = 100;

    // Update Circle Stroke
    // stroke-dasharray: current, total(100)
    occupancyCircle.style.strokeDasharray = `${percentage}, 100`;

    // Status Styling
    const isOvercrowded = data.status === 'Overcrowded';

    if (isOvercrowded) {
        statusBadge.textContent = 'High Traffic';
        statusBadge.className = 'status-badge danger';
        crowdLevel.textContent = 'Overcrowded';
        crowdLevel.style.color = 'var(--danger)';
        occupancyCircle.style.stroke = 'var(--danger)';
    } else {
        statusBadge.textContent = 'Available Seats';
        statusBadge.className = 'status-badge safe';
        crowdLevel.textContent = 'Comfortable';
        crowdLevel.style.color = 'var(--success)';
        occupancyCircle.style.stroke = 'var(--success)';
    }

    // Explanation
    explanationText.textContent = data.explanation || "Prediction completed successfully.";
}
