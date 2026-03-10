// Sample products and services for MindGlow store (wellness & meditation themed)

export const STORE_SAMPLE_PRODUCTS = [
    {
        type: 'product',
        title: 'Meditation Cushion',
        description: 'Ergonomic zafu cushion for comfortable seated meditation. Filled with buckwheat hulls for optimal support and posture.',
        price: 29.99
    },
    {
        type: 'product',
        title: 'Essential Oil Diffuser',
        description: 'Ultrasonic aromatherapy diffuser with soft LED light. Perfect for creating a calming atmosphere during meditation and sleep.',
        price: 34.99
    },
    {
        type: 'product',
        title: 'Yoga Mat',
        description: 'Non-slip eco-friendly yoga mat, 6mm thick. Ideal for yoga, stretching, and floor meditation practice.',
        price: 24.99
    },
    {
        type: 'product',
        title: 'Sleep Mask',
        description: 'Soft, breathable sleep mask with adjustable strap. Blocks light for deeper rest and nap meditation.',
        price: 14.99
    },
    {
        type: 'product',
        title: 'Mindfulness Journal',
        description: 'Daily gratitude and reflection journal with prompts. Supports your journaling and affirmation practice.',
        price: 12.99
    }
];

export const STORE_SAMPLE_SERVICES = [
    {
        type: 'service',
        title: '1-on-1 Meditation Coaching (30 min)',
        description: 'Personalized 30-minute session with a meditation coach. Get guidance tailored to your goals and experience level.',
        price: 45
    },
    {
        type: 'service',
        title: 'Custom Wellness Plan',
        description: 'A tailored wellness plan including meditation, habits, and self-care recommendations based on your needs.',
        price: 79
    },
    {
        type: 'service',
        title: 'Stress Relief Workshop',
        description: '60-minute group workshop on breathing techniques, body scan, and quick stress-relief practices you can use daily.',
        price: 25
    },
    {
        type: 'service',
        title: 'Guided Meditation Session (60 min)',
        description: 'One-hour in-depth guided meditation session. Themes: relaxation, focus, or sleep—your choice.',
        price: 35
    },
    {
        type: 'service',
        title: 'Mindfulness Course (4 weeks)',
        description: 'Four-week structured course covering mindfulness basics, habit building, and integrating practice into daily life.',
        price: 99
    }
];

export const STORE_SAMPLE_ITEMS = [...STORE_SAMPLE_PRODUCTS, ...STORE_SAMPLE_SERVICES];
