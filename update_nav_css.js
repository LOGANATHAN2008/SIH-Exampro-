const fs = require('fs');

let css = fs.readFileSync('theme.css', 'utf8');

const newCss = `
    /* Show bottom nav on mobile */
    .mobile-bottom-nav {
        display: flex !important;
        position: fixed !important;
        bottom: 16px !important;
        left: 16px !important;
        right: 16px !important;
        height: 72px !important;
        z-index: 1000 !important;
        justify-content: space-between !important;
        align-items: center !important;
        padding: 6px !important;
        border-radius: 9999px !important;
        background: #0066FF !important; /* Premium solid blue from reference */
        box-shadow: 0 20px 40px rgba(0, 102, 255, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
    }
    
    .light-mode .mobile-bottom-nav {
        background: #0066FF !important; /* Force same beautiful blue in light mode */
    }
    
    /* Sliding Glass Indicator */
    .nav-indicator {
        position: absolute !important;
        top: 6px !important;
        bottom: 6px !important;
        background: rgba(255, 255, 255, 0.2) !important;
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px) !important;
        border: 1px solid rgba(255, 255, 255, 0.5) !important;
        border-radius: 9999px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.8) !important;
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        z-index: 1 !important;
        pointer-events: none !important;
    }

    /* Ensure body has padding so content doesn't hide behind nav */
    body {
        padding-bottom: 100px !important;
    }

    .mobile-bottom-nav .nav-item {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        text-decoration: none !important;
        color: rgba(255, 255, 255, 0.65) !important;
        flex: 1 !important;
        height: 100% !important;
        border-radius: 9999px !important;
        transition: all 0.2s ease !important;
        gap: 4px !important;
        position: relative !important;
        z-index: 2 !important;
        cursor: pointer !important;
        user-select: none !important;
        -webkit-user-select: none !important;
        -webkit-tap-highlight-color: transparent !important;
    }

    .light-mode .mobile-bottom-nav .nav-item {
        color: rgba(255, 255, 255, 0.65) !important;
    }

    .mobile-bottom-nav .nav-item i {
        font-size: 20px !important;
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .mobile-bottom-nav .nav-item .nav-text {
        font-size: 11px !important;
        font-weight: 600 !important;
        opacity: 1 !important;
        white-space: nowrap !important;
        letter-spacing: 0.3px !important;
    }

    /* Active State (Text & Icon turn pure white, pill moves underneath) */
    .mobile-bottom-nav .nav-item.active {
        color: #ffffff !important;
        background: transparent !important; /* Rely on indicator */
        box-shadow: none !important;
    }

    .light-mode .mobile-bottom-nav .nav-item.active {
        color: #ffffff !important;
        background: transparent !important;
    }

    .mobile-bottom-nav .nav-item.active i {
        transform: translateY(-2px);
    }
    
    .mobile-bottom-nav .nav-item:active i {
        transform: scale(0.85) !important;
    }
`;

const regex = /\/\* Show bottom nav on mobile \*\/[\s\S]*?\.mobile-bottom-nav \.nav-item:active \{[\s\S]*?\}/m;
if (regex.test(css)) {
    css = css.replace(regex, newCss.trim());
    fs.writeFileSync('theme.css', css, 'utf8');
    console.log("Successfully updated theme.css with glassmorphism styles.");
} else {
    console.log("Could not find the navigation block in theme.css.");
}
