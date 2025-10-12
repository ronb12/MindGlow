// Utility Helper Functions

export function updateProgress(elementId, current, goal) {
    const element = document.getElementById(elementId);
    if (element) {
        const percentage = (current / goal) * 100;
        element.style.width = `${Math.min(percentage, 100)}%`;
    }
}

export function formatTime(minutes, seconds) {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

export function formatDateTime(date) {
    return new Date(date).toLocaleString();
}

export function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
    }
}

export function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

export function showNotification(message, type = 'success') {
    alert(message); // Simple for now, can be enhanced later
}

