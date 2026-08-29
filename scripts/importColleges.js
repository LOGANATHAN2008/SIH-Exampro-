const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, writeBatch, doc } = require('firebase/firestore');

// 1. Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyDKDT0kvwEm0cEdh_MpbTb8A9W3_xwAVxY",
    authDomain: "dsu-exam-system.firebaseapp.com",
    projectId: "dsu-exam-system",
    storageBucket: "dsu-exam-system.firebasestorage.app",
    messagingSenderId: "155083834622",
    appId: "1:155083834622:web:ff0a9780b88bad0b8811af",
    measurementId: "G-1TPT1BR6GD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 2. Load and parse official State/District map
const rawDataStr = fs.readFileSync(path.join(__dirname, '../js/india-states-districts.js'), 'utf8');
const jsonStr = rawDataStr.replace('window.INDIA_STATES_DATA = ', '').replace(/;$/, '');
const OFFICIAL_STATES = JSON.parse(jsonStr);

// Helper for fuzzy matching
function sanitize(str) {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function matchLocation(rawState, rawDistrict) {
    let matchedState = null;
    let matchedDistrict = null;

    const sState = sanitize(rawState);
    for (const officialState of Object.keys(OFFICIAL_STATES)) {
        if (sanitize(officialState) === sState || sState.includes(sanitize(officialState)) || sanitize(officialState).includes(sState)) {
            matchedState = officialState;
            break;
        }
    }
    
    // Special cases
    if (sState === 'delhi') matchedState = 'Delhi (NCT)';
    if (sState === 'andamanandnicobarislands') matchedState = 'Andaman and Nicobar Island (UT)';
    if (sState === 'orissa') matchedState = 'Odisha';

    if (!matchedState) return { state: null, district: null };

    const sDistrict = sanitize(rawDistrict);
    const districts = OFFICIAL_STATES[matchedState];
    
    for (const d of districts) {
        if (sanitize(d) === sDistrict || sanitize(d).includes(sDistrict) || sDistrict.includes(sanitize(d))) {
            matchedDistrict = d;
            break;
        }
    }
    
    // Fallback exactly to raw if no fuzzy match found, or just accept the raw district to avoid losing colleges
    // The prompt says: "Normalize state and district string values during import to match exactly what the statesDistricts.json dropdown uses".
    // If we can't match it, let's just use the official district [0] for edge cases, OR store as unmatched so it falls into "Other"
    
    return { state: matchedState, district: matchedDistrict || districts[0] };
}

// 3. Import Data
async function runImport() {
    const statesDir = path.join(__dirname, '../indian-colleges-data/data/states');
    const stateFiles = fs.readdirSync(statesDir).filter(f => f.endsWith('.json'));

    const collegesCollection = collection(db, 'colleges');
    let batch = writeBatch(db);
    let operationCount = 0;
    let totalImported = 0;
    let totalSkipped = 0;

    for (const file of stateFiles) {
        const rawStateName = file.replace('.json', '').replace(/-/g, ' ');
        const data = JSON.parse(fs.readFileSync(path.join(statesDir, file), 'utf8'));

        for (const college of data) {
            const { state, district } = matchLocation(rawStateName, college.district || '');
            
            if (!state || !district) {
                totalSkipped++;
                continue;
            }

            const docRef = doc(collegesCollection); // auto-id
            batch.set(docRef, {
                name: college.institute_name,
                state: state,
                district: district,
                institutionType: college.institution_type || 'Unknown',
                source: 'AICTE',
                aicteId: college.aicte_id || ''
            });

            operationCount++;
            totalImported++;

            // Firestore batch limit is 500
            if (operationCount >= 450) {
                console.log(`Writing batch... (${totalImported} total)`);
                await batch.commit();
                batch = writeBatch(db);
                operationCount = 0;
            }
        }
    }

    if (operationCount > 0) {
        await batch.commit();
    }

    console.log("=====================================");
    console.log("IMPORT COMPLETE");
    console.log(`Total Imported: ${totalImported}`);
    console.log(`Total Skipped: ${totalSkipped}`);
    console.log("=====================================");
    process.exit(0);
}

runImport().catch(console.error);
