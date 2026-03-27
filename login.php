<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Smart Transport Hub</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        .login-container {
            display: flex;
            height: 100vh;
            width: 100%;
            background: #fff;
        }
        .login-brand {
            flex: 1;
            background: linear-gradient(135deg, var(--color-primary) 0%, #b71c1c 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            flex-direction: column;
            padding: 3rem;
            text-align: center;
        }
        .login-form-wrapper {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            background: var(--color-bg-body);
        }
        .login-card {
            width: 100%;
            max-width: 420px;
            background: white;
            padding: 2.5rem;
            border-radius: var(--border-radius-lg);
            box-shadow: var(--shadow-md);
        }
        .form-group { margin-bottom: 1.25rem; }
        .form-label { display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.9rem; }
        .form-input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid #E5E7EB;
            border-radius: 8px;
            font-size: 0.95rem;
            transition: var(--transition);
        }
        .form-input:focus {
            border-color: var(--color-primary);
            outline: none;
            box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
        }
        
        .role-switch {
            display: flex;
            margin-bottom: 1.5rem;
            background: #F3F4F6;
            padding: 4px;
            border-radius: 8px;
        }
        .role-btn {
            flex: 1;
            padding: 8px;
            text-align: center;
            cursor: pointer;
            border-radius: 6px;
            font-weight: 600;
            font-size: 0.9rem;
            color: var(--color-text-muted);
            transition: all 0.3s;
        }
        .role-btn.active {
            background: white;
            color: var(--color-primary);
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .auth-toggle {
            text-align: center;
            margin-top: 1rem;
            font-size: 0.9rem;
            color: var(--color-text-muted);
        }
        .auth-toggle span {
            color: var(--color-primary);
            cursor: pointer;
            font-weight: 600;
        }
        
        .hidden { display: none; }
        .error-msg {
            color: var(--color-danger);
            font-size: 0.85rem;
            margin-bottom: 1rem;
            display: none;
            background: #FEF2F2;
            padding: 0.5rem;
            border-radius: 6px;
            border: 1px solid #FECACA;
        }

        @media (max-width: 768px) {
            .login-container { flex-direction: column; }
            .login-brand { flex: 0 0 150px; padding: 1rem; }
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-brand">
            <img src="assets/img/logo.jpg" alt="Logo" style="width: 150px; height: auto; margin-bottom: 1rem; border-radius: 50%; border: 4px solid rgba(255,255,255,0.2);">
            <h1>Smart Transport Hub</h1>
            <p style="opacity: 0.9; margin-top: 10px;">Centralized Fleet Control System</p>
        </div>
        <div class="login-form-wrapper">
            <div class="login-card fade-in">
                
                <!-- Role Switcher -->
                <div class="role-switch">
                    <div class="role-btn active" onclick="switchRole('admin')">Admin</div>
                    <div class="role-btn" onclick="switchRole('commuter')">Commuter</div>
                </div>

                <div class="error-msg" id="errorMsg"></div>

                <!-- Admin Login Form -->
                <form id="adminForm">
                    <h2 style="margin-bottom: 0.5rem; color: var(--color-primary);">Admin Portal</h2>
                    <p style="margin-bottom: 1.5rem; color: var(--color-text-muted); font-size: 0.9rem;">Hardcoded Access (admin/admin)</p>
                    
                    <div class="form-group">
                        <label class="form-label">Username</label>
                        <input type="text" id="adminUser" class="form-input" placeholder="admin" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Password</label>
                        <input type="password" id="adminPass" class="form-input" placeholder="••••••••" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Login as Admin</button>
                </form>

                <!-- Commuter Form (Login & Signup) -->
                <div id="commuterSection" class="hidden">
                    <h2 style="margin-bottom: 0.5rem; color: var(--color-primary);" id="commuterTitle">Commuter Login</h2>
                    <p style="margin-bottom: 1.5rem; color: var(--color-text-muted); font-size: 0.9rem;">Access real-time bus tracking.</p>

                    <form id="commuterForm">
                        <div class="form-group">
                            <label class="form-label">Username</label>
                            <input type="text" id="commuterUser" class="form-input" placeholder="Enter username" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Password</label>
                            <input type="password" id="commuterPass" class="form-input" placeholder="Enter password" required>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;" id="commuterBtn">Login</button>
                    </form>

                    <div class="auth-toggle">
                        <p id="toggleText">New to the service? <span onclick="toggleSignup()">Sign Up</span></p>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <!-- Firebase SDKs -->
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js"></script>
    
    <!-- Auth Logic -->
    <script src="assets/js/auth.js"></script>
</body>
</html>
