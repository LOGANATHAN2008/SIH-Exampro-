const fs = require('fs');

let html = fs.readFileSync('register.html', 'utf8');

// 1. Add progress circle 5
html = html.replace(
    '<div class="step-circle" id="prog-4">4</div>',
    '<div class="step-circle" id="prog-4">4</div>\n                <div class="step-line" id="line-4"></div>\n                <div class="step-circle" id="prog-5">5</div>'
);

// 2. Renumber step sections, step numbers, and button handlers
// Step 4 -> 5
html = html.replace('id="step4"', 'id="step5"');
html = html.replace('<div class="step-number">4</div>', '<div class="step-number">5</div>');
html = html.replace(/prevStep\(4\)/g, 'prevStep(5)');

// Step 3 -> 4
html = html.replace('id="step3"', 'id="step4"');
html = html.replace('<div class="step-number">3</div>', '<div class="step-number">4</div>');
html = html.replace(/prevStep\(3\)/g, 'prevStep(4)');
html = html.replace(/nextStep\(3\)/g, 'nextStep(4)');

// Step 2 -> 3
html = html.replace('id="step2"', 'id="step3"');
html = html.replace('<div class="step-number">2</div>', '<div class="step-number">3</div>');
html = html.replace(/prevStep\(2\)/g, 'prevStep(3)');
html = html.replace(/nextStep\(2\)/g, 'nextStep(3)');

// Step 1 -> 2
html = html.replace('id="step1"', 'id="step2"');
html = html.replace('class="step-section active" id="step2"', 'class="step-section" id="step2"');
html = html.replace('<div class="step-number">1</div>', '<div class="step-number">2</div>');
html = html.replace(/nextStep\(1\)/g, 'nextStep(2)');

// 3. Clean up old College fields in new Step 3
html = html.replace(
    /<div class="form-group full">\s*<label>College Name<\/label>\s*<div class="input-wrap">\s*<i class="fas fa-university icon"><\/i>\s*<input type="text" id="college"[^>]*>\s*<\/div>\s*<\/div>/,
    ''
);

html = html.replace(
    /<div class="form-group">\s*<label>Branch<\/label>\s*<div class="input-wrap">\s*<i class="fas fa-code-branch icon"><\/i>\s*<select id="branch">[\s\S]*?<\/select>\s*<\/div>\s*<\/div>/,
    ''
);

// 4. Inject new Step 1
const newStep1 = `
            <!-- Step 1: Location -->
            <div class="step-section active" id="step1">
                <div class="step-header">
                    <div class="step-number">1</div>
                    <div>
                        <h3>Your College</h3>
                        <p style="color:var(--text-muted);font-size:12px">Select your state, district, and college</p>
                    </div>
                </div>
                <div class="form-grid">
                    <div class="form-group full">
                        <label>State</label>
                        <div class="input-wrap">
                            <i class="fas fa-map-marker-alt icon"></i>
                            <select id="state" required onchange="populateDistricts()">
                                <option value="" disabled selected>Select your State</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group full">
                        <label>District</label>
                        <div class="input-wrap">
                            <i class="fas fa-map icon"></i>
                            <select id="district" required onchange="populateColleges()" disabled>
                                <option value="" disabled selected>Select District (choose State first)</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group full">
                        <label>College</label>
                        <div class="input-wrap">
                            <i class="fas fa-university icon"></i>
                            <select id="collegeSelect" required onchange="toggleNewCollegeInput()" disabled>
                                <option value="" disabled selected>Select College (choose District first)</option>
                                <option value="__other__">My college isn't listed</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group full" id="newCollegeWrap" style="display:none">
                        <label>College Name</label>
                        <div class="input-wrap">
                            <i class="fas fa-plus icon"></i>
                            <input type="text" id="newCollegeName" placeholder="Type your college's full name" />
                        </div>
                        <p style="color:var(--text-muted);font-size:11px;margin-top:4px">Your college will be added and marked unverified until an admin confirms it.</p>
                    </div>
                </div>
                <div class="nav-btns">
                    <button class="btn-outline btn-next" onclick="nextStep(1)">Next <i class="fas fa-arrow-right"></i></button>
                </div>
            </div>
`;

html = html.replace('<!-- Step 1: Personal Info -->', newStep1 + '\n            <!-- Step 2: Personal Info -->');

// 5. Update stepper JS logic
const oldNextStep = `        window.nextStep = function (step) {
            if (step === 1) {
                if (!document.getElementById('name').value.trim() ||
                    !document.getElementById('dob').value ||
                    !document.getElementById('phone').value.trim()) {
                    showToast('Please fill all personal details.', 'error'); return;
                }
            }
            if (step === 2) {
                if (!document.getElementById('college').value.trim() ||
                    !document.getElementById('branch').value ||
                    !document.getElementById('department').value.trim() ||
                    !document.getElementById('section').value ||
                    !document.getElementById('year').value) {
                    showToast('Please fill all academic details.', 'error'); return;
                }
            }
            if (step === 3) {
                if (!document.getElementById('registerNumber').value.trim() ||
                    !document.getElementById('email').value.trim()) {
                    showToast('Please fill account details.', 'error'); return;
                }
            }`;

const newNextStep = `        window.nextStep = function (step) {
            if (step === 1) {
                const colSelect = document.getElementById('collegeSelect');
                if (!document.getElementById('state').value || !document.getElementById('district').value || !colSelect.value) {
                    showToast('Please select your college location and name.', 'error'); return;
                }
                if (colSelect.value === '__other__' && !document.getElementById('newCollegeName').value.trim()) {
                    showToast('Please enter your college name.', 'error'); return;
                }
            }
            if (step === 2) {
                if (!document.getElementById('name').value.trim() ||
                    !document.getElementById('dob').value ||
                    !document.getElementById('phone').value.trim()) {
                    showToast('Please fill all personal details.', 'error'); return;
                }
            }
            if (step === 3) {
                if (!document.getElementById('department').value.trim() ||
                    !document.getElementById('section').value ||
                    !document.getElementById('year').value) {
                    showToast('Please fill all academic details.', 'error'); return;
                }
            }
            if (step === 4) {
                if (!document.getElementById('registerNumber').value.trim() ||
                    !document.getElementById('email').value.trim()) {
                    showToast('Please fill account details.', 'error'); return;
                }
            }`;

html = html.replace(oldNextStep, newNextStep);

const newJS = `
        // College Selection Logic
        let locationsData = null;
        
        async function fetchLocations() {
            try {
                const res = await fetch('js/india-states-districts.json');
                locationsData = await res.json();
                const stateSelect = document.getElementById('state');
                Object.keys(locationsData).sort().forEach(state => {
                    const opt = document.createElement('option');
                    opt.value = state;
                    opt.textContent = state;
                    stateSelect.appendChild(opt);
                });
            } catch (e) {
                console.error("Error loading states:", e);
                showToast("Failed to load states. Please refresh.", "error");
            }
        }
        
        window.populateDistricts = function() {
            const state = document.getElementById('state').value;
            const distSelect = document.getElementById('district');
            const colSelect = document.getElementById('collegeSelect');
            
            distSelect.innerHTML = '<option value="" disabled selected>Select District</option>';
            distSelect.disabled = true;
            colSelect.innerHTML = '<option value="" disabled selected>Select College (choose District first)</option><option value="__other__">My college isn\\'t listed</option>';
            colSelect.disabled = true;
            document.getElementById('newCollegeWrap').style.display = 'none';
            
            if (state && locationsData && locationsData[state]) {
                locationsData[state].sort().forEach(dist => {
                    const opt = document.createElement('option');
                    opt.value = dist;
                    opt.textContent = dist;
                    distSelect.appendChild(opt);
                });
                distSelect.disabled = false;
            }
        };
        
        let allCollegesData = null;
        
        window.populateColleges = async function() {
            const state = document.getElementById('state').value;
            const district = document.getElementById('district').value;
            const colSelect = document.getElementById('collegeSelect');
            
            colSelect.innerHTML = '<option value="" disabled selected>Loading colleges...</option>';
            colSelect.disabled = true;
            document.getElementById('newCollegeWrap').style.display = 'none';
            
            if (!state || !district) return;
            
            try {
                if (!allCollegesData) {
                    const res = await fetch('js/colleges-grouped.json');
                    allCollegesData = await res.json();
                }
                
                colSelect.innerHTML = '<option value="" disabled selected>Select College</option>';
                
                const districtColleges = (allCollegesData[state] && allCollegesData[state][district]) || [];
                const colleges = districtColleges.map(name => ({ id: name, name: name }));
                colleges.sort((a,b) => a.name.localeCompare(b.name));
                
                colleges.forEach(c => {
                    const opt = document.createElement('option');
                    opt.value = c.id;
                    opt.textContent = c.name;
                    colSelect.appendChild(opt);
                });
                
                const optOther = document.createElement('option');
                optOther.value = '__other__';
                optOther.textContent = "My college isn't listed";
                colSelect.appendChild(optOther);
                
                colSelect.disabled = false;
            } catch(e) {
                console.error("Error loading colleges", e);
                showToast("Failed to load colleges", "error");
            }
        };
        
        window.toggleNewCollegeInput = function() {
            const colSelect = document.getElementById('collegeSelect');
            document.getElementById('newCollegeWrap').style.display = colSelect.value === '__other__' ? 'block' : 'none';
        };
        
        fetchLocations();
`;

html = html.replace('window.handleRegister = async function () {', newJS + '\n        window.handleRegister = async function () {');

const handleRegisterReplacement = `
        window.handleRegister = async function(e) {
            e.preventDefault();
            const btn = document.getElementById('registerBtn');
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const name = document.getElementById('name').value.trim();
            
            // College Info
            const state = document.getElementById('state').value;
            const district = document.getElementById('district').value;
            const colSelect = document.getElementById('collegeSelect');
            let collegeId = colSelect.value;
            let collegeName = colSelect.options[colSelect.selectedIndex]?.text;
            
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner"></span> Creating Account...';

            if (!(await enforceRateLimit('registration', email))) {
                resetBtn();
                return;
            }

            let photoURL = '';
            if (selectedPhotoFile) {
                btn.innerHTML = '<span class="spinner"></span> Uploading Profile Picture...';
                try {
                    const formData = new FormData();
                    formData.append('file', selectedPhotoFile);
                    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
                    formData.append('folder', 'Exam Erp-avatars');

                    const res = await fetch(\`https://api.cloudinary.com/v1_1/\${CLOUDINARY_CLOUD_NAME}/image/upload\`, {
                        method: 'POST',
                        body: formData
                    });

                    if (res.ok) {
                        const data = await res.json();
                        photoURL = data.secure_url || '';
                    } else {
                        console.warn('Cloudinary upload status:', res.status);
                    }
                } catch (uploadErr) {
                    console.error('Profile photo upload error:', uploadErr);
                }
            }

            btn.innerHTML = '<span class="spinner"></span> Creating Account...';

            let cred = null;
            try {
                cred = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(cred.user, { 
                    displayName: name,
                    photoURL: photoURL || undefined
                });
                
                const uid = cred.user.uid;
                
                // If new college, add it
                if (collegeId === '__other__') {
                    const newName = document.getElementById('newCollegeName').value.trim();
                    if (!newName) throw new Error("Please enter your college name.");
                    
                    const { addDoc, collection, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
                    const docRef = await addDoc(collection(db, 'colleges'), {
                        name: newName,
                        state: state,
                        district: district,
                        addedBy: uid,
                        verified: false,
                        createdAt: serverTimestamp()
                    });
                    collegeId = docRef.id;
                    collegeName = newName;
                }
`;

const regexHandleRegister = /window\.handleRegister = async function \(\) \{[\s\S]*?await updateProfile\(cred\.user, \{[\s\S]*?displayName: name,[\s\S]*?photoURL: photoURL \|\| undefined[\s\S]*?\}\);/m;
if (regexHandleRegister.test(html)) {
    html = html.replace(regexHandleRegister, handleRegisterReplacement);
} else {
    console.log("Could not match handleRegister for top replacement");
}

const oldStudentObj = `                    name, email, registerNumber, phone, dob,
                    college, branch, department, section, year,`;

const newStudentObj = `                    name, email, registerNumber, phone, dob,
                    state, district, collegeId, collegeName, department, section, year,`;
html = html.replace(oldStudentObj, newStudentObj);

const oldNotifObj = `name, email, phone, department, registerNumber,
                        branch, section, year, college,`;

const newNotifObj = `name, email, phone, department, registerNumber,
                        section, year, collegeName,`;
html = html.replace(oldNotifObj, newNotifObj);

fs.writeFileSync('register.html', html);
console.log('Update script executed successfully.');
