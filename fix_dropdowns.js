const fs = require('fs');

let html = fs.readFileSync('register.html', 'utf8');

// Fix 1: Add refreshOptions to fetchLocations
const fetchLocationsOld = `                });
            } else {
                showToast("Failed to load states. Please refresh.", "error");
            }
        }`;
const fetchLocationsNew = `                });
                if (stateSelect.liquidSelect) stateSelect.liquidSelect.refreshOptions();
            } else {
                showToast("Failed to load states. Please refresh.", "error");
            }
        }`;
if (html.includes(fetchLocationsOld)) {
    html = html.replace(fetchLocationsOld, fetchLocationsNew);
    console.log("Fixed fetchLocations");
} else {
    console.log("fetchLocations fix not found");
}

// Fix 2: Add refreshOptions to populateDistricts
const populateDistrictsOld = `                });
                distSelect.disabled = false;
            }
        };`;
const populateDistrictsNew = `                });
                distSelect.disabled = false;
                if(distSelect.liquidSelect) distSelect.liquidSelect.refreshOptions();
                if(colSelect.liquidSelect) colSelect.liquidSelect.refreshOptions();
            }
        };`;
if (html.includes(populateDistrictsOld)) {
    html = html.replace(populateDistrictsOld, populateDistrictsNew);
    console.log("Fixed populateDistricts");
} else {
    console.log("populateDistricts fix not found");
}

fs.writeFileSync('register.html', html);
console.log("Done.");
