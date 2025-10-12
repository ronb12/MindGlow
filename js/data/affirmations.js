// Daily Affirmations

export const defaultAffirmations = [
    "I am worthy of love and respect",
    "I choose peace and calm",
    "I am growing and evolving every day",
    "I trust in my journey",
    "I am confident and capable",
    "I attract positive energy",
    "I am grateful for this moment",
    "I deserve happiness and success"
];

export function getRandomAffirmation(customAffirmations = []) {
    const allAffirmations = [...defaultAffirmations, ...customAffirmations];
    return allAffirmations[Math.floor(Math.random() * allAffirmations.length)];
}

