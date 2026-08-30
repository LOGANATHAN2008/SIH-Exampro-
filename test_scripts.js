
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "https://sih.loganathanm.in/register.html#webpage",
      "url": "https://sih.loganathanm.in/register.html",
      "name": "Student Registration | Exam Erp - Student Portal",
      "description": "Register on Exam Erp to create your student account and access hall tickets, exam results, internal marks, attendance, and academic services.",
      "isPartOf": { "@id": "https://sih.loganathanm.in/#website" },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sih.loganathanm.in/" },
          { "@type": "ListItem", "position": 2, "name": "Student Registration", "item": "https://sih.loganathanm.in/register.html" }
        ]
      },
      "inLanguage": "en-US"
    }
    




        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
        import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-check.js";
        import { getAuth, createUserWithEmailAndPassword, updateProfile, deleteUser, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
        import { getFirestore, doc, setDoc, serverTimestamp, collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
        import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-functions.js";

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
        const appCheck = initializeAppCheck(app, {
            provider: new ReCaptchaV3Provider('6Leua30tAAAAANy_qYf2oF4vC-BLxBBPPKHgKdZe'),
            isTokenAutoRefreshEnabled: true
        });
        const auth = getAuth(app);
        await setPersistence(auth, browserLocalPersistence);
        const db = getFirestore(app);
        const functions = getFunctions(app);

        // --- Rate Limiting Helper ---
        const checkRateLimitFn = httpsCallable(functions, 'checkRateLimit');
        async function enforceRateLimit(action, identifier) {
            try {
                await checkRateLimitFn({ action, identifier });
                return true;
            } catch (error) {
                if (error.code === 'resource-exhausted') {
                    showToast(error.message, 'error');
                    return false;
                } else {
                    console.warn("Rate limit check bypassed due to error:", error);
                    return true;
                }
            }
        }

        // --- Theme Management ---
        const themeToggle = document.getElementById('themeToggle');
        const sunIcon = '<i class="fas fa-sun"></i>';
        const moonIcon = '<i class="fas fa-moon"></i>';

        function updateThemeIcon(isLight) {
            themeToggle.innerHTML = isLight ? sunIcon : moonIcon;
        }

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            updateThemeIcon(true);
        }

        themeToggle.addEventListener('click', () => {
            const isLight = document.body.classList.toggle('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            updateThemeIcon(isLight);
        });

        const CLOUDINARY_CLOUD_NAME = "dxsa93rr2";
        const CLOUDINARY_UPLOAD_PRESET = "DSU EXAM";

        let selectedPhotoFile = null;

        window.previewProfilePic = function (event) {
            const file = event.target.files[0];
            if (!file) return;

            if (file.size > 5 * 1024 * 1024) {
                showToast('Image size should be under 5MB', 'error');
                event.target.value = '';
                return;
            }

            selectedPhotoFile = file;
            const reader = new FileReader();
            reader.onload = function (e) {
                const preview = document.getElementById('avatarPreview');
                const placeholder = document.getElementById('avatarPlaceholder');
                const removeBtn = document.getElementById('avatarRemoveBtn');

                preview.src = e.target.result;
                preview.style.display = 'block';
                placeholder.style.display = 'none';
                if (removeBtn) removeBtn.style.display = 'inline-block';
            };
            reader.readAsDataURL(file);
        };

        window.removeProfilePic = function () {
            selectedPhotoFile = null;
            document.getElementById('profilePicInput').value = '';
            const preview = document.getElementById('avatarPreview');
            const placeholder = document.getElementById('avatarPlaceholder');
            const removeBtn = document.getElementById('avatarRemoveBtn');

            preview.src = '';
            preview.style.display = 'none';
            placeholder.style.display = 'block';
            if (removeBtn) removeBtn.style.display = 'none';
        };

        
        // College Selection Logic
        function fetchLocations() {
            const stateSelect = document.getElementById('state');
            if (window.INDIA_STATES_DATA) {
                Object.keys(window.INDIA_STATES_DATA).sort().forEach(state => {
                    const opt = document.createElement('option');
                    opt.value = state;
                    opt.textContent = state;
                    stateSelect.appendChild(opt); 
                });
                if(stateSelect.liquidSelect) stateSelect.liquidSelect.refreshOptions();
            } else {
                showToast("Failed to load states. Please refresh.", "error");
            }
        }
        
        window.populateDistricts = function() {
            const state = document.getElementById('state').value;
            const distSelect = document.getElementById('district');
            const colSelect = document.getElementById('collegeSelect');
            
            distSelect.innerHTML = '<option value="" disabled selected>Select District</option>';
            distSelect.disabled = true;
            if(distSelect.liquidSelect) distSelect.liquidSelect.refreshOptions();
            colSelect.innerHTML = '<option value="" disabled selected>Select College (choose District first)</option><option value="__other__">My college isn\'t listed</option>';
            colSelect.disabled = true;
            if(colSelect.liquidSelect) colSelect.liquidSelect.refreshOptions();
            document.getElementById('newCollegeWrap').style.display = 'none';
            
            if (state && window.INDIA_STATES_DATA && window.INDIA_STATES_DATA[state]) {
                window.INDIA_STATES_DATA[state].sort().forEach(dist => {
                    const opt = document.createElement('option');
                    opt.value = dist;
                    opt.textContent = dist;
                    distSelect.appendChild(opt);
                });
                distSelect.disabled = false; }
            if(distSelect.liquidSelect) distSelect.liquidSelect.refreshOptions();
        };
        
        

        window.populateColleges = function() {
            const state = document.getElementById('state').value;
            const district = document.getElementById('district').value;
            const colSelect = document.getElementById('collegeSelect');
            
            colSelect.innerHTML = '<option value="" disabled selected>Loading colleges...</option>';
            colSelect.disabled = true;
            if(colSelect.liquidSelect) colSelect.liquidSelect.refreshOptions();
            document.getElementById('newCollegeWrap').style.display = 'none';
            
            if (!state || !district) return;
            
            if (!window.ALL_COLLEGES_DATA) {
                showToast("Failed to load colleges", "error");
                return;
            }
            
            colSelect.innerHTML = '<option value="" disabled selected>Select College</option>';
            
            const districtColleges = (window.ALL_COLLEGES_DATA[state] && window.ALL_COLLEGES_DATA[state][district]) || [];
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
            if(colSelect.liquidSelect) colSelect.liquidSelect.refreshOptions();
        };
        
        window.toggleNewCollegeInput = function() {
            const colSelect = document.getElementById('collegeSelect');
            document.getElementById('newCollegeWrap').style.display = colSelect.value === '__other__' ? 'block' : 'none';
        };
        
        fetchLocations();

        
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
                    formData.append('folder', 'ExamPro-avatars');

                    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
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


                // 2. Now user is authenticated, check for duplicate register number or phone
                try {
                    const studentsRef = collection(db, 'students');
                    const [snapReg, snapPhone] = await Promise.all([
                        getDocs(query(studentsRef, where('registerNumber', '==', registerNumber))),
                        getDocs(query(studentsRef, where('phone', '==', phone)))
                    ]);

                    const isDuplicateReg = snapReg.docs.some(d => d.id !== cred.user.uid);
                    const isDuplicatePhone = snapPhone.docs.some(d => d.id !== cred.user.uid);

                    if (isDuplicateReg) {
                        await deleteUser(cred.user);
                        showToast('An account with this Register Number already exists.', 'error');
                        resetBtn();
                        return;
                    }
                    if (isDuplicatePhone) {
                        await deleteUser(cred.user);
                        showToast('An account with this Mobile Number already exists.', 'error');
                        resetBtn();
                        return;
                    }
                } catch (checkErr) {
                    console.warn('Duplicate check warning:', checkErr);
                    // Continue profile creation even if query check fails
                }

                // 3. Save student profile
                await setDoc(doc(db, 'students', cred.user.uid), {
                    uid: cred.user.uid,
                    name, email, registerNumber, phone, dob,
                    college, branch, department, section, year,
                    photoURL: photoURL || '',
                    role: 'student',
                    approvalStatus: 'pending', // Section 2: must be approved by admin before login
                    createdAt: serverTimestamp(),
                    lastLogin: serverTimestamp()
                });

                // 4. Write to studentLookup (Section 1.1 — public lookup, email only, no PII)
                //    This lets login.html resolve register number / phone to email
                //    without needing public read access on the full students collection.
                try {
                    await setDoc(doc(db, 'studentLookup', cred.user.uid), {
                        email: email.trim().toLowerCase(),
                        uid: cred.user.uid,
                        registerNumber: registerNumber || '',
                        usn: registerNumber || '',
                        phone: phone || '',
                        mobile: phone || '',
                        createdAt: serverTimestamp()
                    });
                } catch (lookupErr) {
                    console.warn('studentLookup write failed (non-critical):', lookupErr);
                }

                // 5. Notify admins of new registration
                try {
                    await addDoc(collection(db, 'notifications'), {
                        type: 'new_registration',
                        studentUID: cred.user.uid,
                        name, email, phone, department, registerNumber,
                        branch, section, year, college,
                        targetRole: 'admin',
                        approvalStatus: 'pending',
                        timestamp: serverTimestamp(),
                        read: false
                    });
                } catch (notifErr) {
                    console.error('Failed to write registration notification', notifErr);
                }

                showToast('✅ Account created! Waiting for admin approval...', 'success');
                setTimeout(() => {
                    document.body.innerHTML = `
                    <div style="min-height:100vh;background:#0a0a1a;display:flex;align-items:center;justify-content:center;font-family:'Inter',sans-serif;">
                        <div style="text-align:center;padding:48px 32px;max-width:480px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,.5);">
                            <div style="font-size:60px;margin-bottom:20px">⏳</div>
                            <h2 style="color:#e2e8f0;font-size:22px;margin-bottom:12px">Registration Submitted!</h2>
                            <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin-bottom:24px">
                                Your account has been created successfully.<br>
                                <strong style="color:#6c63ff">Admin approval is pending.</strong><br>
                                You'll receive an email once approved. This usually takes a few minutes.
                            </p>
                            <div style="background:rgba(108,99,255,.12);border:1px solid rgba(108,99,255,.3);border-radius:10px;padding:14px;margin-bottom:24px;font-size:13px;color:#a78bfa">
                                📧 Registered email: <strong>${email}</strong>
                            </div>
                            <a href="login.html" style="display:inline-block;padding:13px 32px;background:linear-gradient(135deg,#6c63ff,#4f46e5);color:#fff;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px">
                                Go to Login
                            </a>
                        </div>
                    </div>`;
                }, 1500);
            } catch (err) {
                console.error("Registration error:", err);
                let msg = err.message || 'Registration failed.';
                if (err.code === 'auth/email-already-in-use') msg = 'Email already registered. Please login.';
                else if (err.code === 'auth/weak-password') msg = 'Password too weak. Must be at least 8 characters.';
                else if (err.code === 'auth/invalid-email') msg = 'Invalid email address format.';
                else if (err.code === 'permission-denied') msg = 'Database permission error. Please publish firestore.rules.';
                showToast(msg, 'error');
                resetBtn();
            }

            function resetBtn() {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
            }
        };
    

        document.addEventListener('contextmenu', e => e.preventDefault());
        document.addEventListener('keydown', e => {
            if (e.key === 'F12') { e.preventDefault(); return false; }
            if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) { e.preventDefault(); return false; }
            if (e.ctrlKey && e.key === 'U') { e.preventDefault(); return false; }
        });

        let currentStep = 1;

                window.nextStep = function (step) {
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
            }
            document.getElementById(`step${step}`).classList.remove('active');
            document.getElementById(`step${step + 1}`).classList.add('active');
            
            document.getElementById(`prog-${step}`).classList.remove('active');
            document.getElementById(`prog-${step}`).classList.add('done');
            if (document.getElementById(`line-${step}`)) {
                document.getElementById(`line-${step}`).classList.add('done');
            }
            document.getElementById(`prog-${step + 1}`).classList.add('active');
            currentStep = step + 1;
        };

        window.prevStep = function (step) {
            document.getElementById(`step${step}`).classList.remove('active');
            document.getElementById(`step${step - 1}`).classList.add('active');
            
            document.getElementById(`prog-${step}`).classList.remove('active');
            document.getElementById(`prog-${step - 1}`).classList.remove('done');
            document.getElementById(`prog-${step - 1}`).classList.add('active');
            
            if (document.getElementById(`line-${step - 1}`)) {
                document.getElementById(`line-${step - 1}`).classList.remove('done');
            }
            currentStep = step - 1;
        };

        window.checkStrength = function (pw) {
            const bar = document.getElementById('strengthBar');
            const text = document.getElementById('strengthText');
            let strength = 0;
            if (pw.length >= 8) strength++;
            if (/[A-Z]/.test(pw)) strength++;
            if (/[0-9]/.test(pw)) strength++;
            if (/[^A-Za-z0-9]/.test(pw)) strength++;
            const levels = [
                { label: 'Very Weak', color: '#ef4444', width: '25%' },
                { label: 'Weak', color: '#f59e0b', width: '50%' },
                { label: 'Good', color: '#06b6d4', width: '75%' },
                { label: 'Strong', color: '#10b981', width: '100%' }
            ];
            const l = levels[strength - 1] || { label: '', color: 'rgba(255,255,255,.1)', width: '0%' };
            bar.style.background = l.color;
            bar.style.width = l.width;
            text.textContent = l.label;
            text.style.color = l.color;
        };

        function showToast(msg, type = 'info') {
            const container = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
            toast.innerHTML = `<i class="fas ${icons[type]}"></i> ${msg}`;
            container.appendChild(toast);
            setTimeout(() => toast.remove(), 3500);
        }
        window.showToast = showToast;
    

        document.addEventListener('DOMContentLoaded', () => {
            if(typeof LiquidSelect !== 'undefined') {
                new LiquidSelect('state', 'Select State', true);
                new LiquidSelect('district', 'Select District', true);
                new LiquidSelect('collegeSelect', 'Select College', true);
            }
        });
    
