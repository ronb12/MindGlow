// MindGlow - Wellness & Meditation App
// A product of Bradley Virtual Solutions, LLC

// Firebase Configuration (will be set up later)
let firebaseConfig = null;
let auth = null;
let db = null;

// App State
const appState = {
    user: null,
    currentPage: 'dashboard',
    theme: 'light',
    streak: 0,
    totalMinutes: 0,
    badges: 0,
    wellnessScore: 0,
    meditationGoal: 20,
    waterIntake: 0,
    habits: [],
    mood: [],
    affirmations: [],
    journalEntries: [],
    notes: [],
    friends: [],
    sessionHistory: [],
    customAffirmations: []
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('auth-section').classList.remove('hidden');
    }, 2000);

    initializeAuth();
    initializeNavigation();
    initializeTheme();
    initializeFeatures();
});

// Feature 1: User Authentication
function initializeAuth() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const authTabs = document.querySelectorAll('.auth-tab');

    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const tabName = tab.dataset.tab;
            if (tabName === 'login') {
                loginForm.classList.remove('hidden');
                signupForm.classList.add('hidden');
            } else {
                loginForm.classList.add('hidden');
                signupForm.classList.remove('hidden');
            }
        });
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        login(email, password);
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        signup(name, email, password);
    });

    document.getElementById('logout-btn').addEventListener('click', logout);
}

function login(email, password) {
    // Simulated login
    appState.user = { name: email.split('@')[0], email };
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');
    document.getElementById('user-name').textContent = appState.user.name;
    initializeDashboard();
}

function signup(name, email, password) {
    // Simulated signup
    appState.user = { name, email };
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');
    document.getElementById('user-name').textContent = name;
    initializeDashboard();
}

function logout() {
    appState.user = null;
    document.getElementById('app-container').classList.add('hidden');
    document.getElementById('auth-section').classList.remove('hidden');
}

// Navigation
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            navigateToPage(page);
        });
    });
}

function navigateToPage(pageName) {
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) {
            item.classList.add('active');
        }
    });

    // Update pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(`${pageName}-page`).classList.add('active');
    appState.currentPage = pageName;
}

// Feature 43: Dark/Light Theme
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    
    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    appState.theme = savedTheme;
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    }

    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            document.body.setAttribute('data-theme', 'dark');
            appState.theme = 'dark';
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
            appState.theme = 'light';
            localStorage.setItem('theme', 'light');
        }
    });
}

// Initialize All Features
function initializeFeatures() {
    initializeQuickActions();
    initializeMeditation();
    initializeBreathing();
    initializeWellness();
    initializeJournal();
    initializeCommunity();
    initializeLibrary();
    initializeSettings();
    initializePomodoro();
}

// Feature 39: Quote of the Day
const quotes = [
    { text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", author: "Thich Nhat Hanh" },
    { text: "Meditation is not about stopping thoughts, but recognizing that we are more than our thoughts and our feelings.", author: "Arianna Huffington" },
    { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
    { text: "The mind is everything. What you think you become.", author: "Buddha" },
    { text: "Wherever you are, be all there.", author: "Jim Elliot" },
    { text: "Your calm mind is the ultimate weapon against your challenges.", author: "Bryant McGill" },
    { text: "In the midst of movement and chaos, keep stillness inside of you.", author: "Deepak Chopra" }
];

function initializeDashboard() {
    // Display daily quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('daily-quote').textContent = randomQuote.text;
    document.getElementById('quote-author').textContent = `- ${randomQuote.author}`;

    // Load stats
    loadStats();
    
    // Initialize water glasses
    renderWaterGlasses();
    
    // Initialize habits
    renderHabits();
}

// Feature 12: Streak Counter & Statistics
function loadStats() {
    document.getElementById('streak-count').textContent = appState.streak;
    document.getElementById('total-minutes').textContent = appState.totalMinutes;
    document.getElementById('badges-earned').textContent = appState.badges;
    document.getElementById('wellness-score').textContent = appState.wellnessScore;
}

// Quick Actions
function initializeQuickActions() {
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('click', () => {
            const action = card.dataset.action;
            handleQuickAction(action);
        });
    });
}

function handleQuickAction(action) {
    switch(action) {
        case 'quick-meditate':
            navigateToPage('meditate');
            startMeditationSession(5);
            break;
        case 'breathing':
            navigateToPage('breathe');
            break;
        case 'mood-check':
            navigateToPage('wellness');
            break;
        case 'sleep-story':
            navigateToPage('meditate');
            break;
    }
}

// Feature 2-5: Meditation Sessions, Sleep Stories, Ambient Soundscapes
const meditationSessions = [
    { id: 1, title: "Morning Awakening", category: "guided", duration: 10, description: "Start your day with clarity and intention" },
    { id: 2, title: "Stress Relief", category: "stress", duration: 15, description: "Release tension and find peace" },
    { id: 3, title: "Deep Sleep", category: "sleep", duration: 30, description: "Drift into restful sleep" },
    { id: 4, title: "Focus Boost", category: "focus", duration: 12, description: "Enhance concentration and productivity" },
    { id: 5, title: "Chakra Balance", category: "chakra", duration: 20, description: "Align your energy centers" },
    { id: 6, title: "Loving-Kindness", category: "guided", duration: 15, description: "Cultivate compassion and love" },
    { id: 7, title: "Body Scan", category: "guided", duration: 18, description: "Progressive relaxation technique" },
    { id: 8, title: "Anxiety Relief", category: "stress", duration: 10, description: "Calm anxious thoughts" },
    { id: 9, title: "Sleep Story: Forest", category: "sleep", duration: 25, description: "Journey through peaceful woods" },
    { id: 10, title: "Visualization", category: "guided", duration: 14, description: "Create your perfect sanctuary" }
];

const ambientSounds = [
    { id: 1, name: "Rain", icon: "cloud-rain" },
    { id: 2, name: "Ocean", icon: "water" },
    { id: 3, name: "Forest", icon: "tree" },
    { id: 4, name: "Birds", icon: "dove" },
    { id: 5, name: "Wind", icon: "wind" },
    { id: 6, name: "Fire", icon: "fire" },
    { id: 7, name: "Stream", icon: "tint" },
    { id: 8, name: "Thunder", icon: "bolt" }
];

function initializeMeditation() {
    renderMeditationSessions('all');
    renderAmbientSounds();
    initializeMeditationTimer();
    
    // Category filtering
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderMeditationSessions(btn.dataset.category);
        });
    });
}

function renderMeditationSessions(category) {
    const grid = document.getElementById('meditation-grid');
    const filtered = category === 'all' ? meditationSessions : meditationSessions.filter(s => s.category === category);
    
    grid.innerHTML = filtered.map(session => `
        <div class="meditation-card" data-id="${session.id}">
            <h4>${session.title}</h4>
            <p>${session.description}</p>
            <p class="duration"><i class="fas fa-clock"></i> ${session.duration} min</p>
        </div>
    `).join('');
    
    // Add click handlers
    grid.querySelectorAll('.meditation-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = parseInt(card.dataset.id);
            const session = meditationSessions.find(s => s.id === id);
            startMeditationSession(session.duration);
        });
    });
}

// Feature 5: Ambient Soundscapes & Nature Sounds
function renderAmbientSounds() {
    const grid = document.getElementById('sounds-grid');
    grid.innerHTML = ambientSounds.map(sound => `
        <div class="sound-card" data-id="${sound.id}">
            <i class="fas fa-${sound.icon}"></i>
            <p>${sound.name}</p>
        </div>
    `).join('');
    
    grid.querySelectorAll('.sound-card').forEach(card => {
        card.addEventListener('click', () => {
            grid.querySelectorAll('.sound-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });
}

// Feature 10: Meditation Timer
let meditationTimer = null;
function initializeMeditationTimer() {
    const timerBtns = document.querySelectorAll('.timer-btn');
    const startBtn = document.getElementById('start-timer');
    let selectedTime = 10;
    
    timerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedTime = parseInt(btn.dataset.time);
            document.getElementById('timer-minutes').textContent = selectedTime;
            document.getElementById('timer-seconds').textContent = '00';
        });
    });
    
    startBtn.addEventListener('click', () => {
        startMeditationSession(selectedTime);
    });
}

function startMeditationSession(minutes) {
    let seconds = minutes * 60;
    const timerDisplay = document.querySelector('.timer-display');
    
    if (meditationTimer) clearInterval(meditationTimer);
    
    meditationTimer = setInterval(() => {
        seconds--;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        
        document.getElementById('timer-minutes').textContent = mins.toString().padStart(2, '0');
        document.getElementById('timer-seconds').textContent = secs.toString().padStart(2, '0');
        
        if (seconds <= 0) {
            clearInterval(meditationTimer);
            completeMeditationSession(minutes);
        }
    }, 1000);
}

function completeMeditationSession(minutes) {
    appState.totalMinutes += minutes;
    appState.streak++;
    appState.wellnessScore += 10;
    
    // Update progress
    const current = parseInt(document.getElementById('meditation-done').textContent);
    document.getElementById('meditation-done').textContent = current + minutes;
    updateProgress('meditation-progress', current + minutes, appState.meditationGoal);
    
    // Save to history
    appState.sessionHistory.push({
        type: 'meditation',
        duration: minutes,
        date: new Date().toISOString()
    });
    
    loadStats();
    checkBadges();
    alert('Meditation session complete! 🎉');
}

// Feature 3: Breathing Exercises (Box, 4-7-8, Calm)
function initializeBreathing() {
    const exerciseCards = document.querySelectorAll('.exercise-card button');
    exerciseCards.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.exercise-card');
            const exercise = card.dataset.exercise;
            startBreathingExercise(exercise);
        });
    });
    
    document.getElementById('stop-breathing').addEventListener('click', () => {
        document.getElementById('breathing-visualizer').classList.add('hidden');
    });
}

function startBreathingExercise(type) {
    const visualizer = document.getElementById('breathing-visualizer');
    const instruction = visualizer.querySelector('.breath-instruction');
    visualizer.classList.remove('hidden');
    
    const patterns = {
        'box': [['Inhale', 4], ['Hold', 4], ['Exhale', 4], ['Hold', 4]],
        '478': [['Inhale', 4], ['Hold', 7], ['Exhale', 8]],
        'calm': [['Inhale', 4], ['Exhale', 6]]
    };
    
    let step = 0;
    const pattern = patterns[type];
    
    function runPattern() {
        const [action, duration] = pattern[step];
        instruction.textContent = action;
        
        setTimeout(() => {
            step = (step + 1) % pattern.length;
            if (!visualizer.classList.contains('hidden')) {
                runPattern();
            }
        }, duration * 1000);
    }
    
    runPattern();
}

// Feature 6: Mood Tracking
function initializeWellness() {
    // Mood tracker
    const moodBtns = document.querySelectorAll('.mood-btn');
    moodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mood = btn.dataset.mood;
            logMood(mood);
        });
    });
    
    // Stress monitor
    const stressSlider = document.getElementById('stress-level');
    const stressValue = document.getElementById('stress-value');
    stressSlider.addEventListener('input', () => {
        stressValue.textContent = stressSlider.value;
    });
    
    // Habit tracker
    document.getElementById('add-habit').addEventListener('click', addHabit);
    
    // Water intake
    document.getElementById('add-water').addEventListener('click', addWater);
    
    // Sleep tracking
    document.getElementById('log-sleep').addEventListener('click', logSleep);
    
    // Screen time
    document.getElementById('log-screen-time').addEventListener('click', logScreenTime);
    
    renderHabits();
}

function logMood(mood) {
    appState.mood.push({ mood, date: new Date().toISOString() });
    alert(`Mood logged: ${mood}`);
    appState.wellnessScore += 2;
    loadStats();
}

// Feature 30: Habit Tracker
function addHabit() {
    const habitName = prompt('Enter habit name:');
    if (habitName) {
        appState.habits.push({ name: habitName, completed: false });
        renderHabits();
    }
}

function renderHabits() {
    const habitsList = document.getElementById('habits-list');
    if (!habitsList) return;
    
    habitsList.innerHTML = appState.habits.map((habit, index) => `
        <div class="habit-item">
            <input type="checkbox" id="habit-${index}" ${habit.completed ? 'checked' : ''}>
            <label for="habit-${index}">${habit.name}</label>
        </div>
    `).join('');
    
    habitsList.querySelectorAll('input[type="checkbox"]').forEach((checkbox, index) => {
        checkbox.addEventListener('change', () => {
            appState.habits[index].completed = checkbox.checked;
            updateHabitsProgress();
        });
    });
    
    updateHabitsProgress();
}

function updateHabitsProgress() {
    const completed = appState.habits.filter(h => h.completed).length;
    const total = appState.habits.length || 1;
    document.getElementById('habits-done').textContent = completed;
    updateProgress('habits-progress', completed, total);
}

// Feature 27: Water Intake Tracker
function addWater() {
    appState.waterIntake++;
    renderWaterGlasses();
    updateWaterProgress();
}

function renderWaterGlasses() {
    const container = document.getElementById('water-glasses');
    if (!container) return;
    
    container.innerHTML = Array(8).fill(0).map((_, i) => 
        `<i class="fas fa-glass-whiskey water-glass ${i < appState.waterIntake ? 'filled' : ''}"></i>`
    ).join('');
}

function updateWaterProgress() {
    document.getElementById('water-done').textContent = appState.waterIntake;
    updateProgress('water-progress', appState.waterIntake, 8);
}

// Feature 26: Sleep Quality Tracking
function logSleep() {
    const hours = parseFloat(document.getElementById('sleep-hours').value);
    const quality = parseInt(document.getElementById('sleep-quality').value);
    
    if (hours && quality) {
        appState.sessionHistory.push({
            type: 'sleep',
            hours,
            quality,
            date: new Date().toISOString()
        });
        alert(`Sleep logged: ${hours}h, Quality: ${quality}/10`);
        appState.wellnessScore += 5;
        loadStats();
    }
}

// Feature 28: Screen Time Monitor
function logScreenTime() {
    const time = prompt('Enter screen time (hours):');
    if (time) {
        document.getElementById('screen-time').textContent = `${time}h 0m`;
    }
}

function updateProgress(elementId, current, goal) {
    const percentage = (current / goal) * 100;
    document.getElementById(elementId).style.width = `${Math.min(percentage, 100)}%`;
}

// Feature 9: Gratitude Journal, 8: Daily Affirmations, 31: Personal Notes
function initializeJournal() {
    // Journal tabs
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
    
    // Gratitude journal
    document.getElementById('save-gratitude').addEventListener('click', saveGratitude);
    
    // Affirmations
    document.getElementById('new-affirmation').addEventListener('click', showRandomAffirmation);
    document.getElementById('add-affirmation').addEventListener('click', addCustomAffirmation);
    
    // Personal notes
    document.getElementById('save-note').addEventListener('click', saveNote);
    
    showRandomAffirmation();
}

const defaultAffirmations = [
    "I am worthy of love and respect",
    "I choose peace and calm",
    "I am growing and evolving every day",
    "I trust in my journey",
    "I am confident and capable",
    "I attract positive energy",
    "I am grateful for this moment",
    "I deserve happiness and success"
];

function saveGratitude() {
    const entry = document.getElementById('gratitude-entry').value;
    if (entry) {
        appState.journalEntries.push({ type: 'gratitude', entry, date: new Date().toISOString() });
        document.getElementById('gratitude-entry').value = '';
        renderGratitudeHistory();
        appState.wellnessScore += 3;
        loadStats();
    }
}

function renderGratitudeHistory() {
    const history = document.getElementById('gratitude-history');
    history.innerHTML = appState.journalEntries
        .filter(e => e.type === 'gratitude')
        .reverse()
        .slice(0, 5)
        .map(entry => `
            <div class="journal-entry">
                <div class="date">${new Date(entry.date).toLocaleDateString()}</div>
                <p>${entry.entry}</p>
            </div>
        `).join('');
}

function showRandomAffirmation() {
    const allAffirmations = [...defaultAffirmations, ...appState.customAffirmations];
    const random = allAffirmations[Math.floor(Math.random() * allAffirmations.length)];
    document.getElementById('affirmation-display').textContent = random;
}

function addCustomAffirmation() {
    const affirmation = document.getElementById('custom-affirmation').value;
    if (affirmation) {
        appState.customAffirmations.push(affirmation);
        document.getElementById('custom-affirmation').value = '';
        renderMyAffirmations();
    }
}

function renderMyAffirmations() {
    const list = document.getElementById('my-affirmations');
    list.innerHTML = appState.customAffirmations.map(aff => `
        <div class="affirmation-item">
            <span>${aff}</span>
        </div>
    `).join('');
}

function saveNote() {
    const entry = document.getElementById('note-entry').value;
    if (entry) {
        appState.notes.push({ entry, date: new Date().toISOString() });
        document.getElementById('note-entry').value = '';
        renderNotesHistory();
    }
}

function renderNotesHistory() {
    const history = document.getElementById('notes-history');
    history.innerHTML = appState.notes
        .reverse()
        .slice(0, 5)
        .map(note => `
            <div class="journal-entry">
                <div class="date">${new Date(note.date).toLocaleDateString()}</div>
                <p>${note.entry}</p>
            </div>
        `).join('');
}

// Feature 32-35: Community Features
function initializeCommunity() {
    document.getElementById('add-friend').addEventListener('click', addFriend);
    document.getElementById('share-btn').addEventListener('click', shareProgress);
    
    renderFriends();
    renderGroupSessions();
    updateChallenge();
}

function addFriend() {
    const name = prompt('Enter friend\'s email:');
    if (name) {
        appState.friends.push({ name, status: 'pending' });
        renderFriends();
    }
}

function renderFriends() {
    const list = document.getElementById('friends-list');
    list.innerHTML = appState.friends.map(friend => `
        <div class="friend-card">
            <i class="fas fa-user-circle"></i>
            <p>${friend.name}</p>
        </div>
    `).join('');
}

function renderGroupSessions() {
    const sessions = [
        { title: "Morning Meditation", time: "8:00 AM", participants: 12 },
        { title: "Evening Wind Down", time: "7:00 PM", participants: 8 },
        { title: "Weekend Deep Dive", time: "10:00 AM Sat", participants: 15 }
    ];
    
    const list = document.getElementById('group-sessions');
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

function updateChallenge() {
    const progress = (appState.streak / 7) * 100;
    document.getElementById('challenge-progress').style.width = `${Math.min(progress, 100)}%`;
    document.getElementById('challenge-done').textContent = Math.min(appState.streak, 7);
}

function shareProgress() {
    const text = document.getElementById('share-text').value;
    if (text) {
        const feed = document.getElementById('community-feed');
        const post = document.createElement('div');
        post.className = 'feed-post';
        post.innerHTML = `
            <div class="author">${appState.user.name}</div>
            <p>${text}</p>
            <div class="date">${new Date().toLocaleString()}</div>
        `;
        feed.insertBefore(post, feed.firstChild);
        document.getElementById('share-text').value = '';
    }
}

// Feature 15: Yoga Pose Library, 36: Wellness Articles, 37: Mindful Eating, 29: Daily Wellness Tips
function initializeLibrary() {
    renderYogaPoses();
    renderArticles();
    renderWellnessTips();
}

const yogaPoses = [
    { name: "Mountain Pose", description: "Foundation for standing poses" },
    { name: "Downward Dog", description: "Full body stretch" },
    { name: "Warrior I", description: "Strength and focus" },
    { name: "Tree Pose", description: "Balance and stability" },
    { name: "Child's Pose", description: "Rest and recovery" },
    { name: "Cat-Cow", description: "Spine flexibility" }
];

function renderYogaPoses() {
    const grid = document.getElementById('yoga-grid');
    grid.innerHTML = yogaPoses.map(pose => `
        <div class="yoga-card">
            <h4>${pose.name}</h4>
            <p>${pose.description}</p>
        </div>
    `).join('');
}

const articles = [
    { title: "The Science of Meditation", preview: "Discover how meditation changes your brain" },
    { title: "Building Healthy Habits", preview: "Tips for lasting lifestyle changes" },
    { title: "Understanding Stress", preview: "Learn to manage and reduce stress" },
    { title: "Sleep Hygiene Guide", preview: "Improve your sleep quality naturally" },
    { title: "Mindfulness in Daily Life", preview: "Bring awareness to everyday moments" }
];

function renderArticles() {
    const grid = document.getElementById('articles-grid');
    grid.innerHTML = articles.map(article => `
        <div class="article-card">
            <h4>${article.title}</h4>
            <p>${article.preview}</p>
        </div>
    `).join('');
}

const wellnessTips = [
    "Start your day with a glass of water",
    "Take regular breaks from screens",
    "Practice gratitude daily",
    "Move your body for 30 minutes",
    "Connect with loved ones",
    "Get sunlight exposure",
    "Maintain a consistent sleep schedule"
];

function renderWellnessTips() {
    const container = document.getElementById('wellness-tips');
    const randomTips = wellnessTips.sort(() => 0.5 - Math.random()).slice(0, 3);
    container.innerHTML = randomTips.map(tip => `
        <div class="tip-card">
            <i class="fas fa-lightbulb"></i>
            <p>${tip}</p>
        </div>
    `).join('');
}

// Settings Features
function initializeSettings() {
    // Profile update
    document.getElementById('update-profile').addEventListener('click', updateProfile);
    
    // Goal settings
    document.getElementById('update-goal').addEventListener('click', updateGoal);
    
    // Background customization
    renderBackgroundOptions();
    
    // Data export
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('view-history').addEventListener('click', viewHistory);
    
    // Calendar sync
    document.getElementById('sync-calendar').addEventListener('click', syncCalendar);
}

function updateProfile() {
    const name = document.getElementById('profile-name').value;
    const email = document.getElementById('profile-email').value;
    
    if (name) {
        appState.user.name = name;
        document.getElementById('user-name').textContent = name;
    }
    if (email) {
        appState.user.email = email;
    }
    
    alert('Profile updated!');
}

function updateGoal() {
    const goal = parseInt(document.getElementById('meditation-goal').value);
    if (goal) {
        appState.meditationGoal = goal;
        alert(`Meditation goal updated to ${goal} minutes!`);
    }
}

// Feature 46: Customizable Backgrounds
function renderBackgroundOptions() {
    const backgrounds = [
        '#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b',
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    ];
    
    const container = document.getElementById('background-options');
    container.innerHTML = backgrounds.map((bg, i) => `
        <div class="background-option" style="background: ${bg}" data-bg="${bg}"></div>
    `).join('');
    
    container.querySelectorAll('.background-option').forEach(option => {
        option.addEventListener('click', () => {
            container.querySelectorAll('.background-option').forEach(o => o.classList.remove('active'));
            option.classList.add('active');
        });
    });
}

// Feature 45: Export Progress Data
function exportData() {
    const data = JSON.stringify(appState, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindglow-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
}

// Feature 47: Session History
function viewHistory() {
    const modal = document.getElementById('history-modal');
    const content = document.getElementById('history-content');
    
    content.innerHTML = appState.sessionHistory.reverse().map(session => `
        <div class="history-item">
            <h4>${session.type.charAt(0).toUpperCase() + session.type.slice(1)} Session</h4>
            <p>Duration: ${session.duration} minutes</p>
            <p class="date">${new Date(session.date).toLocaleString()}</p>
        </div>
    `).join('');
    
    modal.classList.remove('hidden');
    
    modal.querySelector('.close').addEventListener('click', () => {
        modal.classList.add('hidden');
    });
}

// Feature 41: Calendar Integration
function syncCalendar() {
    alert('Calendar sync feature coming soon! This will integrate with your device calendar.');
}

// Feature 13: Achievement Badges
const badges = [
    { id: 1, name: "First Session", icon: "star", required: 1 },
    { id: 2, name: "7-Day Streak", icon: "fire", required: 7 },
    { id: 3, name: "100 Minutes", icon: "clock", required: 100 },
    { id: 4, name: "Wellness Warrior", icon: "trophy", required: 50 }
];

function checkBadges() {
    let earned = 0;
    
    if (appState.totalMinutes >= 1) earned++;
    if (appState.streak >= 7) earned++;
    if (appState.totalMinutes >= 100) earned++;
    if (appState.wellnessScore >= 50) earned++;
    
    appState.badges = earned;
}

// Feature 38: Productivity Timer (Pomodoro)
let pomodoroTimer = null;
let pomodoroRunning = false;

function initializePomodoro() {
    const toggleBtn = document.getElementById('toggle-pomodoro');
    const content = document.querySelector('.pomodoro-content');
    const startBtn = document.getElementById('start-pomodoro');
    
    toggleBtn.addEventListener('click', () => {
        content.classList.toggle('hidden');
    });
    
    startBtn.addEventListener('click', () => {
        if (!pomodoroRunning) {
            startPomodoro();
            startBtn.textContent = 'Stop';
        } else {
            stopPomodoro();
            startBtn.textContent = 'Start';
        }
    });
}

function startPomodoro() {
    let seconds = 25 * 60;
    pomodoroRunning = true;
    
    pomodoroTimer = setInterval(() => {
        seconds--;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        
        document.getElementById('pomodoro-minutes').textContent = mins.toString().padStart(2, '0');
        document.getElementById('pomodoro-seconds').textContent = secs.toString().padStart(2, '0');
        
        if (seconds <= 0) {
            stopPomodoro();
            alert('Pomodoro complete! Take a break. 🎉');
        }
    }, 1000);
}

function stopPomodoro() {
    if (pomodoroTimer) {
        clearInterval(pomodoroTimer);
        pomodoroTimer = null;
    }
    pomodoroRunning = false;
    document.getElementById('pomodoro-minutes').textContent = '25';
    document.getElementById('pomodoro-seconds').textContent = '00';
}

// Feature 42: Reminder Notifications
// Feature 44: Offline Mode Support
// Feature 48: Personal Stats Dashboard
// Feature 49: Wellness Score Calculation
// Feature 50: Voice-guided sessions
// These features would require additional APIs and are scaffolded in the UI

// Save state to localStorage periodically
setInterval(() => {
    if (appState.user) {
        localStorage.setItem('mindglowState', JSON.stringify(appState));
    }
}, 30000);

// Load state on startup
const savedState = localStorage.getItem('mindglowState');
if (savedState) {
    Object.assign(appState, JSON.parse(savedState));
}

