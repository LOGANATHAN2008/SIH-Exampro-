const fs = require('fs');
const html = fs.readFileSync('register.html', 'utf8');

const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/g;
let match;
let allScripts = '';

while ((match = scriptRegex.exec(html)) !== null) {
    allScripts += match[1] + '\n';
}

fs.writeFileSync('test_scripts.js', allScripts);
console.log("Extracted scripts to test_scripts.js");
