// Pomodoro Timer Feature Module

export class PomodoroFeature {
    constructor() {
        this.timer = null;
        this.running = false;
    }

    initialize() {
        const toggleBtn = document.getElementById('toggle-pomodoro');
        const content = document.querySelector('.pomodoro-content');
        const startBtn = document.getElementById('start-pomodoro');
        
        if (toggleBtn && content) {
            toggleBtn.addEventListener('click', () => {
                content.classList.toggle('hidden');
            });
        }
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                if (!this.running) {
                    this.start();
                    startBtn.textContent = 'Stop';
                } else {
                    this.stop();
                    startBtn.textContent = 'Start';
                }
            });
        }
    }

    start() {
        let seconds = 25 * 60;
        this.running = true;
        
        this.timer = setInterval(() => {
            seconds--;
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            
            document.getElementById('pomodoro-minutes').textContent = mins.toString().padStart(2, '0');
            document.getElementById('pomodoro-seconds').textContent = secs.toString().padStart(2, '0');
            
            if (seconds <= 0) {
                this.stop();
                alert('Pomodoro complete! Take a break. 🎉');
                document.getElementById('start-pomodoro').textContent = 'Start';
            }
        }, 1000);
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.running = false;
        document.getElementById('pomodoro-minutes').textContent = '25';
        document.getElementById('pomodoro-seconds').textContent = '00';
    }
}

// Singleton instance
export const pomodoro = new PomodoroFeature();

