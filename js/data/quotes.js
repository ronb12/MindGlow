// Daily Inspirational Quotes

export const quotes = [
    { 
        text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", 
        author: "Thich Nhat Hanh" 
    },
    { 
        text: "Meditation is not about stopping thoughts, but recognizing that we are more than our thoughts and our feelings.", 
        author: "Arianna Huffington" 
    },
    { 
        text: "Peace comes from within. Do not seek it without.", 
        author: "Buddha" 
    },
    { 
        text: "The mind is everything. What you think you become.", 
        author: "Buddha" 
    },
    { 
        text: "Wherever you are, be all there.", 
        author: "Jim Elliot" 
    },
    { 
        text: "Your calm mind is the ultimate weapon against your challenges.", 
        author: "Bryant McGill" 
    },
    { 
        text: "In the midst of movement and chaos, keep stillness inside of you.", 
        author: "Deepak Chopra" 
    }
];

export function getRandomQuote() {
    return quotes[Math.floor(Math.random() * quotes.length)];
}

