// Theme Management

export class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.toggle = null;
    }

    initialize() {
        this.toggle = document.getElementById('theme-toggle');
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        
        if (this.toggle) {
            this.toggle.checked = savedTheme === 'dark';
            this.toggle.addEventListener('change', () => {
                this.setTheme(this.toggle.checked ? 'dark' : 'light');
            });
        }
    }

    setTheme(theme) {
        this.currentTheme = theme;
        
        if (theme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
        }
        
        localStorage.setItem('theme', theme);
        
        // Reapply background for theme
        const savedBg = localStorage.getItem('appBackground');
        if (savedBg) {
            document.body.style.background = savedBg;
            
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                if (theme === 'dark') {
                    mainContent.style.backgroundColor = 'rgba(17, 24, 39, 0.85)';
                } else {
                    mainContent.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
                }
            }
        }
    }

    getTheme() {
        return this.currentTheme;
    }

    toggleTheme() {
        this.setTheme(this.currentTheme === 'light' ? 'dark' : 'light');
    }
}

// Singleton instance
export const theme = new ThemeManager();

