const fs = require('fs');

let ls = fs.readFileSync('js/liquid-select.js', 'utf8');
if (!ls.includes('this.selectEl.liquidSelect = this')) {
    ls = ls.replace('this.init();', 'this.init();\n        this.selectEl.liquidSelect = this;');
    fs.writeFileSync('js/liquid-select.js', ls, 'utf8');
}

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

// 3. Update the populate logic to refresh LiquidSelect
// In fetchLocations() -> populate state
reg = reg.replace(/stateSelect\.appendChild\(opt\);\s*\}/g, "stateSelect.appendChild(opt); }\n                if(stateSelect.liquidSelect) stateSelect.liquidSelect.refreshOptions();");

// In populateDistricts()
reg = reg.replace(/distSelect\.disabled = false;\s*\}/g, "distSelect.disabled = false; }\n            if(distSelect.liquidSelect) distSelect.liquidSelect.refreshOptions();");

// In populateColleges()
reg = reg.replace(/colSelect\.appendChild\(optOther\);\s*colSelect\.disabled = false;/g, "colSelect.appendChild(optOther);\n            colSelect.disabled = false;\n            if(colSelect.liquidSelect) colSelect.liquidSelect.refreshOptions();");

// In populateDistricts, handle reset
reg = reg.replace(/distSelect\.disabled = true;/g, "distSelect.disabled = true;\n            if(distSelect.liquidSelect) distSelect.liquidSelect.refreshOptions();");
reg = reg.replace(/colSelect\.disabled = true;/g, "colSelect.disabled = true;\n            if(colSelect.liquidSelect) colSelect.liquidSelect.refreshOptions();");

fs.writeFileSync('register.html', reg, 'utf8');
console.log("Integrated LiquidSelect into register.html");
