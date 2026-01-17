// Tutorial steps configuration for RizHub onboarding

export interface TutorialStep {
    id: string;
    title: string;
    description: string;
    targetElement: string; // CSS selector for the element to highlight
    position: 'top' | 'bottom' | 'left' | 'right' | 'center';
    action?: {
        type: 'click' | 'scroll' | 'wait';
        target?: string;
        delay?: number;
    };
    skipAllowed?: boolean;
    highlightPadding?: number;
}

export const TUTORIAL_STEPS: TutorialStep[] = [
    {
        id: 'welcome',
        title: '🎮 Welcome to RizHub!',
        description: 'Get ready to explore "Noli Me Tangere" in an interactive and fun way! Let\'s take a quick tour of the main features.',
        targetElement: 'body',
        position: 'center',
        skipAllowed: true,
        action: {
            type: 'wait',
            delay: 500
        }
    },
    {
        id: 'dashboard-overview',
        title: '📚 Your Learning Dashboard',
        description: 'This is your dashboard - your personal learning hub where you can track progress, view achievements, and access all learning materials.',
        targetElement: '.dashboard-container',
        position: 'center',
        skipAllowed: true,
        highlightPadding: 20
    },
    {
        id: 'kabanata-list',
        title: '📖 Chapters (Kabanata)',
        description: 'Here are the chapters from Noli Me Tangere. Each chapter contains videos, character information, word challenges, and quizzes. Click on any chapter to start learning!',
        targetElement: '.kabanata-grid, .kabanata-list',
        position: 'bottom',
        skipAllowed: true,
        highlightPadding: 15
    },
    {
        id: 'progress-indicator',
        title: '⭐ Progress & Stars',
        description: 'Stars show your progress in each chapter. Complete videos, quizzes, and challenges to earn stars. Unlock new chapters as you progress!',
        targetElement: '.progress-stars, .star-container',
        position: 'top',
        skipAllowed: true,
        highlightPadding: 10
    },
    {
        id: 'challenge-button',
        title: '🎯 Start Learning',
        description: 'Click the challenge button to enter a chapter and access its learning activities.',
        targetElement: '.challenge-button, [data-tutorial="challenge-button"]',
        position: 'bottom',
        skipAllowed: false,
        action: {
            type: 'click',
            target: '.challenge-button, [data-tutorial="challenge-button"]'
        }
    },
    {
        id: 'video-lesson',
        title: '🎬 Video Lessons',
        description: 'Watch videos about the chapter to understand the story and characters better. You can pause, rewind, and watch at your own pace.',
        targetElement: '.video-container, [data-tutorial="video-section"]',
        position: 'bottom',
        skipAllowed: true,
        highlightPadding: 15
    },
    {
        id: 'guess-character',
        title: '👥 Guess the Character',
        description: 'Test your knowledge! Guess the correct character based on the description. This helps you learn more about the characters in the story.',
        targetElement: '.guess-character-container, [data-tutorial="guess-character"]',
        position: 'bottom',
        skipAllowed: true,
        highlightPadding: 15
    },
    {
        id: 'guess-word',
        title: '📝 Guess the Word',
        description: 'Fill in the missing words from the chapter. This activity helps you understand important vocabulary and key moments.',
        targetElement: '.guess-word-container, [data-tutorial="guess-word"]',
        position: 'bottom',
        skipAllowed: true,
        highlightPadding: 15
    },
    {
        id: 'quiz-section',
        title: '❓ Quiz Challenge',
        description: 'Answer multiple-choice questions to test your understanding. You need a perfect score to unlock the next chapter!',
        targetElement: '.quiz-container, [data-tutorial="quiz-section"]',
        position: 'bottom',
        skipAllowed: true,
        highlightPadding: 15
    },
    {
        id: 'audio-controls',
        title: '🔊 Audio Settings',
        description: 'Toggle background music and sound effects on/off. Customize your experience based on your preference!',
        targetElement: '.audio-controls, [data-tutorial="audio-controls"]',
        position: 'top',
        skipAllowed: true,
        highlightPadding: 10
    },
    {
        id: 'notifications',
        title: '🔔 Notifications',
        description: 'Check your notifications here to see achievements, milestones, and updates about your progress.',
        targetElement: '.notification-bell, [data-tutorial="notifications"]',
        position: 'bottom',
        skipAllowed: true,
        highlightPadding: 10
    },
    {
        id: 'profile-settings',
        title: '⚙️ Your Profile',
        description: 'View and edit your profile, change settings, and manage your account from here.',
        targetElement: '.profile-menu, [data-tutorial="profile-settings"]',
        position: 'bottom',
        skipAllowed: true,
        highlightPadding: 10
    },
    {
        id: 'completion',
        title: '🎉 You\'re All Set!',
        description: 'Great! You now know the basics of RizHub. Start with Chapter 1 and enjoy your learning journey. Remember to complete all activities to earn stars and unlock new chapters!',
        targetElement: 'body',
        position: 'center',
        skipAllowed: true,
        action: {
            type: 'wait',
            delay: 500
        }
    }
];

export const TUTORIAL_CONFIG = {
    storageKey: 'rizhub_tutorial_completed',
    overlayOpacity: 0.7,
    highlightBorderRadius: 12,
    animationDuration: 300,
    arrowSize: 20,
};
