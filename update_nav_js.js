const fs = require('fs');

let themeJs = fs.readFileSync('theme.js', 'utf8');

const newNavJs = `// 4. Inject Mobile Bottom Navigation
window.addEventListener('DOMContentLoaded', () => {
    // Only inject if not already present
    if (document.querySelector('.mobile-bottom-nav')) return;

    // Define the navigation items
    const navItems = [
        { name: 'Home', icon: 'fa-home', url: 'dashboard.html' },
        { name: 'Courses', icon: 'fa-book-open', url: 'materials.html' },
        { name: 'Tests', icon: 'fa-clipboard-list', url: 'test.html' },
        { name: 'Results', icon: 'fa-chart-bar', url: 'result.html' },
        { name: 'Profile', icon: 'fa-user', url: 'profile.html' }
    ];
    
    // Determine current page index
    let currentPage = window.location.pathname.split('/').pop();
    if (!currentPage) currentPage = 'dashboard.html';
    
    // Do not inject navigation on authentication or standalone full-screen apps (like chats)
    if (['', 'index.html', 'about.html', 'login.html', 'register.html', 'admin.html', 'faculty.html', 'chats.html'].includes(currentPage.split('?')[0])) return;
    
    // Background Page Prefetching for Ultra-Fast Instant Transitions
    const prefetchPages = ['dashboard.html', 'materials.html', 'test.html', 'result.html', 'profile.html'];
    prefetchPages.forEach(p => {
        if (p !== currentPage) {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = p;
            document.head.appendChild(link);
        }
    });

    const nav = document.createElement('nav');
    nav.className = 'mobile-bottom-nav';

    // Inject sliding indicator
    const indicator = document.createElement('div');
    indicator.className = 'nav-indicator';
    nav.appendChild(indicator);

    navItems.forEach(item => {
        const a = document.createElement('a');
        a.href = item.url;
        a.className = 'nav-item';
        
        // Mark active if matches current page
        if (currentPage === item.url || (currentPage === '' && item.url === 'dashboard.html')) {
            a.classList.add('active');
        }

        // Instant visual active state on tap (0ms latency response)
        a.addEventListener('click', (e) => {
            // We don't prevent default, we want it to navigate, but we can instantly animate
            document.querySelectorAll('.mobile-bottom-nav .nav-item').forEach(el => el.classList.remove('active'));
            a.classList.add('active');
            updateIndicator();
        });

        let iconHtml = '<i class="fas ' + item.icon + '"></i>';
        if (item.name === 'Profile') {
            const userPhoto = localStorage.getItem('userPhoto');
            if (userPhoto) {
                iconHtml = '<img src="' + userPhoto + '" style="width: 20px; height: 20px; border-radius: 50%; object-fit: cover; margin-bottom: 2px;">';
            }
        }

        a.innerHTML = iconHtml + '<span class="nav-text">' + item.name + '</span>';
        nav.appendChild(a);
    });

    document.body.appendChild(nav);

    // Function to update indicator position and width
    function updateIndicator() {
        const activeItem = document.querySelector('.mobile-bottom-nav .nav-item.active');
        if (activeItem && indicator) {
            const navRect = nav.getBoundingClientRect();
            const itemRect = activeItem.getBoundingClientRect();
            // Calculate relative to the nav container
            const offsetLeft = itemRect.left - navRect.left;
            indicator.style.width = \`\${itemRect.width}px\`;
            indicator.style.transform = \`translateX(\${offsetLeft}px)\`;
        }
    }

    // Initial position
    setTimeout(updateIndicator, 50);
    window.addEventListener('resize', updateIndicator);
});`;

// Replace the block in theme.js
const regex = /\/\/ 4\. Inject Mobile Bottom Navigation[\s\S]*?document\.body\.appendChild\(nav\);\s*\n\}\);/m;
if (regex.test(themeJs)) {
    themeJs = themeJs.replace(regex, newNavJs);
    fs.writeFileSync('theme.js', themeJs, 'utf8');
    console.log("Successfully updated theme.js with glassmorphism nav logic.");
} else {
    console.log("Could not find the navigation injection block in theme.js.");
}
