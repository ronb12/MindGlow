// Wellness Tracking Feature Module

import { appState } from '../utils/state.js';
import { updateProgress, showNotification } from '../utils/helpers.js';

export class WellnessFeature {
    constructor() {}

    initialize() {
        this.setupMoodTracker();
        this.setupStressMonitor();
        this.setupHabitTracker();
        this.setupWaterTracker();
        this.setupSleepTracker();
        this.setupScreenTime();
        this.renderHabits();
        this.renderWaterGlasses();
    }

    setupMoodTracker() {
        const moodBtns = document.querySelectorAll('.mood-btn');
        moodBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const mood = btn.dataset.mood;
                this.logMood(mood);
            });
        });
    }

    setupStressMonitor() {
        const stressSlider = document.getElementById('stress-level');
        const stressValue = document.getElementById('stress-value');
        
        if (stressSlider && stressValue) {
            stressSlider.addEventListener('input', () => {
                stressValue.textContent = stressSlider.value;
            });
        }
    }

    setupHabitTracker() {
        const addHabitBtn = document.getElementById('add-habit');
        if (addHabitBtn) {
            addHabitBtn.addEventListener('click', () => this.addHabit());
        }
    }

    setupWaterTracker() {
        const addWaterBtn = document.getElementById('add-water');
        if (addWaterBtn) {
            addWaterBtn.addEventListener('click', () => this.addWater());
        }
    }

    setupSleepTracker() {
        const logSleepBtn = document.getElementById('log-sleep');
        if (logSleepBtn) {
            logSleepBtn.addEventListener('click', () => this.logSleep());
        }
    }

    setupScreenTime() {
        const logScreenTimeBtn = document.getElementById('log-screen-time');
        if (logScreenTimeBtn) {
            logScreenTimeBtn.addEventListener('click', () => this.logScreenTime());
        }
    }

    logMood(mood) {
        const state = appState.getState();
        appState.updateState({
            mood: [...state.mood, { mood, date: new Date().toISOString() }],
            wellnessScore: state.wellnessScore + 2
        });
        showNotification(`Mood logged: ${mood}`);
        window.dispatchEvent(new Event('statsUpdated'));
    }

    addHabit() {
        const habitName = prompt('Enter habit name:');
        if (habitName) {
            const state = appState.getState();
            appState.updateState({
                habits: [...state.habits, { name: habitName, completed: false }]
            });
            this.renderHabits();
        }
    }

    renderHabits() {
        const habitsList = document.getElementById('habits-list');
        if (!habitsList) return;
        
        const state = appState.getState();
        
        habitsList.innerHTML = state.habits.map((habit, index) => `
            <div class="habit-item">
                <input type="checkbox" id="habit-${index}" ${habit.completed ? 'checked' : ''}>
                <label for="habit-${index}">${habit.name}</label>
            </div>
        `).join('');
        
        habitsList.querySelectorAll('input[type="checkbox"]').forEach((checkbox, index) => {
            checkbox.addEventListener('change', () => {
                const habits = [...state.habits];
                habits[index].completed = checkbox.checked;
                appState.set('habits', habits);
                this.updateHabitsProgress();
            });
        });
        
        this.updateHabitsProgress();
    }

    updateHabitsProgress() {
        const state = appState.getState();
        const completed = state.habits.filter(h => h.completed).length;
        const total = state.habits.length || 1;
        
        const element = document.getElementById('habits-done');
        if (element) element.textContent = completed;
        
        updateProgress('habits-progress', completed, total);
    }

    addWater() {
        const state = appState.getState();
        const newIntake = Math.min(state.waterIntake + 1, 8);
        appState.set('waterIntake', newIntake);
        
        this.renderWaterGlasses();
        this.updateWaterProgress();
    }

    renderWaterGlasses() {
        const container = document.getElementById('water-glasses');
        if (!container) return;
        
        const state = appState.getState();
        
        container.innerHTML = Array(8).fill(0).map((_, i) => 
            `<i class="fas fa-glass-whiskey water-glass ${i < state.waterIntake ? 'filled' : ''}"></i>`
        ).join('');
    }

    updateWaterProgress() {
        const state = appState.getState();
        const element = document.getElementById('water-done');
        if (element) element.textContent = state.waterIntake;
        
        updateProgress('water-progress', state.waterIntake, 8);
    }

    logSleep() {
        const hoursInput = document.getElementById('sleep-hours');
        const qualityInput = document.getElementById('sleep-quality');
        
        if (!hoursInput || !qualityInput) return;
        
        const hours = parseFloat(hoursInput.value);
        const quality = parseInt(qualityInput.value);
        
        if (hours && quality) {
            const state = appState.getState();
            appState.updateState({
                sessionHistory: [
                    ...state.sessionHistory,
                    {
                        type: 'sleep',
                        hours,
                        quality,
                        date: new Date().toISOString()
                    }
                ],
                wellnessScore: state.wellnessScore + 5
            });
            
            showNotification(`Sleep logged: ${hours}h, Quality: ${quality}/10`);
            window.dispatchEvent(new Event('statsUpdated'));
        }
    }

    logScreenTime() {
        const time = prompt('Enter screen time (hours):');
        if (time) {
            const element = document.getElementById('screen-time');
            if (element) element.textContent = `${time}h 0m`;
        }
    }
}

// Singleton instance
export const wellness = new WellnessFeature();

