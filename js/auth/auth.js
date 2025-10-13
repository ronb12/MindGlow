// Authentication Module

import { appState } from '../utils/state.js';
import { auth as firebaseAuth, db as firestore } from '../firebase-init.js';

export class AuthManager {
    constructor() {
        this.loginForm = null;
        this.signupForm = null;
        this.authSection = null;
        this.appContainer = null;
        this.logoutBtn = null;
        this.firebaseAuth = firebaseAuth;
        this.firestore = firestore;
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
        this.setupForgotPassword();
        this.checkExistingAuth(); // Check if user is already logged in
    }

    // Check for existing authentication on page load
    checkExistingAuth() {
        console.log('🔍 Checking for existing authentication...');
        
        // Keep both screens hidden until auth check completes
        this.authSection.classList.add('hidden');
        this.appContainer.classList.add('hidden');
        
        this.firebaseAuth.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                console.log('✅ User already logged in:', firebaseUser.email);
                
                try {
                    // Get user profile from Firestore
                    const userDoc = await this.firestore.collection('users').doc(firebaseUser.uid).get();
                    const userData = userDoc.data();
                    
                    const user = {
                        uid: firebaseUser.uid,
                        name: userData?.name || firebaseUser.email.split('@')[0],
                        email: firebaseUser.email
                    };
                    
                    appState.set('user', user);
                    
                    // Show app immediately (hide auth)
                    this.authSection.classList.add('hidden');
                    this.appContainer.classList.remove('hidden');
                    
                    // Update UI
                    const userNameElement = document.getElementById('user-name');
                    if (userNameElement) {
                        userNameElement.textContent = user.name;
                    }
                    
                    // Trigger dashboard initialization
                    window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: user }));
                    
                    console.log('✅ Auto-logged in from persisted session');
                } catch (error) {
                    console.error('Error loading user data:', error);
                    // Show login on error
                    this.authSection.classList.remove('hidden');
                    this.appContainer.classList.add('hidden');
                }
            } else {
                console.log('ℹ️  No existing session - showing login screen');
                // User not logged in, show auth screen
                this.authSection.classList.remove('hidden');
                this.appContainer.classList.add('hidden');
            }
        });
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
    
    setupForgotPassword() {
        const forgotLink = document.getElementById('forgot-password-link');
        const forgotModal = document.getElementById('forgot-password-modal');
        const forgotForm = document.getElementById('forgot-password-form');
        const closeBtn = forgotModal?.querySelector('.close');
        
        if (forgotLink) {
            forgotLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showForgotPasswordModal();
            });
        }
        
        if (forgotForm) {
            forgotForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('reset-email').value;
                this.sendPasswordReset(email);
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                forgotModal.classList.add('hidden');
                this.resetForgotPasswordForm();
            });
        }
        
        if (forgotModal) {
            forgotModal.addEventListener('click', (e) => {
                if (e.target === forgotModal) {
                    forgotModal.classList.add('hidden');
                    this.resetForgotPasswordForm();
                }
            });
        }
    }
    
    showForgotPasswordModal() {
        const modal = document.getElementById('forgot-password-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.getElementById('reset-email').focus();
        }
    }
    
    async sendPasswordReset(email) {
        const resetMessage = document.getElementById('reset-message');
        const submitBtn = document.querySelector('#forgot-password-form button');
        
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            // Send password reset email via Firebase Auth
            await this.firebaseAuth.sendPasswordResetEmail(email);
            
            // Show success message
            resetMessage.textContent = `✅ Password reset link sent to ${email}! Check your inbox.`;
            resetMessage.className = 'reset-message success';
            resetMessage.classList.remove('hidden');
            
            console.log(`✅ Password reset email sent to: ${email}`);
            
            // Auto-close modal after 3 seconds
            setTimeout(() => {
                document.getElementById('forgot-password-modal').classList.add('hidden');
                this.resetForgotPasswordForm();
            }, 3000);
            
        } catch (error) {
            console.error('Password reset error:', error);
            
            // Show error message
            let errorMsg = 'Failed to send reset email. ';
            if (error.code === 'auth/user-not-found') {
                errorMsg += 'No account found with this email.';
            } else if (error.code === 'auth/invalid-email') {
                errorMsg += 'Invalid email address.';
            } else {
                errorMsg += error.message;
            }
            
            resetMessage.textContent = `❌ ${errorMsg}`;
            resetMessage.className = 'reset-message error';
            resetMessage.classList.remove('hidden');
            
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Reset Link';
        }
    }
    
    resetForgotPasswordForm() {
        const form = document.getElementById('forgot-password-form');
        const resetMessage = document.getElementById('reset-message');
        const submitBtn = document.querySelector('#forgot-password-form button');
        
        if (form) form.reset();
        if (resetMessage) {
            resetMessage.classList.add('hidden');
            resetMessage.textContent = '';
        }
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Reset Link';
        }
    }
}

// Singleton instance
export const auth = new AuthManager();

