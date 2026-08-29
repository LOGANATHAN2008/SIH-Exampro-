const fs = require('fs');

const content = fs.readFileSync('register.html', 'utf8');

const newBody = `<body>
    <div class="bg-animation"></div>
    
    <div class="register-container" style="max-width: 600px; margin: 40px auto; padding: 20px;">
        <div class="logo-area">
            <div class="logo-icon" style="background: transparent;">
                <img src="exam_erp_logo.png" alt="Logo" style="height: 100%; width: auto;">
            </div>
            <h1>SkillBridge</h1>
            <p>Join the Academia-Industry Portal</p>
        </div>

        <div class="card">
            <div id="role-selection">
                <h2 style="margin-bottom: 20px;">Select Your Role</h2>
                
                <div class="form-grid" style="grid-template-columns: 1fr; gap: 16px;">
                    <button class="btn-outline" style="padding: 16px; text-align: left; display: flex; flex-direction: column;" onclick="selectRole('student')">
                        <span style="font-size: 16px; font-weight: bold; color: var(--primary); margin-bottom: 4px;">👨‍🎓 Student</span>
                        <span style="color: var(--text-muted); font-size: 12px; font-weight: 400;">Build portfolio, find internships, get skills verified.</span>
                    </button>
                    <button class="btn-outline" style="padding: 16px; text-align: left; display: flex; flex-direction: column;" onclick="selectRole('industry')">
                        <span style="font-size: 16px; font-weight: bold; color: var(--primary); margin-bottom: 4px;">🏢 Industry</span>
                        <span style="color: var(--text-muted); font-size: 12px; font-weight: 400;">Post internships, find verified talent.</span>
                    </button>
                    <button class="btn-outline" style="padding: 16px; text-align: left; display: flex; flex-direction: column;" onclick="selectRole('academician')">
                        <span style="font-size: 16px; font-weight: bold; color: var(--primary); margin-bottom: 4px;">🏫 Academician</span>
                        <span style="color: var(--text-muted); font-size: 12px; font-weight: 400;">Verify student skills, view industry demand.</span>
                    </button>
                </div>
                
                <div class="switch-link">
                    <p>Already have an account? <a href="login.html">Login here</a></p>
                </div>
            </div>

            <form id="registration-form" style="display: none;" onsubmit="handleRegister(event)">
                <div class="step-header">
                    <button type="button" onclick="backToRoles()" style="background: none; border: none; color: var(--primary); cursor: pointer; font-size: 14px; margin-bottom: 10px; text-align: left;"><i class="fas fa-arrow-left"></i> Back to roles</button>
                    <h3 id="form-title" style="margin-top: 10px;">Registration</h3>
                </div>
                
                <input type="hidden" id="selectedRole" name="role" value="" />
                
                <!-- Common Fields -->
                <div class="form-grid" style="margin-bottom: 16px;">
                    <div class="form-group full">
                        <label>Full Name</label>
                        <div class="input-wrap">
                            <i class="fas fa-user icon"></i>
                            <input type="text" id="name" placeholder="Enter your full name" required />
                        </div>
                    </div>
                    <div class="form-group full">
                        <label>Email Address</label>
                        <div class="input-wrap">
                            <i class="fas fa-envelope icon"></i>
                            <input type="email" id="email" placeholder="Enter your email" required />
                        </div>
                    </div>
                    <div class="form-group full">
                        <label>Password</label>
                        <div class="input-wrap">
                            <i class="fas fa-lock icon"></i>
                            <input type="password" id="password" placeholder="Create a strong password" required />
                        </div>
                    </div>
                </div>

                <!-- Student Specific -->
                <div id="student-fields" class="form-grid" style="display: none; margin-bottom: 16px;">
                    <div class="form-group">
                        <label>Register Number</label>
                        <div class="input-wrap">
                            <i class="fas fa-id-card icon"></i>
                            <input type="text" id="registerNumber" placeholder="e.g. ENG20CS001" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Department</label>
                        <div class="input-wrap">
                            <i class="fas fa-building icon"></i>
                            <select id="department">
                                <option value="">Select Department</option>
                                <option value="CSE">Computer Science</option>
                                <option value="ECE">Electronics</option>
                                <option value="BCA">BCA</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Industry Specific -->
                <div id="industry-fields" class="form-grid" style="display: none; margin-bottom: 16px;">
                    <div class="form-group full">
                        <label>Company Name</label>
                        <div class="input-wrap">
                            <i class="fas fa-building icon"></i>
                            <input type="text" id="companyName" placeholder="Enter company name" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Industry Type</label>
                        <div class="input-wrap">
                            <i class="fas fa-briefcase icon"></i>
                            <select id="industryType">
                                <option value="IT / Software">IT / Software</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Finance">Finance</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Contact Person</label>
                        <div class="input-wrap">
                            <i class="fas fa-user-tie icon"></i>
                            <input type="text" id="contactPerson" placeholder="Your designation/name" />
                        </div>
                    </div>
                </div>

                <!-- Academician Specific -->
                <div id="academician-fields" class="form-grid" style="display: none; margin-bottom: 16px;">
                    <div class="form-group full">
                        <label>Institution</label>
                        <div class="input-wrap">
                            <i class="fas fa-university icon"></i>
                            <input type="text" id="institution" placeholder="Enter university/college name" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Department</label>
                        <div class="input-wrap">
                            <i class="fas fa-building icon"></i>
                            <input type="text" id="acadDepartment" placeholder="e.g. CSE" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Designation</label>
                        <div class="input-wrap">
                            <i class="fas fa-chalkboard-teacher icon"></i>
                            <input type="text" id="designation" placeholder="e.g. Professor" />
                        </div>
                    </div>
                </div>

                <button type="submit" class="btn-primary" id="registerBtn">
                    <i class="fas fa-user-plus"></i> Create Account
                </button>
            </form>
        </div>
    </div>
    <div id="toastContainer" class="toast-container"></div>
    
    <script type="module">
        import { auth, db, doc, setDoc, serverTimestamp } from "./js/skillbridge-config.js";
        import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

        window.selectRole = function(role) {
            document.getElementById('role-selection').style.display = 'none';
            document.getElementById('registration-form').style.display = 'block';
            document.getElementById('selectedRole').value = role;
            
            document.getElementById('student-fields').style.display = role === 'student' ? 'grid' : 'none';
            document.getElementById('industry-fields').style.display = role === 'industry' ? 'grid' : 'none';
            document.getElementById('academician-fields').style.display = role === 'academician' ? 'grid' : 'none';
            
            const titles = {
                student: 'Student Registration',
                industry: 'Industry Partner Registration',
                academician: 'Academician Registration'
            };
            document.getElementById('form-title').innerText = titles[role];
        };

        window.backToRoles = function() {
            document.getElementById('role-selection').style.display = 'block';
            document.getElementById('registration-form').style.display = 'none';
        };

        window.showToast = function(msg, type = 'info') {
            const container = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = \`toast \${type}\`;
            const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
            toast.innerHTML = \`<i class="fas \${icons[type]}"></i> \${msg}\`;
            container.appendChild(toast);
            setTimeout(() => toast.remove(), 3500);
        };

        window.handleRegister = async function(e) {
            e.preventDefault();
            const btn = document.getElementById('registerBtn');
            const role = document.getElementById('selectedRole').value;
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const name = document.getElementById('name').value.trim();
            
            btn.disabled = true;
            btn.innerHTML = 'Creating Account...';

            try {
                const cred = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(cred.user, { displayName: name });

                // Common user doc
                await setDoc(doc(db, 'users', cred.user.uid), {
                    role: role,
                    name: name,
                    email: email,
                    createdAt: serverTimestamp(),
                    profileComplete: true
                });

                // Role-specific doc
                if (role === 'student') {
                    await setDoc(doc(db, 'studentProfiles', cred.user.uid), {
                        registerNumber: document.getElementById('registerNumber').value.trim(),
                        department: document.getElementById('department').value,
                        skills: [],
                        education: '',
                        resumeUrl: '',
                        portfolioLinks: '',
                        bio: ''
                    });
                } else if (role === 'industry') {
                    await setDoc(doc(db, 'industryProfiles', cred.user.uid), {
                        companyName: document.getElementById('companyName').value.trim(),
                        industryType: document.getElementById('industryType').value,
                        contactPerson: document.getElementById('contactPerson').value.trim(),
                        verified: false
                    });
                } else if (role === 'academician') {
                    await setDoc(doc(db, 'academicianProfiles', cred.user.uid), {
                        institution: document.getElementById('institution').value.trim(),
                        department: document.getElementById('acadDepartment').value.trim(),
                        designation: document.getElementById('designation').value.trim()
                    });
                }

                showToast('✅ Account created successfully!', 'success');
                setTimeout(() => { window.location.href = 'login.html'; }, 1500);
            } catch (err) {
                console.error("Registration error:", err);
                showToast(err.message || 'Registration failed.', 'error');
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
            }
        };
    </script>
</body>`;

const newContent = content.replace(/<body>[\s\S]*<\/body>/, newBody);
fs.writeFileSync('register.html', newContent);
console.log('register.html updated successfully with Node.js');
