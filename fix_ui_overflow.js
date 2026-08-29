const fs = require('fs');

// 1. Fix auth-mobile.css
let css = fs.readFileSync('auth-mobile.css', 'utf8');
css = css.replace(
    /body\s*\{\s*background-color:\s*var\(--auth-bg\);\s*min-height:\s*100vh;\s*display:\s*flex;\s*flex-direction:\s*column;\s*overflow-x:\s*hidden;\s*position:\s*relative;\s*\}/,
    'body {\n    background-color: var(--auth-bg) !important;\n    background-image: none !important;\n    min-height: 100vh;\n    display: flex;\n    flex-direction: column;\n    overflow-x: hidden;\n    position: relative;\n    padding: 0 !important;\n    margin: 0 !important;\n}'
);
css = css.replace(
    /\.auth-wrapper\s*\{\s*width:\s*100vw;/,
    '.auth-wrapper {\n        width: 100%;'
);
fs.writeFileSync('auth-mobile.css', css, 'utf8');


// 2. Fix register.html select appearance and hero text
let html = fs.readFileSync('register.html', 'utf8');

// Fix select appearance
html = html.replace(
    /\.input-wrap select\s*\{([^}]*)\}/g,
    '.input-wrap select {$1\n            appearance: none;\n            -webkit-appearance: none;\n        }'
);

// Push hero text down slightly so it's not under dynamic island
html = html.replace(
    /<div class="auth-hero-text" style="top: 8%;/g,
    '<div class="auth-hero-text" style="top: 12%;'
);

// Also remove body padding from register.html just to be safe
html = html.replace(/padding: 20px;/g, 'padding: 0px;');

fs.writeFileSync('register.html', html, 'utf8');
console.log('Fixed UI issues (padding, overflow, select appearance)');
