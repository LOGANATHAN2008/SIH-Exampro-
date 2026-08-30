
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
    