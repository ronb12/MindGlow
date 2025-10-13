// Navigation and Page Management

export class NavigationManager {
    constructor() {
        this.currentPage = 'dashboard';
        this.navItems = null;
        this.pages = null;
    }

    initialize() {
        this.navItems = document.querySelectorAll('.nav-item');
        this.pages = document.querySelectorAll('.page');
        
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                this.navigateTo(page);
            });
        });
    }

    navigateTo(pageName) {
        // Update nav items
        this.navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === pageName) {
                item.classList.add('active');
            }
        });

        // Update pages
        this.pages.forEach(page => {
            page.classList.remove('active');
        });
        
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageName;
            
            // Show/hide meditation controls based on page
            const bgControls = document.getElementById('bg-controls');
            if (bgControls) {
                if (pageName === 'meditate') {
                    bgControls.style.display = 'flex';
                } else {
                    bgControls.style.display = 'none';
                }
            }
        }
    }

    getCurrentPage() {
        return this.currentPage;
    }
}

// Singleton instance
export const navigation = new NavigationManager();

