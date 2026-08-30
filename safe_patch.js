const fs = require('fs');

let reg = fs.readFileSync('register.html', 'utf8');

// 1. Inject script tags before </body>
if (!reg.includes('colleges-data.js')) {
    reg = reg.replace('</body>', '    <script src="js/colleges-data.js"></script>\n    <script src="js/liquid-select.js"></script>\n</body>');
}

// 2. Initialize LiquidSelect after DOM loads
const initScript = `
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            if(typeof LiquidSelect !== 'undefined') {
                new LiquidSelect('state', 'Select State', true);
                new LiquidSelect('district', 'Select District', true);
                new LiquidSelect('collegeSelect', 'Select College', true);
            }
        });
    </script>
`;
if (!reg.includes("new LiquidSelect('state'")) {
    reg = reg.replace('</body>', initScript + '\n</body>');
}

// Safely patch fetchLocations
reg = reg.replace(
    'stateSelect.appendChild(opt);\n                });\n            } else {',
    'stateSelect.appendChild(opt);\n                });\n                if(stateSelect.liquidSelect) stateSelect.liquidSelect.refreshOptions();\n            } else {'
);

// Safely patch populateDistricts
reg = reg.replace(
    'distSelect.appendChild(opt);\n                });\n                distSelect.disabled = false;\n            }',
    'distSelect.appendChild(opt);\n                });\n                distSelect.disabled = false;\n            }\n            if(distSelect.liquidSelect) distSelect.liquidSelect.refreshOptions();'
);
// Also patch the top of populateDistricts where it clears
reg = reg.replace(
    'distSelect.disabled = true;\n            colSelect.innerHTML',
    'distSelect.disabled = true;\n            if(distSelect.liquidSelect) distSelect.liquidSelect.refreshOptions();\n            colSelect.innerHTML'
);
reg = reg.replace(
    'colSelect.disabled = true;\n            document.getElementById(\'newCollegeWrap\')',
    'colSelect.disabled = true;\n            if(colSelect.liquidSelect) colSelect.liquidSelect.refreshOptions();\n            document.getElementById(\'newCollegeWrap\')'
);

// Safely patch populateColleges
reg = reg.replace(
    'colSelect.disabled = true;\n            document.getElementById(\'newCollegeWrap\')',
    'colSelect.disabled = true;\n            if(colSelect.liquidSelect) colSelect.liquidSelect.refreshOptions();\n            document.getElementById(\'newCollegeWrap\')'
);
reg = reg.replace(
    'optOther.textContent = "My college isn\'t listed";\n            colSelect.appendChild(optOther);\n            \n            colSelect.disabled = false;\n        };',
    'optOther.textContent = "My college isn\'t listed";\n            colSelect.appendChild(optOther);\n            \n            colSelect.disabled = false;\n            if(colSelect.liquidSelect) colSelect.liquidSelect.refreshOptions();\n        };'
);


fs.writeFileSync('register.html', reg, 'utf8');
console.log("Safely integrated LiquidSelect into register.html");
