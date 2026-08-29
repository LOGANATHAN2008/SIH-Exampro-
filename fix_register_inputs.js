const fs = require('fs');
let content = fs.readFileSync('register.html', 'utf8');

// Update .input-wrap icon positioning
content = content.replace(
    /\.input-wrap i\.icon {\s*position: absolute;\s*left: 12px;/g,
    '.input-wrap i.icon {\n            position: absolute;\n            right: 16px;\n            left: auto;'
);

// Update input padding and border-radius
content = content.replace(
    /padding: 11px 12px 11px 36px;\s*background: rgba\(255, 255, 255, \.07\);\s*border: 1px solid rgba\(255, 255, 255, \.1\);\s*border-radius: 10px;/g,
    'padding: 14px 40px 14px 20px;\n            background: #f7f7f7 !important;\n            border: 1px solid #e0e0e0 !important;\n            border-radius: 50px;'
);
content = content.replace(
    /padding: 11px 12px 11px 36px;\s*background: rgba\(255, 255, 255, 0\.07\);\s*border: 1px solid rgba\(255, 255, 255, 0\.1\);\s*border-radius: 10px;/g,
    'padding: 14px 40px 14px 20px;\n            background: #f7f7f7 !important;\n            border: 1px solid #e0e0e0 !important;\n            border-radius: 50px;'
);
// For the light mode one too
content = content.replace(
    /padding: 11px 12px 11px 36px;\s*background: #f4f5f8;\s*border: 1\.5px solid transparent;\s*border-radius: 10px;/g,
    'padding: 14px 40px 14px 20px;\n            background: #f7f7f7 !important;\n            border: 1px solid #e0e0e0 !important;\n            border-radius: 50px;'
);

// Update .form-group label
content = content.replace(
    /\.form-group label {\s*display: block;\s*margin-bottom: 6px;\s*color: var\(--text\);\s*font-size: 12px;\s*font-weight: 500;/g,
    '.form-group label {\n            display: block;\n            margin-bottom: 8px;\n            color: #1a1a1a !important;\n            font-size: 13px;\n            font-weight: 700;'
);
content = content.replace(
    /body\.dark-mode \.form-group label \{ color: #94a3b8 !important; \}/g,
    'body.dark-mode .form-group label { color: #1a1a1a !important; }'
);
content = content.replace(
    /body\.dark-mode \.input-wrap input,\s*body\.dark-mode \.input-wrap select {\s*background: rgba\(255,255,255,0\.07\) !important;\s*color: #e2e8f0 !important;\s*border: 1px solid rgba\(255,255,255,0\.1\) !important;\s*}/g,
    'body.dark-mode .input-wrap input,\n        body.dark-mode .input-wrap select {\n            background: #f7f7f7 !important;\n            color: #1a1a1a !important;\n            border: 1px solid #e0e0e0 !important;\n        }'
);

// Update button border-radius
content = content.replace(
    /\.btn-next {\s*flex: 2;\s*background: linear-gradient\(135deg, var\(--primary\), var\(--primary-dark\)\);\s*border: none;\s*}/g,
    '.btn-next {\n            flex: 2;\n            background: var(--primary) !important;\n            border: none;\n            border-radius: 50px !important;\n            padding: 14px 0;\n        }'
);
content = content.replace(
    /\.btn-next {\s*flex: 2;\s*background: linear-gradient\(135deg, var\(--primary\), var\(--primary-dark\)\);\s*border: none;\s*color: white;\s*}/g,
    '.btn-next {\n            flex: 2;\n            background: var(--primary) !important;\n            border: none;\n            border-radius: 50px !important;\n            padding: 14px 0;\n            color: white;\n        }'
);

// Ensure input text color is dark
content = content.replace(
    /\.input-wrap input,\s*\.input-wrap select {/g,
    '.input-wrap input,\n        .input-wrap select {\n            color: #1a1a1a !important;'
);

fs.writeFileSync('register.html', content, 'utf8');
console.log('Fixed register.html inputs');
