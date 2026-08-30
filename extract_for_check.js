const fs = require('fs');
const html = fs.readFileSync('register.html', 'utf8');

// extract the scripts
const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/g;
let match;
let i = 0;
while ((match = scriptRegex.exec(html)) !== null) {
    if (match[1].trim() && !match[1].includes('application/ld+json')) {
        fs.writeFileSync(`script_${i}.js`, match[1]);
        i++;
    }
}
console.log(`Extracted ${i} scripts`);
