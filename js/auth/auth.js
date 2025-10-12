// Authentication Module

import { appState } from '../utils/state.js';

export class AuthManager {
    constructor() {
        this.loginForm = null;
        this.signupForm = null;
        this.authSection = null;
        this.appContainer = null;
        this.logoutBtn = null;
    }

    initialize() {
        this.loginForm = document.getElementById('login-form');
        this.signupForm = document.getElementById('signup-form');
        this.authSection = document.getElementById('auth-section');
        this.appContainer = document.getElementById('app-container');
        this.logoutBtn = document.getElementById('logout-btn');

        this.setupAuthTabs();
        this.setupForms();
        this.setupLogout();
    }

    setupAuthTabs() {
        const authTabs = document.querySelectorAll('.auth-tab');
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                authTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const tabName = tab.dataset.tab;
                if (tabName === 'login') {
                    this.loginForm.classList.remove('hidden');
                    this.signupForm.classList.add('hidden');
                } else {
                    this.loginForm.classList.add('hidden');
                    this.signupForm.classList.remove('hidden');
                }
            });
        });
    }

    setupForms() {
        this.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            this.login(email, password);
        });

        this.signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            this.signup(name, email, password);
        });
    }

    setupLogout() {
        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    login(email, password) {
        // Simulated login (replace with real Firebase Auth later)
        const user = { 
            name: email.split('@')[0], 
            email 
        };
        
        appState.set('user', user);
        this.showApp(user.name);
        
        // Trigger dashboard initialization
        window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: user }));
    }

    signup(name, email, password) {
        // Simulated signup (replace with real Firebase Auth later)
        const user = { name, email };
        
        appState.set('user', user);
        this.showApp(name);
        
        // Trigger dashboard initialization
        window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: user }));
    }

    logout() {
        appState.set('user', null);
        this.appContainer.classList.add('hidden');
        this.authSection.classList.remove('hidden');
    }

    showApp(userName) {
        this.authSection.classList.add('hidden');
        this.appContainer.classList.remove('hidden');
        
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = userName;
        }
    }
}

// Singleton instance
export const auth = new AuthManager();

