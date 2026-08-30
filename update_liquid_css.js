const fs = require('fs');

let css = fs.readFileSync('theme.css', 'utf8');

const regex = /\.mobile-bottom-nav \{[\s\S]*?\.nav-indicator \{[\s\S]*?z-index: 1 !important;\s*pointer-events: none !important;\s*\}/m;

const newCss = `/* iOS 26 Liquid Glass Bottom Nav Container */
    .mobile-bottom-nav {
        display: flex !important;
        position: fixed !important;
        bottom: 16px !important;
        left: 16px !important;
        right: 16px !important;
        height: 76px !important;
        z-index: 1000 !important;
        justify-content: space-between !important;
        align-items: center !important;
        padding: 6px !important;
        border-radius: 9999px !important;
        
        /* Realistic frosted glass backdrop */
        background: rgba(255, 255, 255, 0.4) !important;
        backdrop-filter: blur(40px) saturate(200%) !important;
        -webkit-backdrop-filter: blur(40px) saturate(200%) !important;
        
        /* Soft rim lighting and drop shadows */
        border: 1px solid rgba(255, 255, 255, 0.6) !important;
        box-shadow: 
            0 24px 48px -12px rgba(0, 0, 0, 0.15), 
            inset 0 1px 1px rgba(255, 255, 255, 0.9), 
            inset 0 -1px 1px rgba(255, 255, 255, 0.3) !important;
            
        /* Elastic transformation hardware acceleration */
        will-change: transform;
        touch-action: none !important; /* Disable browser scrolling on the nav */
    }
    
    .dark-mode .mobile-bottom-nav, body:not(.light-mode) .mobile-bottom-nav {
        background: rgba(30, 30, 40, 0.4) !important;
        border: 1px solid rgba(255, 255, 255, 0.15) !important;
        box-shadow: 
            0 24px 48px -12px rgba(0, 0, 0, 0.5), 
            inset 0 1px 1px rgba(255, 255, 255, 0.15), 
            inset 0 -1px 1px rgba(255, 255, 255, 0.05) !important;
    }
    
    .light-mode .mobile-bottom-nav {
        background: rgba(255, 255, 255, 0.4) !important;
        border: 1px solid rgba(255, 255, 255, 0.6) !important;
        box-shadow: 
            0 24px 48px -12px rgba(0, 0, 0, 0.15), 
            inset 0 1px 1px rgba(255, 255, 255, 0.9), 
            inset 0 -1px 1px rgba(255, 255, 255, 0.3) !important;
    }
    
    /* Active Item Glass Bubble */
    .nav-indicator {
        position: absolute !important;
        top: 6px !important;
        bottom: 6px !important;
        
        /* Vibrant pinkish glass bubble matching reference image */
        background: linear-gradient(135deg, rgba(255, 240, 245, 0.9), rgba(255, 220, 235, 0.8)) !important;
        border-radius: 9999px !important;
        
        /* Subtle rim highlight and pink glow */
        border: 1px solid rgba(255, 255, 255, 0.8) !important;
        box-shadow: 
            0 8px 24px rgba(255, 51, 102, 0.15), 
            inset 0 2px 2px rgba(255, 255, 255, 1) !important;
        
        /* Note: smooth transition is handled in JS (0.5s cubic-bezier) */
        z-index: 1 !important;
        pointer-events: none !important;
        will-change: transform, width;
    }
    
    .dark-mode .nav-indicator, body:not(.light-mode) .nav-indicator {
        background: linear-gradient(135deg, rgba(255, 51, 102, 0.15), rgba(255, 51, 102, 0.05)) !important;
        border: 1px solid rgba(255, 51, 102, 0.3) !important;
        box-shadow: 
            0 8px 24px rgba(255, 51, 102, 0.2), 
            inset 0 1px 1px rgba(255, 100, 150, 0.4) !important;
    }`;

if (regex.test(css)) {
    css = css.replace(regex, newCss);
    
    // Fix inactive text colors
    const itemRegex = /\.mobile-bottom-nav \.nav-item \{[\s\S]*?cursor: pointer !important;/m;
    css = css.replace(itemRegex, `.mobile-bottom-nav .nav-item {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        text-decoration: none !important;
        color: #71717A !important; /* Soft gray for inactive items */
        flex: 1 !important;
        height: 100% !important;
        border-radius: 9999px !important;
        transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        gap: 4px !important;
        position: relative !important;
        z-index: 2 !important;
        cursor: pointer !important;`);
        
    const lightTextRegex = /\.light-mode \.mobile-bottom-nav \.nav-item \{[\s\S]*?\}/m;
    css = css.replace(lightTextRegex, `.light-mode .mobile-bottom-nav .nav-item {
        color: #71717A !important;
    }
    .dark-mode .mobile-bottom-nav .nav-item, body:not(.light-mode) .mobile-bottom-nav .nav-item {
        color: #A1A1AA !important; /* Lighter gray for dark mode */
    }`);
    
    // Fix active text colors (Vibrant Pink #FF1493 or #F43F5E)
    const activeTextRegex = /\/\* Active State[\s\S]*?\.mobile-bottom-nav \.nav-item\.active \{[\s\S]*?box-shadow: none !important;\s*\}/m;
    css = css.replace(activeTextRegex, `/* Active State (Pink accent) */
    .mobile-bottom-nav .nav-item.active {
        color: #E11D48 !important; /* Premium Pink/Rose */
        background: transparent !important;
        box-shadow: none !important;
    }`);
    
    const activeLightRegex = /\.light-mode \.mobile-bottom-nav \.nav-item\.active \{[\s\S]*?\}/m;
    css = css.replace(activeLightRegex, `.light-mode .mobile-bottom-nav .nav-item.active {
        color: #E11D48 !important;
        background: transparent !important;
    }
    .dark-mode .mobile-bottom-nav .nav-item.active, body:not(.light-mode) .mobile-bottom-nav .nav-item.active {
        color: #FDA4AF !important; /* Bright pink for dark mode */
    }`);

    // Adjust icon size and spacing
    const iconRegex = /\.mobile-bottom-nav \.nav-item i \{[\s\S]*?\}/m;
    css = css.replace(iconRegex, `.mobile-bottom-nav .nav-item i {
        font-size: 22px !important;
        transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }`);
    
    const textRegex = /\.mobile-bottom-nav \.nav-item \.nav-text \{[\s\S]*?\}/m;
    css = css.replace(textRegex, `.mobile-bottom-nav .nav-item .nav-text {
        font-size: 11.5px !important;
        font-weight: 500 !important;
        opacity: 1 !important;
        white-space: nowrap !important;
        letter-spacing: 0.2px !important;
        transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }`);
    
    fs.writeFileSync('theme.css', css, 'utf8');
    console.log("Updated theme.css with Liquid Glass visuals.");
} else {
    console.log("Could not find the target CSS block.");
}
