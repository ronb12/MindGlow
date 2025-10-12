// Yoga, Articles, and Tips

export const yogaPoses = [
    { name: "Mountain Pose", description: "Foundation for standing poses" },
    { name: "Downward Dog", description: "Full body stretch" },
    { name: "Warrior I", description: "Strength and focus" },
    { name: "Tree Pose", description: "Balance and stability" },
    { name: "Child's Pose", description: "Rest and recovery" },
    { name: "Cat-Cow", description: "Spine flexibility" }
];

export const articles = [
    { title: "The Science of Meditation", preview: "Discover how meditation changes your brain" },
    { title: "Building Healthy Habits", preview: "Tips for lasting lifestyle changes" },
    { title: "Understanding Stress", preview: "Learn to manage and reduce stress" },
    { title: "Sleep Hygiene Guide", preview: "Improve your sleep quality naturally" },
    { title: "Mindfulness in Daily Life", preview: "Bring awareness to everyday moments" }
];

export const wellnessTips = [
    "Start your day with a glass of water",
    "Take regular breaks from screens",
    "Practice gratitude daily",
    "Move your body for 30 minutes",
    "Connect with loved ones",
    "Get sunlight exposure",
    "Maintain a consistent sleep schedule"
];

export function getRandomTips(count = 3) {
    return wellnessTips.sort(() => 0.5 - Math.random()).slice(0, count);
}

