

import type { NavItemType, Community, User, UserRole, File, NutritionPlan, ChallengeTask } from './types';

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
export const TEST_USER: User = { id: 1, name: 'Shubham', avatar: 'https://picsum.photos/id/45/200/200', role: 'customer' };
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

export const LEADERBOARD_DATA = [
    { userId: 3, name: 'Alex Fitness', avatar: 'https://picsum.photos/id/1005/200/200', totalPoints: 1280 },
    { userId: 4, name: 'Yoga Jasmine', avatar: 'https://picsum.photos/id/1011/200/200', totalPoints: 1150 },
    { userId: 1, name: 'Shubham', avatar: 'https://picsum.photos/id/45/200/200', totalPoints: 0 }, // Current user's points will be calculated dynamically
    { userId: 5, name: 'Cardio King', avatar: 'https://picsum.photos/id/1025/200/200', totalPoints: 980 },
    { userId: 7, name: 'GymBro', avatar: 'https://picsum.photos/id/201/200/200', totalPoints: 950 },
];

const [testUser, adminUser, alex, jasmine, cardio, chef, gymBro, fitLife, zenMaster, foodie, mealPrep] = USERS_DATA;

const DUMMY_FILES: File[] = [
    { id: 1, name: 'Beginner_Workout_Plan.pdf', url: '#', size: '1.2MB', type: 'PDF' },
    { id: 2, name: 'Strength_Training_Guide.docx', url: '#', size: '876KB', type: 'DOCX' },
    { id: 3, name: 'Monthly_Progress_Tracker.xlsx', url: '#', size: '245KB', type: 'XLSX' },
    { id: 4, name: 'Healthy_Recipes_Vol1.pdf', url: '#', size: '3.5MB', type: 'PDF' },
];

// --- NUTRITION PLANS DATA ---
export const NUTRITION_PLANS_DATA: NutritionPlan[] = [
    {
        id: 1,
        name: "My Own Diet Plan",
        description: "Nutritionist Plan for body Body Building",
        isTemplate: false,
        isActive: true,
        notes: "Nutritionist Plan for body Body Building",
        totals: {
            energy: 3178,
            carbohydrates: 13.9,
            proteins: 1040,
            fats: 509,
            fibre: 2.04,
            water: 677,
        },
        content: [
            {
                mealTime: "M1",
                items: [
                    { name: "Chicken", quantity: 10, calories: 2870 },
                ],
            },
            {
                mealTime: "M2",
                items: [
                    { name: "70g Tuna, canned in brine, plain, drained", quantity: 2, calories: 165 },
                    { name: "Rice, white, Basmati, boiled, undrained", quantity: 7, calories: 9.03 },
                ],
            },
            {
                mealTime: "M3",
                items: [
                    { name: "250mL Almond and coconut milk blend, sugar-sweetened, fortified Ca and vitamins B1, B2 & B12", quantity: 2, calories: 134 },
                ],
            },
        ],
    },
    {
        id: 101,
        name: "Balanced Diet Kickstart",
        description: "A week-long plan for balanced macronutrients and sustainable energy.",
        isTemplate: true,
        isActive: false,
        notes: "Focus on whole foods. Drink at least 8 glasses of water daily. Adjust portion sizes based on activity level.",
        totals: {
            energy: 2200,
            carbohydrates: 250,
            proteins: 130,
            fats: 75,
            fibre: 30,
            water: 2000,
        },
        content: [
             {
                mealTime: "Breakfast",
                items: [
                    { name: "Oatmeal with berries and nuts", quantity: 1, calories: 450 },
                ],
            },
            {
                mealTime: "Lunch",
                items: [
                    { name: "Grilled Chicken Salad with vinaigrette", quantity: 1, calories: 600 },
                ],
            },
            {
                mealTime: "Dinner",
                items: [
                    { name: "Salmon with Quinoa and Steamed Broccoli", quantity: 1, calories: 750 },
                ],
            },
            {
                mealTime: "Snacks",
                items: [
                    { name: "Greek Yogurt", quantity: 1, calories: 200 },
                    { name: "Apple with Peanut Butter", quantity: 1, calories: 200 },
                ],
            },
        ],
    },
    {
        id: 102,
        name: "Lean Mass Gain",
        description: "High-protein plan designed to support muscle growth and recovery.",
        isTemplate: true,
        isActive: false,
        notes: "Consume a protein shake post-workout. Timing of meals is crucial. Don't skip meals.",
        totals: {
            energy: 3000,
            carbohydrates: 300,
            proteins: 200,
            fats: 110,
            fibre: 40,
            water: 3000,
        },
        content: [
             {
                mealTime: "Meal 1",
                items: [
                    { name: "Scrambled Eggs with whole wheat toast", quantity: 4, calories: 500 },
                ],
            },
            {
                mealTime: "Meal 2",
                items: [
                    { name: "Chicken Breast with Brown Rice", quantity: 1, calories: 600 },
                ],
            },
            {
                mealTime: "Meal 3 (Post-Workout)",
                items: [
                    { name: "Whey Protein Shake", quantity: 1, calories: 300 },
                ],
            },
             {
                mealTime: "Meal 4",
                items: [
                    { name: "Steak with Sweet Potato and Asparagus", quantity: 1, calories: 800 },
                ],
            },
            {
                mealTime: "Meal 5",
                items: [
                     { name: "Cottage Cheese with Almonds", quantity: 1, calories: 400 },
                ],
            },
        ],
    },
];

// --- GOALS / CHALLENGE DATA ---
export const TASK_POINTS = 10;

export const DAILY_CHALLENGE_TASKS: ChallengeTask[] = [
    { id: 'meal_plan', title: 'Stick to your meal plan', type: 'auto', frequency: 'daily', category: 'Nutrition', autoCheckCondition: 'nutrition_plan_complete' },
    { id: 'water', title: 'Drink 1L of water', type: 'manual', frequency: 'daily', category: 'Nutrition' },
    { id: 'cardio', title: '20 minutes of cardio', type: 'manual', frequency: 'daily', category: 'Activity' },
    { id: 'log_measurements', title: 'Log daily measurements', type: 'auto', frequency: 'daily', category: 'Progress', autoCheckCondition: 'measurement_added' },
    { id: 'photo_front', title: 'Take progress photo (front)', type: 'auto', frequency: 'daily', category: 'Progress', autoCheckCondition: 'photo_front' },
    { id: 'photo_side', title: 'Take progress photo (side)', type: 'auto', frequency: 'daily', category: 'Progress', autoCheckCondition: 'photo_side' },
];

export const WEEKLY_CHALLENGE_TASKS: ChallengeTask[] = [
    { id: 'strength_workouts', title: '3 Strength Workouts', type: 'manual', frequency: 'weekly', category: 'Activity', repeatDays: ['Mon', 'Wed', 'Fri'] },
    { id: 'active_recovery', title: '1 Active Recovery Day', type: 'manual', frequency: 'weekly', category: 'Activity', repeatDays: ['Sun'] },
    { id: 'meal_prep', title: 'Plan meals for the week', type: 'manual', frequency: 'weekly', category: 'Nutrition', repeatDays: ['Sun'] },
    { id: 'review_progress', title: 'Review weekly progress', type: 'manual', frequency: 'weekly', category: 'Progress', repeatDays: ['Sat'] },
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
                id: 10,
                user: gymBro,
                communityId: 1,
                channelId: 101,
                video: 'https://videos.pexels.com/video-files/4753648/4753648-hd.mp4',
                likes: 950,
                commentCount: 2,
                comments: [
                    { user: alex, text: 'Those pull-ups are clean! 🔥' },
                    { user: fitLife, text: 'Form is everything. Great work!' }
                ],
                description: "Working on that back strength with some weighted pull-ups. The challenge is real, but so are the results. Who's with me on this grind? #pullupchallenge",
                hashtags: ['#pullups', '#backday', '#calisthenics', '#gymmotivation'],
            },
             {
                id: 9,
                user: adminUser,
                communityId: 1,
                channelId: 101,
                image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto.format&fit=crop',
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
                image: 'https://images.unsplash.com/photo-1517836357463-d257692635c3?q=80&w=600&auto.format&fit=crop',
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
                image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=600&auto.format&fit=crop',
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
                image: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?q=80&w=600&auto.format&fit=crop',
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
                image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=600&auto.format&fit=crop',
                likes: 873,
                commentCount: 2,
                comments: [
                    { user: gymBro, text: 'That looks intense! Major respect.' },
                    { user: alex, text: 'This is what it\'s all about! Community and competition.' }
                ],
                description: 'Throwback to the annual Throwdown event! The energy was insane. Pushing limits and cheering each other on. Can\'t wait for the next one!',
                hashtags: ['#FitnessEvent', '#Crossfit', '#Competition', '#Community'],
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
        goals: [],
        workouts: [],
        meals: [],
    },
    {
        id: 2,
        name: 'The Flex Zone',
        description: 'A community for bodybuilders and aesthetics enthusiasts. Discuss diet, posing, and workout splits.',
        isPrivate: false,
        adminId: adminUser.id,
        members: [chef, foodie, mealPrep, jasmine, zenMaster, testUser, alex, fitLife],
        channels: [
            { id: 201, name: 'progress-pics', type: 'posts' },
            { id: 202, name: 'nutrition-chat', type: 'chat' },
            { id: 203, name: 'members', type: 'members' },
            { id: 204, name: 'support', type: 'chat' },
        ],
        posts: [
            {
                id: 12,
                user: alex,
                communityId: 2,
                channelId: 201,
                image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=600&auto.format&fit=crop',
                likes: 1500,
                commentCount: 3,
                comments: [
                    { user: foodie, text: 'Incredible strength!' },
                    { user: jasmine, text: 'This is so motivating! 🔥' },
                    { user: fitLife, text: 'Beast mode activated!' },
                ],
                description: 'Took on the rope climb challenge today. It was a test of grip, upper body strength, and sheer will. Feeling accomplished!',
                hashtags: ['#ropeclimb', '#challengeaccepted', '#functionalfitness', '#gains'],
            },
            {
                id: 11,
                user: jasmine,
                communityId: 2,
                channelId: 201,
                video: 'https://videos.pexels.com/video-files/3840428/3840428-hd.mp4',
                likes: 1300,
                commentCount: 2,
                comments: [
                    { user: chef, text: 'Perfect squat form! Killing it.' },
                    { user: zenMaster, text: 'Inspiring dedication.' },
                ],
                description: "Focusing on depth and control in my squats today. It's not about the weight, it's about the quality of each rep. #legdaymotivation",
                hashtags: ['#squats', '#legday', '#formcheck', '#girlswholift'],
            },
             {
                id: 7,
                user: jasmine,
                communityId: 2,
                channelId: 201,
                image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto.format&fit=crop',
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
                image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto.format&fit=crop',
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
                image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto.format&fit=crop',
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
                image: 'https://images.unsplash.com/photo-1540420773420-28507da66d68?q=80&w=600&auto.format&fit=crop',
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
        goals: [],
        workouts: [],
        meals: [],
    },
    {
        id: 3,
        name: 'FMFC Official',
        description: 'Forge Your Fitness. The official community for all FMFC app users. Share progress, join challenges, and get support on your journey.',
        isPrivate: false,
        adminId: adminUser.id,
        members: [testUser, adminUser, alex, jasmine, cardio, chef, fitLife, gymBro],
        channels: [
            { id: 301, name: 'announcements', type: 'admin-only' },
            { id: 302, name: 'general-fitness', type: 'posts' },
            { id: 303, name: 'nutrition-corner', type: 'chat' },
            { id: 304, name: 'weekly-challenges', type: 'posts' },
            { id: 305, name: 'members', type: 'members' },
            { id: 306, name: 'support', type: 'chat' },
        ],
        posts: [
            {
                id: 20,
                user: adminUser,
                communityId: 3,
                channelId: 301, // announcements
                image: 'https://images.unsplash.com/photo-1571019614242-c5c5792c6c39?q=80&w=600&auto.format&fit=crop',
                likes: 120,
                commentCount: 1,
                comments: [{ user: testUser, text: 'Awesome news!' }],
                description: "🎉 Welcome to the official FMFC community! We're thrilled to have you here. Introduce yourself in the #general-fitness channel and let's start forging our fitness together!",
                hashtags: ['#Welcome', '#FMFC', '#Community'],
            },
            {
                id: 21,
                user: adminUser,
                communityId: 3,
                channelId: 304, // weekly-challenges
                image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=600&auto.format&fit=crop',
                likes: 350,
                commentCount: 2,
                comments: [
                    { user: alex, text: 'I am so ready for this!' },
                    { user: cardio, text: 'Let\'s get it! 🔥' }
                ],
                description: "This week's challenge: The #MileHighClub! Run or walk one mile every single day this week. Post your progress pics here. Let's see who can keep the streak alive!",
                hashtags: ['#WeeklyChallenge', '#Running', '#Cardio', '#FitnessChallenge'],
            },
            {
                id: 22,
                user: chef,
                communityId: 3,
                channelId: 302, // general-fitness
                image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17025?q=80&w=600&auto.format&fit=crop',
                likes: 840,
                commentCount: 2,
                comments: [
                    { user: foodie, text: 'Looks amazing! I need that recipe.' },
                    { user: mealPrep, text: 'Perfect for my meal prep this week!' }
                ],
                description: "Fuel your gains with this delicious and simple salmon and veggie bowl. Packed with protein and healthy fats. Check out the #nutrition-corner channel for the full recipe!",
                hashtags: ['#HealthyEating', '#Nutrition', '#Protein', '#MealPrep'],
            },
            {
                id: 23,
                user: fitLife,
                communityId: 3,
                channelId: 302, // general-fitness
                video: 'https://videos.pexels.com/video-files/3838442/3838442-hd.mp4',
                likes: 555,
                commentCount: 2,
                comments: [
                    { user: gymBro, text: 'Great form on those kettlebell swings!' },
                    { user: jasmine, text: 'Love this combo! Totally trying it.' }
                ],
                description: "Quick and effective full-body kettlebell flow to get the heart pumping. Give this a try when you're short on time but want a great workout.",
                hashtags: ['#KettlebellWorkout', '#FullBody', '#HIIT', '#WorkoutMotivation'],
            }
        ],
        chatMessages: [
            { id: 20, user: chef, text: 'Hey everyone, just dropped the recipe for the salmon bowl in here. Let me know what you think!', timestamp: 'Today 1:00 PM', reactions: [{ emoji: '👍', user: foodie }] },
            { id: 21, user: foodie, text: "Thanks, @Protein Chef! It looks incredible.", timestamp: 'Today 1:01 PM', reactions: [] },
            { id: 22, user: testUser, text: "Hey @Admin User, my app keeps crashing when I try to log a run for the weekly challenge. Any ideas?", timestamp: 'Today 2:30 PM', reactions: [] },
            { id: 23, user: adminUser, text: `Hi ${testUser.name}, sorry to hear that. I've created a support ticket for you. Can you tell me what device you're using?`, timestamp: 'Today 2:31 PM', reactions: [], toUserId: testUser.id },
        ],
        files: [DUMMY_FILES[0], DUMMY_FILES[3]],
        goals: [],
        workouts: [],
        meals: [],
    }
];

// For the "All Feed" tab, we just combine all posts from all communities.
export const ALL_POSTS_DATA = COMMUNITIES_DATA.flatMap(c => c.posts);