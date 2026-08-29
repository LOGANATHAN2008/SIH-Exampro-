const fs = require('fs');
let content = fs.readFileSync('register.html', 'utf8');

// Fix label color and font weight
content = content.replace(
    /\.form-group label\s*\{[^}]+\}/g,
    '.form-group label {\n            display: block;\n            font-size: 13px;\n            font-weight: 800;\n            color: #1a1a1a !important;\n            margin-bottom: 8px;\n        }'
);

// Fix button radius for ALL buttons in register.html just in case
content = content.replace(
    /\.btn-outline\s*\{[^}]+\}/g,
    '.btn-outline {\n            flex: 1;\n            background: transparent;\n            border: 1px solid var(--border);\n            color: var(--text);\n            padding: 14px 0;\n            border-radius: 50px;\n            font-size: 14px;\n            font-weight: 600;\n            cursor: pointer;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            gap: 8px;\n            transition: all .3s;\n        }'
);

fs.writeFileSync('register.html', content, 'utf8');
console.log('Fixed labels and buttons in register.html');
