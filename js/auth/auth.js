// Authentication Module

import { appState } from '../utils/state.js';
import { auth, db } from '../firebase-init.js';

export class AuthManager {
    constructor() {
        this.loginForm = null;
        this.signupForm = null;
        this.authSection = null;
        this.appContainer = null;
        this.logoutBtn = null;
        this.firebaseAuth = auth;
        this.firestore = db;
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

    async login(email, password) {
        try {
            // Real Firebase Authentication
            const userCredential = await this.firebaseAuth.signInWithEmailAndPassword(email, password);
            const firebaseUser = userCredential.user;
            
            // Get user profile from Firestore
            const userDoc = await this.firestore.collection('users').doc(firebaseUser.uid).get();
            const userData = userDoc.data();
            
            const user = { 
                uid: firebaseUser.uid,
                name: userData?.name || email.split('@')[0], 
                email: firebaseUser.email
            };
            
            appState.set('user', user);
            this.showApp(user.name);
            
            console.log('✅ User logged in:', user.email);
            
            // Trigger dashboard initialization
            window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: user }));
        } catch (error) {
            console.error('Login error:', error);
            alert(`Login failed: ${error.message}`);
        }
    }

    async signup(name, email, password) {
        try {
            // Real Firebase Authentication
            const userCredential = await this.firebaseAuth.createUserWithEmailAndPassword(email, password);
            const firebaseUser = userCredential.user;
            
            // Create user profile in Firestore
            await this.firestore.collection('users').doc(firebaseUser.uid).set({
                name: name,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                wellnessScore: 0,
                totalMinutes: 0,
                streak: 0
            });
            
            const user = { 
                uid: firebaseUser.uid,
                name, 
                email 
            };
            
            appState.set('user', user);
            this.showApp(name);
            
            console.log('✅ User created:', user.email);
            
            // Trigger dashboard initialization
            window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: user }));
        } catch (error) {
            console.error('Signup error:', error);
            alert(`Signup failed: ${error.message}`);
        }
    }

    async logout() {
        try {
            await this.firebaseAuth.signOut();
            appState.set('user', null);
            this.appContainer.classList.add('hidden');
            this.authSection.classList.remove('hidden');
            console.log('✅ User logged out');
        } catch (error) {
            console.error('Logout error:', error);
        }
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

