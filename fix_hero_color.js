const fs = require('fs');
let html = fs.readFileSync('register.html', 'utf8');

// Change the Join Us text color to white
html = html.replace(
    /<div style="font-size: 36px; font-weight: 800; color: #1a1a1a;">Join Us<\/div>/,
    '<div style="font-size: 36px; font-weight: 800; color: #ffffff;">Join Us</div>'
);
html = html.replace(
    /<div style="font-size: 16px; font-weight: 600; color: #1a1a1a; margin-top: 4px;">Create Free Account<\/div>/,
    '<div style="font-size: 16px; font-weight: 600; color: #ffffff; margin-top: 4px;">Create Free Account</div>'
);

fs.writeFileSync('register.html', html, 'utf8');
console.log('Fixed hero text color');
