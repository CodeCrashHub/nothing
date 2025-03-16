// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking a link
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
}

// Form submission handling
const contactForm = document.querySelector('#contact form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // You can add your form submission logic here
        console.log('Form submitted:', data);
        
        // Clear form
        contactForm.reset();
        alert('Thank you for your message! I will get back to you soon.');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize page content
    loadPage('home');
    
    // Server icon hover effects only (no click functionality)
    const serverIcons = document.querySelectorAll('.server-icon');
    
    serverIcons.forEach(icon => {
        // Add hover effects and animations
        icon.addEventListener('mouseenter', () => {
            icon.classList.add('hover-scale');
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.classList.remove('hover-scale');
        });
    });
    
    // Add tooltips to server icons
    const serverIconElements = document.querySelectorAll('.server-icon');
    
    serverIconElements.forEach(icon => {
        if (!icon.hasAttribute('data-tooltip')) {
            const iconElement = icon.querySelector('i');
            if (iconElement) {
                const tooltip = iconElement.className.split(' ')[1].replace('fa-', '');
                icon.setAttribute('data-tooltip', tooltip.charAt(0).toUpperCase() + tooltip.slice(1));
            }
        }
    });
    
    // User status toggle
    const userStatus = document.querySelector('.absolute.bottom-0.right-1');
    let statusIndex = 0;
    const statuses = [
        { class: 'bg-green-500', tooltip: 'Online' },
        { class: 'bg-yellow-500', tooltip: 'Idle' },
        { class: 'bg-red-500', tooltip: 'Do Not Disturb' },
        { class: 'bg-gray-700', tooltip: 'Invisible' }
    ];
    
    if (userStatus) {
        userStatus.addEventListener('click', () => {
            statusIndex = (statusIndex + 1) % statuses.length;
            
            // Remove all status classes
            userStatus.classList.remove('bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-gray-700');
            
            // Add new status class
            userStatus.classList.add(statuses[statusIndex].class);
            
            // Update status text
            const statusText = document.querySelector('.text-xs.text-gray-400');
            if (statusText) {
                statusText.textContent = statuses[statusIndex].tooltip;
            }
            
            // Update status badge in profile section
            const statusBadgeIndicator = document.querySelector('.flex.items-center.bg-discord-dark .w-2.h-2');
            const statusBadgeText = document.querySelector('.flex.items-center.bg-discord-dark .text-xs');
            
            if (statusBadgeIndicator && statusBadgeText) {
                statusBadgeIndicator.className = `w-2 h-2 rounded-full ${statuses[statusIndex].class} mr-2`;
                statusBadgeText.textContent = statuses[statusIndex].tooltip;
            }
        });
    }
    
    // Set initial active state in top navigation
    updateActiveNavLink('home');
    
    // Add click handlers to top navigation links
    const navLinks = document.querySelectorAll('.h-12.border-b a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            loadPage(page);
            updateActiveNavLink(page);
        });
    });
    
    // Add hover effects to social media icons
    const socialLinks = document.querySelectorAll('.space-y-2 a');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const iconElement = link.querySelector('i');
            if (iconElement) {
                iconElement.classList.add('text-white');
            }
        });
        
        link.addEventListener('mouseleave', () => {
            const iconElement = link.querySelector('i');
            if (iconElement) {
                iconElement.classList.remove('text-white');
                iconElement.classList.add('text-gray-300');
            }
        });
    });
    
    // Handle responsive layout
    window.addEventListener('resize', adjustLayout);
    adjustLayout(); // Initial adjustment
});

// Function to adjust layout based on screen size
function adjustLayout() {
    const width = window.innerWidth;
    
    // Add responsive classes based on screen width
    if (width < 768) {
        document.body.classList.add('mobile-view');
        // Ensure column widths are maintained
        enforceColumnWidths();
    } else if (width < 992) {
        document.body.classList.remove('mobile-view');
        document.body.classList.add('tablet-view');
        enforceColumnWidths();
    } else {
        document.body.classList.remove('mobile-view', 'tablet-view');
        enforceColumnWidths();
    }
}

// Function to enforce column widths
function enforceColumnWidths() {
    // This ensures the CSS !important rules are applied
    document.querySelectorAll('.w-\\[4\\.5\\%\\]').forEach(el => {
        el.style.width = ''; // Reset inline style to let CSS take over
    });
    
    document.querySelectorAll('.w-\\[18\\.93\\%\\]').forEach(el => {
        el.style.width = ''; // Reset inline style to let CSS take over
    });
    
    document.querySelectorAll('.w-\\[59\\.34\\%\\]').forEach(el => {
        el.style.width = ''; // Reset inline style to let CSS take over
    });
    
    document.querySelectorAll('.w-\\[17\\.22\\%\\]').forEach(el => {
        el.style.width = ''; // Reset inline style to let CSS take over
    });
}

// Function to update active navigation link
function updateActiveNavLink(page) {
    const navLinks = document.querySelectorAll('.h-12.border-b a');
    navLinks.forEach(link => {
        link.classList.remove('text-white', 'active');
        link.classList.add('text-gray-300');
        
        if (link.getAttribute('data-page') === page) {
            link.classList.remove('text-gray-300');
            link.classList.add('text-white', 'active');
        }
    });
}

// Function to load page content
function loadPage(page) {
    const contentArea = document.getElementById('content-area');
    
    // Show loading indicator
    contentArea.innerHTML = `
        <div class="flex items-center justify-center h-full">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-discord-blue"></div>
        </div>
    `;
    
    // Load page content from HTML file
    fetch(`pages/${page}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Page not found');
            }
            return response.text();
        })
        .then(html => {
            contentArea.innerHTML = html;
            contentArea.scrollTop = 0; // Scroll to top
        })
        .catch(error => {
            console.error('Error loading page:', error);
            contentArea.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full p-4">
                    <div class="text-4xl text-gray-600 mb-4">
                        <i class="fas fa-exclamation-circle"></i>
                    </div>
                    <h2 class="text-xl font-bold text-gray-300 mb-2">Page Not Found</h2>
                    <p class="text-gray-400">The page "${page}" could not be loaded.</p>
                </div>
            `;
        });
} 