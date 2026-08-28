const fs = require('fs');

function createPageFromDashboard(filename, title, newMainContent) {
    const html = fs.readFileSync('dashboard.html', 'utf8');
    
    // Replace title
    let result = html.replace(/<title>.*?<\/title>/, `<title>${title} | SkillBridge</title>`);
    
    // Find <main class="main" id="mainContent">
    const split1 = result.split('<main class="main" id="mainContent">');
    if(split1.length < 2) { console.error("Could not find main element"); return; }
    
    const preMain = split1[0] + '<main class="main" id="mainContent">\n';
    
    // End of main content... just look for </main>
    const split2 = result.split('</main>');
    if(split2.length < 2) { console.error("Could not find end of main element"); return; }
    
    // Since there could be other </main> inside, we take split2.pop() as everything after the last </main>
    const postMain = '\n    </main>' + split2.slice(1).join('</main>');
    
    const finalHtml = preMain + newMainContent + postMain;
    
    fs.writeFileSync(filename, finalHtml);
    console.log(`Created ${filename}`);
}

// 1. student-portfolio.html
const portfolioHTML = `
        <div class="header" style="margin-bottom: 24px;">
            <div>
                <h2 style="font-size: 24px; font-weight: 800;">Student Portfolio</h2>
                <p style="color: var(--text-muted); font-size: 14px;">Manage your skills, education, and resume</p>
            </div>
        </div>
        
        <div class="panel" style="margin-bottom: 20px;">
            <div class="panel-header" style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="font-size: 16px; font-weight: 700;">Skills</h3>
                <button class="btn-primary" onclick="addSkillModal()" style="padding: 8px 16px; border: none; border-radius: 8px; cursor: pointer; color: #fff; background: var(--primary);"><i class="fas fa-plus"></i> Add Skill</button>
            </div>
            <div id="skills-list" style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
                <p style="color:var(--text-muted); font-size:13px;">Loading skills...</p>
            </div>
        </div>
        
        <div class="panel" style="margin-bottom: 20px;">
            <div class="panel-header" style="margin-bottom: 16px;">
                <h3 style="font-size: 16px; font-weight: 700;">Education</h3>
            </div>
            <div class="form-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group"><label style="display:block; font-size:12px; color:var(--text-muted); margin-bottom:4px;">Degree</label><input type="text" id="eduDegree" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--glass-border); background:rgba(255,255,255,0.05); color:var(--text);" placeholder="e.g. B.Tech Computer Science"></div>
                <div class="form-group"><label style="display:block; font-size:12px; color:var(--text-muted); margin-bottom:4px;">Institution</label><input type="text" id="eduInstitution" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--glass-border); background:rgba(255,255,255,0.05); color:var(--text);" placeholder="e.g. DSU"></div>
                <div class="form-group"><label style="display:block; font-size:12px; color:var(--text-muted); margin-bottom:4px;">Graduation Year</label><input type="text" id="eduYear" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--glass-border); background:rgba(255,255,255,0.05); color:var(--text);" placeholder="e.g. 2025"></div>
                <div class="form-group"><label style="display:block; font-size:12px; color:var(--text-muted); margin-bottom:4px;">CGPA</label><input type="text" id="eduCgpa" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--glass-border); background:rgba(255,255,255,0.05); color:var(--text);" placeholder="e.g. 8.5"></div>
                <div class="form-group full" style="grid-column: 1 / -1;"><button onclick="saveEducation()" style="padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; color: #fff; background: var(--primary); font-weight: bold;">Save Education</button></div>
            </div>
        </div>
        
        <div class="panel" style="margin-bottom: 20px;">
            <div class="panel-header" style="margin-bottom: 16px;">
                <h3 style="font-size: 16px; font-weight: 700;">Resume & Links</h3>
            </div>
            <div class="form-grid" style="display: grid; grid-template-columns: 1fr; gap: 16px;">
                <div class="form-group">
                    <label style="display:block; font-size:12px; color:var(--text-muted); margin-bottom:4px;">Resume (PDF)</label>
                    <input type="file" id="resumeUpload" accept=".pdf" style="color:var(--text);" />
                    <button onclick="uploadResume()" style="margin-top: 10px; padding: 8px 16px; border: 1px solid var(--primary); border-radius: 8px; cursor: pointer; color: var(--primary); background: transparent;">Upload Resume</button>
                    <a id="resumeLink" href="#" target="_blank" style="display:none; color: var(--primary); margin-top: 10px; text-decoration: none; font-size: 13px;"><i class="fas fa-file-pdf"></i> View Current Resume</a>
                </div>
                <div class="form-group"><label style="display:block; font-size:12px; color:var(--text-muted); margin-bottom:4px;">GitHub</label><input type="text" id="linkGithub" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--glass-border); background:rgba(255,255,255,0.05); color:var(--text);" placeholder="https://github.com/..."></div>
                <div class="form-group"><label style="display:block; font-size:12px; color:var(--text-muted); margin-bottom:4px;">LinkedIn</label><input type="text" id="linkLinkedin" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--glass-border); background:rgba(255,255,255,0.05); color:var(--text);" placeholder="https://linkedin.com/in/..."></div>
                <div class="form-group"><button onclick="saveLinks()" style="padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; color: #fff; background: var(--primary); font-weight: bold;">Save Links</button></div>
            </div>
        </div>
        
        <script type="module">
            import { db, doc, getDoc, updateDoc, SKILL_LEVELS, auth, COMMON_SKILLS } from "./js/skillbridge-config.js";
            import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
            
            const storage = getStorage();
            
            window.addSkillModal = function() {
                const skill = prompt("Enter skill name (e.g. React, Python):");
                if (!skill) return;
                const level = prompt("Enter level 1-5 (1=Beginner, 5=Expert):", "3");
                if (!level || isNaN(level)) return;
                
                const user = auth.currentUser;
                if(!user) return window.showToast('Please login first', 'error');
                
                const docRef = doc(db, 'studentProfiles', user.uid);
                getDoc(docRef).then(snap => {
                    if(snap.exists()) {
                        const skills = snap.data().skills || [];
                        skills.push({ name: skill, level: parseInt(level), verifiedBy: null, verifiedAt: null });
                        updateDoc(docRef, { skills }).then(() => {
                            window.showToast('Skill added!', 'success');
                            loadPortfolio(user.uid);
                        });
                    }
                });
            };
            
            window.saveEducation = function() {
                const user = auth.currentUser;
                if(!user) return;
                updateDoc(doc(db, 'studentProfiles', user.uid), {
                    education: {
                        degree: document.getElementById('eduDegree').value,
                        institution: document.getElementById('eduInstitution').value,
                        year: document.getElementById('eduYear').value,
                        cgpa: document.getElementById('eduCgpa').value
                    }
                }).then(() => window.showToast('Education saved', 'success'));
            };
            
            window.saveLinks = function() {
                const user = auth.currentUser;
                if(!user) return;
                updateDoc(doc(db, 'studentProfiles', user.uid), {
                    portfolioLinks: {
                        github: document.getElementById('linkGithub').value,
                        linkedin: document.getElementById('linkLinkedin').value
                    }
                }).then(() => window.showToast('Links saved', 'success'));
            };
            
            window.uploadResume = async function() {
                const fileInput = document.getElementById('resumeUpload');
                if(!fileInput.files.length) return window.showToast('Select a file first', 'error');
                
                const file = fileInput.files[0];
                const user = auth.currentUser;
                if(!user) return;
                
                const storageRef = ref(storage, \`resumes/\${user.uid}/resume.pdf\`);
                try {
                    window.showToast('Uploading...', 'info');
                    await uploadBytes(storageRef, file);
                    const url = await getDownloadURL(storageRef);
                    await updateDoc(doc(db, 'studentProfiles', user.uid), { resumeUrl: url });
                    window.showToast('Resume uploaded!', 'success');
                    document.getElementById('resumeLink').href = url;
                    document.getElementById('resumeLink').style.display = 'block';
                } catch(e) {
                    console.error(e);
                    window.showToast('Upload failed', 'error');
                }
            };
            
            window.loadPortfolio = async function(uid) {
                const snap = await getDoc(doc(db, 'studentProfiles', uid));
                if(snap.exists()) {
                    const data = snap.data();
                    
                    if(data.education) {
                        document.getElementById('eduDegree').value = data.education.degree || '';
                        document.getElementById('eduInstitution').value = data.education.institution || '';
                        document.getElementById('eduYear').value = data.education.year || '';
                        document.getElementById('eduCgpa').value = data.education.cgpa || '';
                    }
                    
                    if(data.portfolioLinks) {
                        document.getElementById('linkGithub').value = data.portfolioLinks.github || '';
                        document.getElementById('linkLinkedin').value = data.portfolioLinks.linkedin || '';
                    }
                    
                    if(data.resumeUrl) {
                        document.getElementById('resumeLink').href = data.resumeUrl;
                        document.getElementById('resumeLink').style.display = 'block';
                    }
                    
                    const skillsDiv = document.getElementById('skills-list');
                    skillsDiv.innerHTML = '';
                    if (!data.skills || data.skills.length === 0) {
                         skillsDiv.innerHTML = '<p style="color:var(--text-muted); font-size:13px;">No skills added yet.</p>';
                    } else {
                        data.skills.forEach(s => {
                            const badge = s.verifiedBy ? \`<span style="color: #10b981; font-size: 12px; margin-left: 6px;" title="Verified"><i class="fas fa-check-circle"></i></span>\` : '';
                            skillsDiv.innerHTML += \`<div style="background: rgba(255,255,255,0.05); padding: 8px 14px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); color: var(--text); font-size: 13px; display:flex; align-items:center;">\${s.name} (Lvl \${s.level}) \${badge}</div>\`;
                        });
                    }
                }
            };
            
            setTimeout(() => {
                auth.onAuthStateChanged(user => {
                    if(user) window.loadPortfolio(user.uid);
                });
            }, 1000);
        </script>
`;
createPageFromDashboard('student-portfolio.html', 'Student Portfolio', portfolioHTML);

// 2. browse-internships.html
const browseHTML = `
        <div class="header" style="margin-bottom: 24px;">
            <div>
                <h2 style="font-size: 24px; font-weight: 800;">Browse Internships & Jobs</h2>
                <p style="color: var(--text-muted); font-size: 14px;">Find opportunities that match your skills</p>
            </div>
        </div>
        
        <div id="listings-container" style="display: flex; flex-direction: column; gap: 20px;">
            <p style="color:var(--text-muted)">Loading listings...</p>
        </div>
        
        <script type="module">
            import { db, collection, query, where, getDocs, addDoc, serverTimestamp, auth } from "./js/skillbridge-config.js";
            
            window.applyListing = async function(listingId) {
                const user = auth.currentUser;
                if(!user) return window.showToast('Please login', 'error');
                
                try {
                    window.showToast('Applying...', 'info');
                    await addDoc(collection(db, 'applications'), {
                        listingId: listingId,
                        studentUid: user.uid,
                        industryUid: 'to_be_injected', // We will inject this later or use a cloud function
                        status: 'applied',
                        matchScore: null,
                        appliedAt: serverTimestamp()
                    });
                    window.showToast('Successfully applied!', 'success');
                    setTimeout(() => window.location.href = 'my-applications.html', 1500);
                } catch(e) {
                    console.error(e);
                    window.showToast('Failed to apply', 'error');
                }
            };
            
            async function loadListings() {
                // Fetch all listings for now to show something
                const q = query(collection(db, 'listings'));
                const snap = await getDocs(q);
                const container = document.getElementById('listings-container');
                container.innerHTML = '';
                
                if(snap.empty) {
                    container.innerHTML = '<div class="panel" style="text-align:center; padding: 40px; color:var(--text-muted)">No listings available right now.</div>';
                    return;
                }
                
                snap.forEach(doc => {
                    const data = doc.data();
                    container.innerHTML += \`
                        <div class="panel" style="padding: 24px;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                <div>
                                    <h3 style="font-size: 18px; margin-bottom: 6px;">\${data.title}</h3>
                                    <p style="color: var(--primary); font-weight: 600; font-size: 14px; margin-bottom: 12px;">\${data.type || 'Internship'} • \${data.location || 'Remote'}</p>
                                </div>
                                <div style="background: rgba(16,185,129,0.1); color: #10b981; padding: 6px 12px; border-radius: 12px; font-weight: bold; font-size: 13px;">
                                    Match: Pending
                                </div>
                            </div>
                            <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 16px; line-height: 1.5;">\${data.description}</p>
                            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
                                \${(data.requiredSkills || []).map(s => \`<span style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 12px; font-size: 12px;">\${s}</span>\`).join('')}
                            </div>
                            <button onclick="applyListing('\${doc.id}')" style="padding: 10px 24px; border: none; border-radius: 8px; cursor: pointer; color: #fff; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); font-weight: bold; font-size: 14px;">Apply Now</button>
                        </div>
                    \`;
                });
            }
            
            setTimeout(() => loadListings(), 1000);
        </script>
`;
createPageFromDashboard('browse-internships.html', 'Browse Internships', browseHTML);

// 3. my-applications.html
const myAppsHTML = `
        <div class="header" style="margin-bottom: 24px;">
            <div>
                <h2 style="font-size: 24px; font-weight: 800;">My Applications</h2>
                <p style="color: var(--text-muted); font-size: 14px;">Track the status of your internship and job applications</p>
            </div>
        </div>
        
        <div class="panel" style="padding: 0; overflow: hidden;">
            <table style="width: 100%; text-align: left; border-collapse: collapse;">
                <thead style="background: rgba(255,255,255,0.02);">
                    <tr>
                        <th style="padding: 16px; color: var(--text-muted); font-size: 12px; text-transform: uppercase; border-bottom: 1px solid var(--glass-border);">Listing</th>
                        <th style="padding: 16px; color: var(--text-muted); font-size: 12px; text-transform: uppercase; border-bottom: 1px solid var(--glass-border);">Match Score</th>
                        <th style="padding: 16px; color: var(--text-muted); font-size: 12px; text-transform: uppercase; border-bottom: 1px solid var(--glass-border);">Status</th>
                        <th style="padding: 16px; color: var(--text-muted); font-size: 12px; text-transform: uppercase; border-bottom: 1px solid var(--glass-border);">Applied On</th>
                    </tr>
                </thead>
                <tbody id="apps-tbody">
                    <tr><td colspan="4" style="padding: 30px; text-align: center; color: var(--text-muted);">Loading...</td></tr>
                </tbody>
            </table>
        </div>
        
        <script type="module">
            import { db, collection, query, where, getDocs, auth } from "./js/skillbridge-config.js";
            
            async function loadApps(uid) {
                const q = query(collection(db, 'applications'), where('studentUid', '==', uid));
                const snap = await getDocs(q);
                const tbody = document.getElementById('apps-tbody');
                tbody.innerHTML = '';
                
                if(snap.empty) {
                    tbody.innerHTML = '<tr><td colspan="4" style="padding: 30px; text-align: center; color: var(--text-muted);">No applications yet.</td></tr>';
                    return;
                }
                
                snap.forEach(doc => {
                    const data = doc.data();
                    const date = data.appliedAt ? data.appliedAt.toDate().toLocaleDateString() : 'Just now';
                    const score = data.matchScore ? \`\${data.matchScore}% - \${data.matchReason}\` : '<span style="color:var(--text-muted)">Pending engine</span>';
                    
                    let statusColor = 'var(--text-muted)';
                    if(data.status === 'shortlisted') statusColor = 'var(--primary)';
                    if(data.status === 'selected') statusColor = '#10b981';
                    if(data.status === 'rejected') statusColor = '#ef4444';
                    
                    tbody.innerHTML += \`
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 16px; font-weight: 500;">Listing ID: \${data.listingId.substring(0,8)}</td>
                            <td style="padding: 16px; font-size: 13px;">\${score}</td>
                            <td style="padding: 16px; color: \${statusColor}; font-weight: 700; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">\${data.status}</td>
                            <td style="padding: 16px; color: var(--text-muted); font-size: 13px;">\${date}</td>
                        </tr>
                    \`;
                });
            }
            
            setTimeout(() => {
                auth.onAuthStateChanged(user => {
                    if(user) loadApps(user.uid);
                });
            }, 1000);
        </script>
`;
createPageFromDashboard('my-applications.html', 'My Applications', myAppsHTML);
