// Community Feature Module

import { appState } from '../utils/state.js';

export class CommunityFeature {
    constructor() {}

    initialize() {
        this.setupFriends();
        this.setupSharing();
        this.renderFriends();
        this.renderGroupSessions();
        this.updateChallenge();
    }

    setupFriends() {
        const addFriendBtn = document.getElementById('add-friend');
        if (addFriendBtn) {
            addFriendBtn.addEventListener('click', () => this.addFriend());
        }
    }

    setupSharing() {
        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareProgress());
        }
    }

    addFriend() {
        const email = prompt('Enter friend\'s email:');
        if (email) {
            const state = appState.getState();
            appState.set('friends', [
                ...state.friends,
                { name: email, status: 'pending' }
            ]);
            this.renderFriends();
        }
    }

    renderFriends() {
        const list = document.getElementById('friends-list');
        if (!list) return;
        
        const state = appState.getState();
        list.innerHTML = state.friends.map(friend => `
            <div class="friend-card">
                <i class="fas fa-user-circle"></i>
                <p>${friend.name}</p>
            </div>
        `).join('');
    }

    renderGroupSessions() {
        const sessions = [
            { title: "Morning Meditation", time: "8:00 AM", participants: 12 },
            { title: "Evening Wind Down", time: "7:00 PM", participants: 8 },
            { title: "Weekend Deep Dive", time: "10:00 AM Sat", participants: 15 }
        ];
        
        const list = document.getElementById('group-sessions');
        if (!list) return;
        
        list.innerHTML = sessions.map(session => `
            <div class="session-card">
                <div>
                    <h4>${session.title}</h4>
                    <p>${session.time} • ${session.participants} participants</p>
                </div>
                <button class="btn-primary">Join</button>
            </div>
        `).join('');
    }

    updateChallenge() {
        const state = appState.getState();
        const progress = (state.streak / 7) * 100;
        
        const progressBar = document.getElementById('challenge-progress');
        const doneElement = document.getElementById('challenge-done');
        
        if (progressBar) {
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }
        
        if (doneElement) {
            doneElement.textContent = Math.min(state.streak, 7);
        }
    }

    shareProgress() {
        const text = document.getElementById('share-text').value;
        if (text) {
            const state = appState.getState();
            const feed = document.getElementById('community-feed');
            
            if (feed) {
                const post = document.createElement('div');
                post.className = 'feed-post';
                post.innerHTML = `
                    <div class="author">${state.user.name}</div>
                    <p>${text}</p>
                    <div class="date">${new Date().toLocaleString()}</div>
                `;
                feed.insertBefore(post, feed.firstChild);
            }
            
            document.getElementById('share-text').value = '';
        }
    }
}

// Singleton instance
export const community = new CommunityFeature();

