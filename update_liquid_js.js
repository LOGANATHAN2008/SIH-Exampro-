const fs = require('fs');

let themeJs = fs.readFileSync('theme.js', 'utf8');

const newNavJs = `// 4. Inject Mobile Bottom Navigation (Liquid Glass Physics)
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
            // Let the pointerup event handle navigation to prevent conflict with dragging
            e.preventDefault();
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
        
        indicator.style.width = \`\${itemRect.width}px\`;
        indicator.style.transform = \`translateX(\${offsetLeft}px)\`;
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
        nav.style.transform = \`scale(0.98) translateX(\${barDragOffset}px)\`;
        
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
        
        indicator.style.transform = \`translateX(\${newIndicatorX}px)\`;
    });

    const handlePointerUp = (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        // Spring back the nav bar
        nav.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        nav.style.transform = \`scale(1) translateX(0px)\`;
        
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
            
            // Navigate if a new item is selected
            if (closestItem !== activeItemObj) {
                setTimeout(() => {
                    window.location.href = closestItem.getAttribute('href');
                }, 150); // slight delay to enjoy the snap animation
            }
        }
    };

    nav.addEventListener('pointerup', handlePointerUp);
    nav.addEventListener('pointercancel', handlePointerUp);
});`;

// Replace the block in theme.js
const regex = /\/\/ 4\. Inject Mobile Bottom Navigation[\s\S]*?document\.body\.appendChild\(nav\);\s*\n    \/\/ Function to update indicator[\s\S]*?\}\);\s*/m;
if (regex.test(themeJs)) {
    themeJs = themeJs.replace(regex, newNavJs + '\n');
    fs.writeFileSync('theme.js', themeJs, 'utf8');
    console.log("Successfully updated theme.js with Liquid Glass physics logic.");
} else {
    console.log("Could not find the navigation injection block in theme.js. Let me try a broader regex.");
    // Fallback regex
    const fallbackRegex = /\/\/ 4\. Inject Mobile Bottom Navigation[\s\S]*?window\.addEventListener\('DOMContentLoaded', \(\) => \{\s*const pages = \[/m;
    if (fallbackRegex.test(themeJs)) {
        themeJs = themeJs.replace(fallbackRegex, newNavJs + "\n\n// 5. Swipe Navigation (iOS style)\nwindow.addEventListener('DOMContentLoaded', () => {\n    const pages = [");
        fs.writeFileSync('theme.js', themeJs, 'utf8');
        console.log("Successfully updated theme.js using fallback regex.");
    } else {
        console.log("Fallback regex also failed.");
    }
}
