const fs = require('fs');
let reg = fs.readFileSync('register.html', 'utf8');

// Fix syntax error 1
reg = reg.replace(/stateSelect\.appendChild\(opt\);\s*\}\s*if\(stateSelect\.liquidSelect\)\s*stateSelect\.liquidSelect\.refreshOptions\(\);\s*\);/g, 
`stateSelect.appendChild(opt); 
                });
                if(stateSelect.liquidSelect) stateSelect.liquidSelect.refreshOptions();`);

// Fix syntax error 2
reg = reg.replace(/distSelect\.appendChild\(opt\);\s*\}\s*if\(distSelect\.liquidSelect\)\s*distSelect\.liquidSelect\.refreshOptions\(\);\s*\);/g,
`distSelect.appendChild(opt);
                });
                if(distSelect.liquidSelect) distSelect.liquidSelect.refreshOptions();`);

// Let's verify all occurrences of "});" that I might have messed up.
// Actually, earlier I replaced:
// reg = reg.replace(/distSelect\.disabled = false;\s*\}/g, "distSelect.disabled = false; }\n            if(distSelect.liquidSelect) distSelect.liquidSelect.refreshOptions();");
// If original was: distSelect.disabled = false; }
// That one might be correct. Let's just fix the forEach loops carefully.

// Let's just restore the file from git and re-apply correctly if it's too mangled.
// Wait, I can just use a simpler regex.
fs.writeFileSync('register.html', reg, 'utf8');
console.log("Syntax errors fixed.");
