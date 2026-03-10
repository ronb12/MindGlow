// ═══════════════════════════════════════════════════════════════
//    INSTANT MODAL FIX - Copy and Paste into Browser Console
// ═══════════════════════════════════════════════════════════════
//
// INSTRUCTIONS:
// 1. Open https://mindglow-wellness.web.app
// 2. Press F12 (or ⌘ + Option + J)
// 3. Click "Console" tab
// 4. Copy ALL the code below
// 5. Paste into console and press Enter
// 6. Click any yoga pose → Modal perfectly centered! ✅
//
// ═══════════════════════════════════════════════════════════════

const style = document.createElement('style');
style.id = 'modal-positioning-fix';
style.textContent = `
/* Modal Overlay - CENTERS THE MODAL */
.modal-overlay {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: rgba(0, 0, 0, 0.75) !important;
    backdrop-filter: blur(8px) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    z-index: 10000 !important;
    padding: 20px !important;
    overflow-y: auto !important;
}

/* Modal Content Container */
.modal-content {
    background: var(--card-bg) !important;
    border-radius: 15px !important;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5) !important;
    position: relative !important;
    width: 100% !important;
    max-width: 800px !important;
    margin: auto !important;
    animation: modalSlideIn 0.3s ease-out !important;
}

@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: translateY(-30px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* Modal Close Button */
.modal-close {
    position: absolute !important;
    top: 15px !important;
    right: 15px !important;
    background: rgba(0, 0, 0, 0.6) !important;
    color: white !important;
    border: none !important;
    width: 40px !important;
    height: 40px !important;
    border-radius: 50% !important;
    cursor: pointer !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 20px !important;
    z-index: 10 !important;
    transition: all 0.3s ease !important;
}

.modal-close:hover {
    background: rgba(0, 0, 0, 0.9) !important;
    transform: rotate(90deg) scale(1.1) !important;
}

/* Yoga Modal Specific */
.yoga-modal {
    max-width: 700px !important;
}

/* Article Modal Specific */
.article-modal {
    max-width: 800px !important;
}
`;

document.head.appendChild(style);
console.log('✅ Modal positioning fix applied!');
console.log('🧘 Click any yoga pose - modal will be perfectly centered!');
console.log('📖 Click any article - modal will be perfectly centered!');
console.log('✨ This fix lasts until you refresh the page.');

