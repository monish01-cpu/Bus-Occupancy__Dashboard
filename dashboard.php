<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Transport Hub</title>
    <link rel="stylesheet" href="style.css">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Leaflet Map CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
</head>

<body>

    <!-- Login Overlay Removed -->

    <!-- Sidebar -->
    <div class="sidebar" id="sidebar">
        <div class="logo-container">
            <img src="assets/logo.jpg" alt="Logo">
            <span>Team Dexat</span>
        </div>
        <ul class="nav-links">
            <li><a href="#" class="nav-item active" data-target="dashboard"><i class="fas fa-tachometer-alt"></i>
                    Dashboard</a></li>
            <li><a href="#" class="nav-item" data-target="fleet"><i class="fas fa-bus"></i> Fleet</a></li>
            <li><a href="#" class="nav-item" data-target="routes"><i class="fas fa-route"></i> Routes</a></li>
            <li><a href="#" class="nav-item" data-target="analytics"><i class="fas fa-chart-bar"></i> Analytics</a></li>
            <li><a href="https://team-dexat.wuaze.com/ML/" class="nav-item" style="background: linear-gradient(135deg, #000428, #004e92); color: white; box-shadow: 0 4px 15px rgba(0, 78, 146, 0.4);"><i class="fas fa-brain"></i> ML Prediction</a></li>
            <li><a href="#" class="nav-item" data-target="settings"><i class="fas fa-cog"></i> Settings</a></li>
        </ul>
    </div>

    <!-- Main Content -->
    <div class="main-content">
        <header>
            <div class="menu-toggle" id="menu-toggle">
                <i class="fas fa-bars"></i>
            </div>
            <h1 id="page-title">Dashboard</h1>
            <div class="user-profile">
                <i class="fas fa-user-circle fa-lg"></i>
            </div>
        </header>

        <!-- Dashboard Section -->
        <section id="dashboard" class="content-section">
            <!-- Stats Grid -->
            <div class="stats-grid">
                <div class="card red">
                    <div class="card-header">
                        <span>Speed</span>
                        <i class="fas fa-tachometer-alt card-icon"></i>
                    </div>
                    <div class="card-value"><span id="speed-val">0</span> <span style="font-size: 1rem;">km/h</span>
                    </div>
                    <div class="card-label">Live Bus Speed</div>
                </div>
                <div class="card blue">
                    <div class="card-header">
                        <span>Passengers</span>
                        <i class="fas fa-users card-icon"></i>
                    </div>
                    <div class="card-value" id="passenger-val">0</div>
                    <div class="card-label">Current Occupancy</div>
                </div>
                <div class="card yellow">
                    <div class="card-header">
                        <span>Prediction</span>
                        <i class="fas fa-magic card-icon"></i>
                    </div>
                    <div class="card-value" id="pred-val">0</div>
                    <div class="card-label">
                        <span id="pred-indicator" class="prediction-icon pred-green"></span>
                        Next Stop
                    </div>
                </div>
                <div class="card green">
                    <div class="card-header">
                        <span>Status</span>
                        <i class="fas fa-satellite-dish card-icon"></i>
                    </div>
                    <div class="card-value" style="font-size: 1.2rem; margin-top: 10px;">
                        <div id="coords-lat" style="font-size: 0.9rem;">Lat: --</div>
                        <div id="coords-lon" style="font-size: 0.9rem;">Lon: --</div>
                    </div>
                    <div class="card-label">GPS Coordinates</div>
                </div>
            </div>

            <!-- Map Section -->
            <div class="map-section">
                <div id="map"></div>
            </div>
        </section>

        <!-- Fleet Section -->
        <section id="fleet" class="content-section hidden">
            <div class="fleet-section">
                <h2>Active Fleet Management</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Bus ID</th>
                            <th>Driver</th>
                            <th>Route</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>BUS-101</td>
                            <td>John Doe</td>
                            <td>R-45 (Central - Airport)</td>
                            <td><span class="status-badge status-active">Active</span></td>
                        </tr>
                        <tr>
                            <td>BUS-102</td>
                            <td>Jane Smith</td>
                            <td>R-12 (North - South)</td>
                            <td><span class="status-badge status-idle">Idle</span></td>
                        </tr>
                        <tr>
                            <td>BUS-103</td>
                            <td>Mike Johnson</td>
                            <td>R-08 (East - West)</td>
                            <td><span class="status-badge status-active">Active</span></td>
                        </tr>
                        <tr>
                            <td>BUS-104</td>
                            <td>Robert Brown</td>
                            <td>R-99 (City Loop)</td>
                            <td><span class="status-badge status-active">Active</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- Routes Section -->
        <section id="routes" class="content-section hidden">
            <div class="card">
                <h2>Route Optimization</h2>
                <p style="margin-top: 1rem; color: #666;">Route planning and management interface goes here.</p>
                <div
                    style="margin-top: 2rem; background: #eee; height: 300px; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                    <span style="color: #999;">Route Map Placeholder</span>
                </div>
            </div>
        </section>

        <!-- Analytics Section -->
        <section id="analytics" class="content-section hidden">
            <div class="stats-grid">
                <div class="card">
                    <h3>Daily Ridership</h3>
                    <div style="margin-top: 1rem; font-size: 2rem; font-weight: bold; color: var(--primary-red);">1,245
                    </div>
                </div>
                <div class="card">
                    <h3>Avg Wait Time</h3>
                    <div style="margin-top: 1rem; font-size: 2rem; font-weight: bold; color: var(--primary-red);">4.5
                        min</div>
                </div>
            </div>
            <div class="card" style="margin-top: 1.5rem;">
                <h3>Performance Overview</h3>
                <div
                    style="margin-top: 2rem; background: #eee; height: 250px; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                    <span style="color: #999;">Bar Chart Placeholder</span>
                </div>
            </div>
        </section>

        <!-- Settings Section -->
        <section id="settings" class="content-section hidden">
            <div class="card">
                <h2>System Settings</h2>
                <form style="max-width: 500px; margin-top: 2rem;">
                    <div class="form-group">
                        <label>Refresh Rate (Polling)</label>
                        <select style="width: 100%; padding: 0.5rem; border-radius: 5px; border: 1px solid #ddd;">
                            <option>1 Second</option>
                            <option selected>2 Seconds</option>
                            <option>5 Seconds</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Notifications</label>
                        <div style="display: flex; gap: 1rem; align-items: center;">
                            <input type="checkbox" checked style="width: auto;"> <span style="font-size: 0.9rem;">Enable
                                Email Alerts</span>
                        </div>
                    </div>
                    <button class="btn-primary" style="width: auto; padding: 0.75rem 2rem;">Save Changes</button>
                </form>
            </div>
        </section>

    </div>

    <!-- Scripts -->
    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <script src="main.js"></script>
</body>

</html>