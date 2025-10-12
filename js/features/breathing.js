// Breathing Exercises Feature Module

export class BreathingFeature {
    constructor() {
        this.patterns = {
            'box': [['Inhale', 4], ['Hold', 4], ['Exhale', 4], ['Hold', 4]],
            '478': [['Inhale', 4], ['Hold', 7], ['Exhale', 8]],
            'calm': [['Inhale', 4], ['Exhale', 6]]
        };
        this.currentExercise = null;
    }

    initialize() {
        const exerciseCards = document.querySelectorAll('.exercise-card button');
        exerciseCards.forEach(btn => {
            btn.addEventListener('click', () => {
                const card = btn.closest('.exercise-card');
                const exercise = card.dataset.exercise;
                this.startExercise(exercise);
            });
        });
        
        const stopBtn = document.getElementById('stop-breathing');
        if (stopBtn) {
            stopBtn.addEventListener('click', () => this.stopExercise());
        }
    }

    startExercise(type) {
        this.currentExercise = type;
        const visualizer = document.getElementById('breathing-visualizer');
        const instruction = visualizer.querySelector('.breath-instruction');
        
        visualizer.classList.remove('hidden');
        
        let step = 0;
        const pattern = this.patterns[type];
        
        const runPattern = () => {
            if (visualizer.classList.contains('hidden')) return;
            
            const [action, duration] = pattern[step];
            instruction.textContent = action;
            
            setTimeout(() => {
                step = (step + 1) % pattern.length;
                runPattern();
            }, duration * 1000);
        };
        
        runPattern();
    }

    stopExercise() {
        this.currentExercise = null;
        const visualizer = document.getElementById('breathing-visualizer');
        visualizer.classList.add('hidden');
    }
}

// Singleton instance
export const breathing = new BreathingFeature();

