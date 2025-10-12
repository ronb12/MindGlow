// Journal Feature Module

import { appState } from '../utils/state.js';
import { getRandomAffirmation } from '../data/affirmations.js';
import { formatDate, showNotification } from '../utils/helpers.js';

export class JournalFeature {
    constructor() {}

    initialize() {
        this.setupTabs();
        this.setupGratitude();
        this.setupAffirmations();
        this.setupNotes();
        this.showRandomAffirmation();
    }

    setupTabs() {
        const journalTabs = document.querySelectorAll('.journal-tab');
        journalTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                journalTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                document.querySelectorAll('.journal-tab-content').forEach(content => {
                    content.classList.add('hidden');
                });
                document.getElementById(`${tab.dataset.tab}-tab`).classList.remove('hidden');
            });
        });
    }

    setupGratitude() {
        const saveBtn = document.getElementById('save-gratitude');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveGratitude());
        }
    }

    setupAffirmations() {
        const newBtn = document.getElementById('new-affirmation');
        const addBtn = document.getElementById('add-affirmation');
        
        if (newBtn) {
            newBtn.addEventListener('click', () => this.showRandomAffirmation());
        }
        
        if (addBtn) {
            addBtn.addEventListener('click', () => this.addCustomAffirmation());
        }
    }

    setupNotes() {
        const saveBtn = document.getElementById('save-note');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveNote());
        }
    }

    saveGratitude() {
        const entry = document.getElementById('gratitude-entry').value;
        if (entry) {
            const state = appState.getState();
            appState.updateState({
                journalEntries: [
                    ...state.journalEntries,
                    { type: 'gratitude', entry, date: new Date().toISOString() }
                ],
                wellnessScore: state.wellnessScore + 3
            });
            
            document.getElementById('gratitude-entry').value = '';
            this.renderGratitudeHistory();
            window.dispatchEvent(new Event('statsUpdated'));
        }
    }

    renderGratitudeHistory() {
        const history = document.getElementById('gratitude-history');
        if (!history) return;
        
        const state = appState.getState();
        const entries = state.journalEntries
            .filter(e => e.type === 'gratitude')
            .reverse()
            .slice(0, 5);
        
        history.innerHTML = entries.map(entry => `
            <div class="journal-entry">
                <div class="date">${formatDate(entry.date)}</div>
                <p>${entry.entry}</p>
            </div>
        `).join('');
    }

    showRandomAffirmation() {
        const state = appState.getState();
        const affirmation = getRandomAffirmation(state.customAffirmations);
        
        const display = document.getElementById('affirmation-display');
        if (display) {
            display.textContent = affirmation;
        }
    }

    addCustomAffirmation() {
        const input = document.getElementById('custom-affirmation');
        const affirmation = input.value;
        
        if (affirmation) {
            const state = appState.getState();
            appState.set('customAffirmations', [...state.customAffirmations, affirmation]);
            input.value = '';
            this.renderMyAffirmations();
        }
    }

    renderMyAffirmations() {
        const list = document.getElementById('my-affirmations');
        if (!list) return;
        
        const state = appState.getState();
        list.innerHTML = state.customAffirmations.map(aff => `
            <div class="affirmation-item">
                <span>${aff}</span>
            </div>
        `).join('');
    }

    saveNote() {
        const entry = document.getElementById('note-entry').value;
        if (entry) {
            const state = appState.getState();
            appState.set('notes', [
                ...state.notes,
                { entry, date: new Date().toISOString() }
            ]);
            
            document.getElementById('note-entry').value = '';
            this.renderNotesHistory();
        }
    }

    renderNotesHistory() {
        const history = document.getElementById('notes-history');
        if (!history) return;
        
        const state = appState.getState();
        const notes = state.notes.reverse().slice(0, 5);
        
        history.innerHTML = notes.map(note => `
            <div class="journal-entry">
                <div class="date">${formatDate(note.date)}</div>
                <p>${note.entry}</p>
            </div>
        `).join('');
    }
}

// Singleton instance
export const journal = new JournalFeature();

