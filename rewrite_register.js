const fs = require('fs');

const registerPath = 'register.html';
let content = fs.readFileSync(registerPath, 'utf8');

if (!content.includes('<link rel="stylesheet" href="auth-mobile.css">')) {
    content = content.replace('</head>', '    <link rel="stylesheet" href="auth-mobile.css">\n</head>');
}

// Find body start
const bodyStart = content.indexOf('<body>');
// Find stepper start
const stepperStart = content.indexOf('<div class="stepper-container">');

if (bodyStart !== -1 && stepperStart !== -1) {
    const newTop = `<body>
    <div class="auth-wrapper" style="overflow-y: auto;">
        <div class="auth-illustration">
            <img src="auth_illustration.jpg" alt="Productivity Illustration">
        </div>
        
        <div class="auth-card" style="padding: 30px 20px;">
            <h2 class="auth-title">Sign Up</h2>
            <p class="auth-subtitle">Already Have An Account? <a href="login.html">Log In</a></p>
            
            <div style="width: 100%;">
                `;
    
    // Find the end of the form or card
    // Actually, I can just replace everything before stepper-container with newTop
    const beforeStepper = content.substring(0, bodyStart) + newTop + content.substring(stepperStart);
    
    // Now I need to close the tags at the very end
    // Currently, it ends with:
    //         </div> <!-- end card -->
    //     </div> <!-- end register-container -->
    // </body>
    
    // Let's just do a regex replace for the closing tags. 
    // Or I can just write a robust regex.
    let finalContent = beforeStepper.replace(/<\/div>\s*<\/div>\s*<\/body>/, '</div>\n</div>\n</div>\n</body>');
    
    fs.writeFileSync(registerPath, finalContent, 'utf8');
    console.log('register.html rewritten successfully.');
} else {
    console.error('Could not find body or stepper-container');
}
