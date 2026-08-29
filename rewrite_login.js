const fs = require('fs');

const loginPath = 'login.html';
let content = fs.readFileSync(loginPath, 'utf8');

// Inject the CSS link
if (!content.includes('<link rel="stylesheet" href="auth-mobile.css">')) {
    content = content.replace('</head>', '    <link rel="stylesheet" href="auth-mobile.css">\n</head>');
}

// Replace body with new structure
const newBody = `<body>
    <div class="auth-wrapper">
        <div class="auth-illustration">
            <img src="auth_illustration.jpg" alt="Productivity Illustration">
        </div>
        
        <div class="auth-card">
            <h2 class="auth-title">Login</h2>
            <p class="auth-subtitle">Don't Have An Account? <a href="register.html">Sign Up</a></p>
            
            <form id="loginForm" onsubmit="handleLogin(event)" class="auth-form">
                <input type="hidden" name="role" value="student" id="roleStudentRadio" checked onchange="toggleUserType('student')">
                <input type="hidden" name="role" value="staff" id="roleStaffRadio" onchange="toggleUserType('admin')">
                
                <div class="input-group">
                    <i class="fas fa-user"></i>
                    <input type="text" id="email" placeholder="Email, Register No, or Mobile No" required autocomplete="username">
                </div>
                
                <div class="input-group">
                    <i class="fas fa-envelope"></i>
                    <input type="password" id="password" placeholder="Password" required autocomplete="current-password">
                    <i class="fas fa-eye toggle-password" id="eyeIcon" onclick="togglePasswordVisibilityUI()"></i>
                </div>
                
                <div class="input-group" id="adminCodeGroup" style="display: none;">
                    <i class="fas fa-lock"></i>
                    <input type="password" id="adminCode" placeholder="Enter 4-digit code">
                </div>
                
                <!-- CAPTCHA -->
                <div class="captcha-container" style="background:#f7f7f7; padding:10px; border-radius:12px; display:flex; flex-direction:column; gap:10px; margin-bottom: 10px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size: 11px; font-weight:600; color: var(--auth-muted);">CAPTCHA:</span>
                        <div id="captchaText" style="font-weight:bold; letter-spacing:3px;">0U1EE</div>
                        <button type="button" style="background:none; border:none; color:var(--auth-primary); cursor:pointer;" onclick="generateCaptcha()" title="Refresh"><i class="fas fa-sync-alt"></i></button>
                    </div>
                    <input type="text" id="captchaInput" placeholder="Enter captcha" required autocomplete="off" style="width:100%; border:none; border-bottom:1px solid #ccc; background:transparent; outline:none; font-size:14px; padding:5px 0;">
                </div>

                <div class="auth-options">
                    <label>
                        <input type="checkbox" id="rememberMe" checked>
                        Remember Me
                    </label>
                    <a href="#" onclick="openForgotModal(event)">Forgot Password?</a>
                </div>
                
                <button type="submit" class="btn-primary" id="loginBtn">Login</button>
            </form>
            
            <div class="divider">Or Continue With</div>
            
            <div class="social-login">
                <button type="button" class="btn-social btn-apple" onclick="showToast('Apple login coming soon!', 'info')">
                    <i class="fab fa-apple"></i> Apple
                </button>
                <button type="button" class="btn-social btn-google" onclick="showToast('Google login coming soon!', 'info')">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="G"> Google
                </button>
            </div>
        </div>
    </div>`;

// Extract Modals and Scripts
const modalsAndScriptsStart = content.indexOf('<!-- Modals and Toasts -->');
if (modalsAndScriptsStart !== -1) {
    const modalsAndScripts = content.substring(modalsAndScriptsStart);
    // Replace the entire body start to modalsAndScriptsStart
    content = content.substring(0, content.indexOf('<body>')) + newBody + '\n\n    ' + modalsAndScripts;
    fs.writeFileSync(loginPath, content, 'utf8');
    console.log('login.html rewritten successfully.');
} else {
    console.error('Could not find modals and scripts marker in login.html');
}
