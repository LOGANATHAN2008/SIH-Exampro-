// theme.js - Global Theme Logic

// 1. Immediately apply the theme to the <html> tag to prevent flash of unstyled content (FOUC)
(function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-mode');
    }
})();

// 2. Global Toggle Function
window.toggleTheme = function() {
    const htmlElement = document.documentElement;
    const body = document.body;
    let btnIcons = document.querySelectorAll('#themeToggleBtn i, .mobile-theme-toggle i');
    
    if (htmlElement.classList.contains('light-mode')) {
        // Switch to Dark
        htmlElement.classList.remove('light-mode');
        if (body) body.classList.remove('light-mode'); // for safety if any script uses body
        
        btnIcons.forEach(btnIcon => {
            btnIcon.className = 'fas fa-moon';
            btnIcon.style.color = '#6c63ff'; 
        });
        localStorage.setItem('theme', 'dark');
    } else {
        // Switch to Light
        htmlElement.classList.add('light-mode');
        if (body) body.classList.add('light-mode'); // for safety if any script uses body
        
        btnIcons.forEach(btnIcon => {
            btnIcon.className = 'fas fa-sun';
            btnIcon.style.color = '#f59e0b'; 
        });
        localStorage.setItem('theme', 'light');
    }
};

// 3. Update the icon correctly once the DOM loads
window.addEventListener('DOMContentLoaded', () => {
    // Keep body in sync just in case
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }

    const btnIcons = document.querySelectorAll('#themeToggleBtn i, .mobile-theme-toggle i');
    btnIcons.forEach(btnIcon => {
        if (savedTheme === 'light') {
            btnIcon.className = 'fas fa-sun';
            btnIcon.style.color = '#f59e0b';
        } else {
            btnIcon.className = 'fas fa-moon';
            btnIcon.style.color = '#6c63ff';
        }
    });
});

// 4. Inject Mobile Bottom Navigation (Liquid Glass Physics)
window.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.mobile-bottom-nav')) return;

    const navItems = [
        { name: 'Home', icon: 'fa-home', url: 'dashboard.html' },
        { name: 'Learning', icon: 'fa-book-open', url: 'materials.html' },
        { name: 'Assignments', icon: 'fa-clipboard-list', url: 'test.html' },
        { name: 'Progress', icon: 'fa-chart-bar', url: 'result.html' },
        { name: 'Profile', icon: 'fa-user', url: 'profile.html' }
    ];
    
    let currentPage = window.location.pathname.split('/').pop();
    if (!currentPage) currentPage = 'dashboard.html';
    
    if (['', 'index.html', 'about.html', 'login.html', 'register.html', 'admin.html', 'faculty.html', 'chats.html'].includes(currentPage.split('?')[0])) return;
    
    const nav = document.createElement('nav');
    nav.className = 'mobile-bottom-nav';

    const indicator = document.createElement('div');
    indicator.className = 'nav-indicator';
    nav.appendChild(indicator);

    let activeItemObj = null;
    let itemElements = [];

    navItems.forEach(item => {
        const a = document.createElement('a');
        a.href = item.url;
        a.className = 'nav-item';
        
        if (currentPage === item.url || (currentPage === '' && item.url === 'dashboard.html')) {
            a.classList.add('active');
            activeItemObj = a;
        }

        a.addEventListener('click', (e) => {
            // Only prevent native click if the user actually dragged/scrubbed
            if (hasMoved) {
                e.preventDefault();
            }
        });

        let iconHtml = '<i class="fas ' + item.icon + '"></i>';
        if (item.name === 'Profile') {
            const userPhoto = localStorage.getItem('userPhoto');
            if (userPhoto) {
                iconHtml = '<img src="' + userPhoto + '" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover; margin-bottom: 2px;">';
            }
        }

        a.innerHTML = iconHtml + '<span class="nav-text">' + item.name + '</span>';
        nav.appendChild(a);
        itemElements.push(a);
    });

    document.body.appendChild(nav);

    // Physics & Interaction Logic
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let startIndicatorX = 0;
    let startIndicatorWidth = 0;
    let navRect = null;
    let hasMoved = false;

    function updateIndicator(targetItem, animate = true) {
        if (!targetItem || !indicator) return;
        navRect = nav.getBoundingClientRect();
        const itemRect = targetItem.getBoundingClientRect();
        const offsetLeft = itemRect.left - navRect.left;
        
        if (animate) {
            indicator.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        } else {
            indicator.style.transition = 'none';
        }
        
        indicator.style.width = `${itemRect.width}px`;
        indicator.style.transform = `translateX(${offsetLeft}px)`;
    }

    // Initial position
    setTimeout(() => {
        if (!activeItemObj && itemElements.length > 0) activeItemObj = itemElements[0];
        updateIndicator(activeItemObj, false);
    }, 50);
    window.addEventListener('resize', () => updateIndicator(document.querySelector('.mobile-bottom-nav .nav-item.active'), false));

    // Pointer Events for Drag & Elasticity
    nav.addEventListener('pointerdown', (e) => {
        isDragging = true;
        hasMoved = false;
        startX = e.clientX;
        navRect = nav.getBoundingClientRect();
        
        const activeItem = document.querySelector('.mobile-bottom-nav .nav-item.active');
        if (activeItem) {
            const itemRect = activeItem.getBoundingClientRect();
            startIndicatorX = itemRect.left - navRect.left;
            startIndicatorWidth = itemRect.width;
        }

        nav.style.transition = 'none';
        indicator.style.transition = 'none';
        nav.setPointerCapture(e.pointerId);
        
        // Slight scale down on press for tactile feel
        nav.style.transform = 'scale(0.98)';
    });

    nav.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        currentX = e.clientX;
        let dx = currentX - startX;
        
        if (Math.abs(dx) > 5) hasMoved = true;

        // Elastic drag on the bar itself (resistance factor 0.15)
        let barDragOffset = dx * 0.15;
        nav.style.transform = `scale(0.98) translateX(${barDragOffset}px)`;
        
        // Move indicator to follow pointer
        let newIndicatorX = startIndicatorX + dx;
        
        // Clamp indicator within nav bounds with elastic overscroll
        const minX = 0;
        const maxX = navRect.width - startIndicatorWidth;
        
        if (newIndicatorX < minX) {
            newIndicatorX = minX - Math.pow(Math.abs(newIndicatorX - minX), 0.7); // Elastic left
        } else if (newIndicatorX > maxX) {
            newIndicatorX = maxX + Math.pow(Math.abs(newIndicatorX - maxX), 0.7); // Elastic right
        }
        
        indicator.style.transform = `translateX(${newIndicatorX}px)`;
    });

    const handlePointerUp = (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        // Spring back the nav bar
        nav.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        nav.style.transform = `scale(1) translateX(0px)`;
        
        // Find closest item to snap indicator
        let closestItem = null;
        let minDistance = Infinity;
        let indicatorRect = indicator.getBoundingClientRect();
        let indicatorCenterX = indicatorRect.left + indicatorRect.width / 2;

        itemElements.forEach(item => {
            let itemRect = item.getBoundingClientRect();
            let itemCenterX = itemRect.left + itemRect.width / 2;
            let dist = Math.abs(indicatorCenterX - itemCenterX);
            if (dist < minDistance) {
                minDistance = dist;
                closestItem = item;
            }
        });

        // If it was just a tap (didn't drag much), snap to the tapped item
        if (!hasMoved) {
            let tappedItem = e.target.closest('.nav-item');
            if (tappedItem) closestItem = tappedItem;
        }

        if (closestItem) {
            itemElements.forEach(el => el.classList.remove('active'));
            closestItem.classList.add('active');
            updateIndicator(closestItem, true);
            
            // Navigate manually ONLY if they scrubbed to a new item (otherwise native click handles it)
            if (hasMoved && closestItem !== activeItemObj) {
                setTimeout(() => {
                    window.location.href = closestItem.getAttribute('href');
                }, 150);
            }
        }
    };

    nav.addEventListener('pointerup', handlePointerUp);
    nav.addEventListener('pointercancel', handlePointerUp);
});
// 6. Staggered Sidebar Animation Delays (Fast 15ms waterfall)
window.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.sidebar .nav-label, .sidebar .nav-item, .sidebar-user');
    animateElements.forEach((el, index) => {
        el.style.animationDelay = (index * 0.015) + 's';
    });
});

// 7. Staggered Card Delays (Ultra Snappy micro-delays)
const cardObserver = new MutationObserver((mutations) => {
    let addedCards = [];
    mutations.forEach(m => {
        m.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
                if (node.matches && node.matches('.stat-card, .course-card, .test-card, .chart-card, .history-card, .review-card, .dsh-card, .result-hero, .stats-row, .material-card')) {
                    addedCards.push(node);
                }
                if (node.querySelectorAll) {
                    const children = node.querySelectorAll('.stat-card, .course-card, .test-card, .chart-card, .history-card, .review-card, .dsh-card, .result-hero, .stats-row, .material-card');
                    children.forEach(c => addedCards.push(c));
                }
            }
        });
    });
    
    if (addedCards.length > 0) {
        addedCards.forEach((card, index) => {
            card.style.animationDelay = (Math.min(index * 0.025, 0.12)) + 's';
        });
    }
});

if (document.body) {
    cardObserver.observe(document.body, { childList: true, subtree: true });
} else {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.body) cardObserver.observe(document.body, { childList: true, subtree: true });
    });
}

// Static elements already in DOM
window.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.stat-card, .course-card, .test-card, .chart-card, .history-card, .review-card, .dsh-card, .result-hero, .stats-row, .material-card');
    cards.forEach((card, index) => {
        if (!card.style.animationDelay) {
            card.style.animationDelay = (Math.min(index * 0.025, 0.12)) + 's';
        }
    });
});

// Mark app as loaded
window.addEventListener('load', () => {
    sessionStorage.setItem('appLoaded', 'true');
});

// Global iOS Alert Override
window.alert = function(msg) {
    const overlay = document.createElement('div');
    overlay.className = 'ios-alert-overlay';
    
    const textHtml = String(msg).replace(/\n/g, '<br>');

    overlay.innerHTML = `
        <div class="ios-alert-box">
            <div class="ios-alert-title">Exam Erp says</div>
            <div class="ios-alert-message">${textHtml}</div>
            <div class="ios-alert-buttons">
                <button class="ios-alert-btn" onclick="this.closest('.ios-alert-overlay').remove()">OK</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
};

// --- Global Notification Sound ---
window.playNotification = function() {
    let audio = document.getElementById('globalNotificationAudio');
    if (!audio) {
        audio = document.createElement('audio');
        audio.id = 'globalNotificationAudio';
        audio.src = 'notification.mp3';
        document.body.appendChild(audio);
    }
    audio.currentTime = 0;
    audio.play().catch(e => console.log('Audio play blocked:', e));
};
