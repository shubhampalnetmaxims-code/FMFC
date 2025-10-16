import type { NavItemType, Community, User, UserRole, File } from './types';

interface NavItem {
    id: NavItemType;
    label: string;
}

export const NAV_ITEMS: NavItem[] = [
    { id: 'Community', label: 'Community' },
    { id: 'Session', label: 'Session' },
    { id: 'Goals', label: 'Goals' },
    { id: 'Workouts', label: 'Workouts' },
    { id: 'Profile', label: 'Profile' },
];

// --- USERS ---
export const TEST_USER: User = { id: 1, name: 'Test User', avatar: 'https://picsum.photos/id/43/200/200', role: 'customer' };
export const ADMIN_USER: User = { id: 2, name: 'Admin User', avatar: 'https://picsum.photos/id/42/200/200', role: 'admin' };

export const USERS_DATA: User[] = [
    TEST_USER,
    ADMIN_USER,
    { id: 3, name: 'Alex Fitness', avatar: 'https://picsum.photos/id/1005/200/200' },
    { id: 4, name: 'Yoga Jasmine', avatar: 'https://picsum.photos/id/1011/200/200' },
    { id: 5, name: 'Cardio King', avatar: 'https://picsum.photos/id/1025/200/200' },
    { id: 6, name: 'Protein Chef', avatar: 'https://picsum.photos/id/1027/200/200' },
    { id: 7, name: 'GymBro', avatar: 'https://picsum.photos/id/201/200/200' },
    { id: 8, name: 'FitLife', avatar: 'https://picsum.photos/id/202/200/200' },
    { id: 9, name: 'ZenMaster', avatar: 'https://picsum.photos/id/203/200/200' },
    { id: 10, name: 'Foodie', avatar: 'https://picsum.photos/id/204/200/200' },
    { id: 11, name: 'MealPrepPro', avatar: 'https://picsum.photos/id/206/200/200' },
];

const [testUser, adminUser, alex, jasmine, cardio, chef, gymBro, fitLife, zenMaster, foodie, mealPrep] = USERS_DATA;

const DUMMY_FILES: File[] = [
    { id: 1, name: 'Beginner_Workout_Plan.pdf', url: '#', size: '1.2MB', type: 'PDF' },
    { id: 2, name: 'Strength_Training_Guide.docx', url: '#', size: '876KB', type: 'DOCX' },
    { id: 3, name: 'Monthly_Progress_Tracker.xlsx', url: '#', size: '245KB', type: 'XLSX' },
    { id: 4, name: 'Healthy_Recipes_Vol1.pdf', url: '#', size: '3.5MB', type: 'PDF' },
];

// --- COMMUNITIES DATA ---
export const COMMUNITIES_DATA: Community[] = [
    {
        id: 1,
        name: 'Barbell Brigade',
        description: 'Dedicated to all things strength training. Share your PRs, discuss routines, and motivate fellow lifters.',
        isPrivate: false,
        adminId: adminUser.id,
        members: [alex, gymBro, fitLife, testUser, adminUser, cardio],
        channels: [
            { id: 101, name: 'general-posts', type: 'posts' },
            { id: 102, name: 'random-chat', type: 'chat' },
            { id: 104, name: 'members', type: 'members' },
            { id: 105, name: 'support', type: 'chat' },
        ],
        posts: [
             {
                id: 9,
                user: adminUser,
                communityId: 1,
                channelId: 101,
                image: 'https://picsum.photos/id/145/600/400',
                likes: 1100,
                commentCount: 3,
                comments: [
                    { user: testUser, text: 'I am so in for this!' },
                    { user: alex, text: 'Let\'s go! My legs are ready.' },
                    { user: fitLife, text: 'Perfect timing, I need a new challenge.' }
                ],
                description: "📢 NEW COMMUNITY CHALLENGE! 📢 Who's ready for the #30DaySquatChallenge? We're starting next Monday. Let's build stronger legs and glutes together! Drop a comment if you're in!",
                hashtags: ['#SquatChallenge', '#LegWorkout', '#CommunityChallenge', '#GetStrong'],
            },
            {
                id: 8,
                user: cardio,
                communityId: 1,
                channelId: 101,
                image: 'https://picsum.photos/id/838/600/400',
                likes: 720,
                commentCount: 2,
                comments: [
                    { user: gymBro, text: 'Looks intense! What was the routine?' },
                    { user: alex, text: 'Love a good HIIT session!' }
                ],
                description: "Who said cardio has to be boring? Smashed a killer HIIT workout today. 30 seconds on, 15 seconds off. Feeling the burn! 🔥",
                hashtags: ['#HIIT', '#cardioworkout', '#functionalfitness', '#sweat'],
            },
            {
                id: 5,
                user: gymBro,
                communityId: 1,
                channelId: 101,
                image: 'https://picsum.photos/id/1084/600/400',
                likes: 541,
                commentCount: 2,
                comments: [
                    { user: alex, text: 'I am in! Let\'s do this.' },
                    { user: testUser, text: 'Count me in too! #ChallengeAccepted' }
                ],
                description: "Who's up for the #100PushupChallenge? Day 1 done! It was tougher than I thought. Let's see who can stick with it for 30 days.",
                hashtags: ['#FitnessChallenge', '#GymLife', '#Pushups'],
            },
            {
                id: 1,
                user: alex,
                communityId: 1,
                channelId: 101,
                image: 'https://picsum.photos/id/1060/600/400',
                likes: 1256,
                commentCount: 2,
                comments: [
                    { user: gymBro, text: 'Awesome lift!' },
                    { user: fitLife, text: 'Keep it up! 💪' }
                ],
                description: 'Crushed a new personal record on my deadlift today! The grind pays off. Feeling stronger than ever.',
                hashtags: ['#deadlift', '#PR', '#powerlifting', '#fitnessjourney'],
            },
             {
                id: 3,
                user: cardio,
                communityId: 1,
                channelId: 101,
                image: 'https://picsum.photos/id/1043/600/400',
                likes: 873,
                commentCount: 0,
                comments: [],
                description: '10k run through the forest trails this morning. Nothing beats the fresh air and the sound of nature.',
                hashtags: ['#running', '#cardio', '#trailrunning', '#getoutside'],
            },
        ],
        chatMessages: [
            { id: 1, user: alex, text: 'Hey team, who is up for a lift tomorrow at 6am?', timestamp: 'Yesterday 10:41 PM', reactions: [{ emoji: '👍', user: gymBro }] },
            { id: 2, user: gymBro, text: 'I am in! Ready to crush it.', timestamp: 'Yesterday 10:42 PM', reactions: [{ emoji: '🔥', user: alex }] },
            { id: 3, user: testUser, text: "I'll be there, might be a few minutes late though.", timestamp: 'Today 7:15 AM', reactions: [] },
            { id: 6, user: adminUser, text: 'Welcome to the #support channel! If you have any questions or concerns, please ask here.', timestamp: 'Yesterday 9:00 AM', reactions: [] },
            { id: 8, user: fitLife, text: 'Hi, I am having trouble logging my workout from yesterday. Can someone help?', timestamp: 'Today 11:05 AM', reactions: [] },
            { id: 9, user: adminUser, text: `Hi ${fitLife.name}, I can certainly help with that. Can you tell me which workout you were trying to log?`, timestamp: 'Today 11:06 AM', reactions: [] },
            { id: 10, user: fitLife, text: "It was the 'Heavy Squat Day' workout.", timestamp: 'Today 11:08 AM', reactions: [], notes: 'User is on iOS v1.2. Follow up on ticket #4351.' },
        ],
        files: DUMMY_FILES,
    },
    {
        id: 2,
        name: 'The Flex Zone',
        description: 'A community for bodybuilders and aesthetics enthusiasts. Discuss diet, posing, and workout splits.',
        isPrivate: false,
        adminId: adminUser.id,
        members: [chef, foodie, mealPrep, jasmine, zenMaster, testUser],
        channels: [
            { id: 201, name: 'progress-pics', type: 'posts' },
            { id: 202, name: 'nutrition-chat', type: 'chat' },
            { id: 203, name: 'members', type: 'members' },
            { id: 204, name: 'support', type: 'chat' },
        ],
        posts: [
             {
                id: 7,
                user: jasmine,
                communityId: 2,
                channelId: 201,
                image: 'https://picsum.photos/id/433/600/400',
                likes: 1890,
                commentCount: 2,
                comments: [
                    { user: chef, text: 'Amazing definition! Keep it up!' },
                    { user: fitLife, text: 'That\'s some serious hard work paying off. Inspiring!' },
                ],
                description: "Consistency is key! Finally starting to see some definition in my back. The journey is long but so worth it. ✨",
                hashtags: ['#backday', '#fitnessprogress', '#girlswholift', '#consistency'],
            },
             {
                id: 6,
                user: fitLife,
                communityId: 2,
                channelId: 201,
                image: 'https://picsum.photos/id/219/600/400',
                likes: 987,
                commentCount: 2,
                comments: [
                    { user: cardio, text: 'Leg day is the best day!' },
                    { user: jasmine, text: 'That feeling when you can\'t walk is the best.' },
                ],
                description: "Absolutely brutal leg day today. Squats, lunges, and leg presses until I couldn't walk. The pump was insane!",
                hashtags: ['#LegDay', '#GymWorkout', '#NoPainNoGain', '#FitnessMotivation'],
            },
            {
                id: 2,
                user: jasmine,
                communityId: 2,
                channelId: 201,
                image: 'https://picsum.photos/id/1015/600/400',
                likes: 2345,
                commentCount: 1,
                comments: [
                     { user: zenMaster, text: 'Great physique! Keep up the hard work.' },
                ],
                description: 'Post-workout flex. Happy with the progress I am making on my shoulders.',
                hashtags: ['#bodybuilding', '#flex', '#progress', '#gymlife'],
            },
            {
                id: 4,
                user: chef,
                communityId: 2,
                channelId: 201,
                image: 'https://picsum.photos/id/1080/600/400',
                likes: 3102,
                commentCount: 3,
                comments: [
                    { user: foodie, text: 'Recipe please! 😍' },
                    { user: alex, text: 'That looks delicious and perfect for fuel.' },
                    { user: mealPrep, text: 'Goals!' },
                ],
                description: 'Meal prep Sunday is complete! Grilled chicken, quinoa, and roasted veggies to fuel the week.',
                hashtags: ['#mealprep', '#healthyfood', '#nutrition', '#cleaneating'],
            },
        ],
        chatMessages: [
            { id: 4, user: chef, text: 'I just posted a new recipe for high-protein pancakes in the #nutrition-chat channel!', timestamp: 'Today 9:30 AM', reactions: [{ emoji: '❤️', user: foodie }, { emoji: '❤️', user: mealPrep }] },
            { id: 5, user: foodie, text: 'OMG, making those this weekend for sure!', timestamp: 'Today 9:32 AM', reactions: [] },
            { id: 7, user: adminUser, text: 'Hello! This is the #support channel for The Flex Zone. I am here to help!', timestamp: 'Yesterday 9:05 AM', reactions: [] },
            { id: 11, user: testUser, text: "I can't find the protein powder you mentioned in your latest recipe. Is there a good substitute?", timestamp: 'Today 1:12 PM', reactions: [] },
        ],
        files: [DUMMY_FILES[3]],
    }
];

// For the "All Feed" tab, we just combine all posts from all communities.
export const ALL_POSTS_DATA = COMMUNITIES_DATA.flatMap(c => c.posts);