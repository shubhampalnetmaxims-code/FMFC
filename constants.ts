

import type { NavItemType, Community, User, UserRole, File, NutritionPlan, ChallengeTask, Notification, Workout, WorkoutStyle, MuscleGroup, WorkoutDay, Equipment } from './types';

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

// --- NOTIFICATIONS DATA ---
export const NOTIFICATIONS_DATA: Notification[] = [
    { id: 1, type: 'community', text: 'Alex Fitness posted in #general-posts.', timestamp: '2m ago', isRead: false },
    { id: 2, type: 'goal', text: 'You completed all daily tasks! +50 points.', timestamp: '1h ago', isRead: false },
    { id: 3, type: 'mention', text: 'Admin User mentioned you in #support.', timestamp: '3h ago', isRead: false },
    { id: 4, type: 'like', text: 'GymBro liked your post.', timestamp: '1d ago', isRead: true },
    { id: 5, type: 'community', text: 'A new challenge #30DaySquatChallenge has started in Barbell Brigade.', timestamp: '2d ago', isRead: true },
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
            vitaminA: 0,
            vitaminC: 0,
            calcium: 0,
            iron: 0,
        },
        content: [
            {
                mealTime: "M1",
                items: [
                    { id: '1-0-0', name: "Chicken", quantity: 10, calories: 2870 },
                ],
            },
            {
                mealTime: "M2",
                items: [
                    { id: '1-1-0', name: "70g Tuna, canned in brine, plain, drained", quantity: 2, calories: 165 },
                    { id: '1-1-1', name: "Rice, white, Basmati, boiled, undrained", quantity: 7, calories: 9.03 },
                ],
            },
            {
                mealTime: "M3",
                items: [
                    { id: '1-2-0', name: "250mL Almond and coconut milk blend, sugar-sweetened, fortified Ca and vitamins B1, B2 & B12", quantity: 2, calories: 134 },
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
            vitaminA: 0,
            vitaminC: 0,
            calcium: 0,
            iron: 0,
        },
        content: [
             {
                mealTime: "Breakfast",
                items: [
                    { id: '101-0-0', name: "Oatmeal with berries and nuts", quantity: 1, calories: 450 },
                ],
            },
            {
                mealTime: "Lunch",
                items: [
                    { id: '101-1-0', name: "Grilled Chicken Salad with vinaigrette", quantity: 1, calories: 600 },
                ],
            },
            {
                mealTime: "Dinner",
                items: [
                    { id: '101-2-0', name: "Salmon with Quinoa and Steamed Broccoli", quantity: 1, calories: 750 },
                ],
            },
            {
                mealTime: "Snacks",
                items: [
                    { id: '101-3-0', name: "Greek Yogurt", quantity: 1, calories: 200 },
                    { id: '101-3-1', name: "Apple with Peanut Butter", quantity: 1, calories: 200 },
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
            vitaminA: 0,
            vitaminC: 0,
            calcium: 0,
            iron: 0,
        },
        content: [
             {
                mealTime: "Meal 1",
                items: [
                    { id: '102-0-0', name: "Scrambled Eggs with whole wheat toast", quantity: 4, calories: 500 },
                ],
            },
            {
                mealTime: "Meal 2",
                items: [
                    { id: '102-1-0', name: "Chicken Breast with Brown Rice", quantity: 1, calories: 600 },
                ],
            },
            {
                mealTime: "Meal 3 (Post-Workout)",
                items: [
                    { id: '102-2-0', name: "Whey Protein Shake", quantity: 1, calories: 300 },
                ],
            },
             {
                mealTime: "Meal 4",
                items: [
                    { id: '102-3-0', name: "Steak with Sweet Potato and Asparagus", quantity: 1, calories: 800 },
                ],
            },
            {
                mealTime: "Meal 5",
                items: [
                     { id: '102-4-0', name: "Cottage Cheese with Almonds", quantity: 1, calories: 400 },
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

// --- WORKOUTS DATA ---

export const WORKOUT_STYLES: WorkoutStyle[] = ['Calisthenics', 'Bodybuilding', 'CrossFit', 'Powerlifting', 'HIIT'];
export const MUSCLE_GROUPS: MuscleGroup[] = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];
export const WORKOUT_DAYS: WorkoutDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const EQUIPMENT_TYPES: Equipment[] = ['Dumbbell', 'Barbell', 'Kettlebell', 'Bodyweight', 'Machine'];
export const WORKOUT_DIFFICULTIES = [1, 2, 3, 4, 5];

const STANDARD_STEPS = [
    "Start in a standing position with your feet shoulder-width apart.",
    "Engage your core and keep your back straight.",
    "Lower your body as if you were sitting back into a chair.",
    "Keep your knees behind your toes and your weight in your heels.",
    "Push back up to the starting position."
];

const STANDARD_BENEFITS = [
    "Improves cardiovascular health.",
    "Builds muscular strength and endurance.",
    "Burns calories and aids in weight loss.",
    "Enhances flexibility and range of motion."
];

const VIDEO_URL_1 = "https://videos.pexels.com/video-files/4753648/4753648-hd.mp4";
const VIDEO_URL_2 = "https://videos.pexels.com/video-files/3840428/3840428-hd.mp4";

export const WORKOUTS_DATA: Workout[] = [
    { 
        id: 1, 
        title: "Workout 1", 
        image: "https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=600", 
        duration: 70, 
        style: 'HIIT', 
        muscleGroup: 'Core', 
        day: 'Monday', 
        difficulty: 2, 
        equipment: 'Bodyweight', 
        description: "Get ready to explore how our software can revolutionize your daily tasks! With intuitive designs and robust features, you’ll find yourself working smarter and faster. Let’s embark on this exciting journey to elevate your productivity!",
        phases: [
            {
                id: 'phase-1',
                name: 'WARM-UP PHASE (3)',
                sets: [
                    {
                        id: 'set-1-1',
                        name: 'WARM-UP',
                        reps: 1,
                        duration: 30,
                        exercises: [
                            { 
                                id: 'ex-1', 
                                name: 'Jumping Jacks', 
                                image: 'https://i.imgur.com/r6dJ3yG.gif',
                                videoUrl: VIDEO_URL_1,
                                steps: [
                                    "Stand upright with your legs together, arms at your sides.",
                                    "Bend your knees slightly, and jump into the air.",
                                    "As you jump, spread your legs to be about shoulder-width apart.",
                                    "Stretch your arms out and over your head.",
                                    "Jump back to the starting position."
                                ],
                                benefits: [
                                    "Cardiovascular health",
                                    "Full body warmup",
                                    "Calorie burning"
                                ]
                            },
                            { 
                                id: 'ex-2', 
                                name: 'Arm Circles', 
                                image: 'https://i.imgur.com/w1p2z6X.gif',
                                steps: ["Stand with arms extended.", "Rotate arms in small circles.", "Gradually increase circle size."],
                                benefits: ["Shoulder mobility", "Warm up shoulder joints"]
                            },
                        ]
                    },
                    {
                        id: 'set-1-2',
                        name: 'STRETCHING',
                        reps: 1,
                        duration: 30,
                        exercises: [
                            { 
                                id: 'ex-3', 
                                name: 'Torso Twists', 
                                image: 'https://i.imgur.com/JkZ2s1J.gif',
                                steps: ["Stand feet shoulder width.", "Twist torso left and right.", "Keep hips forward."],
                                benefits: ["Core mobility", "Spine health"]
                            },
                        ]
                    }
                ]
            },
        ],
        isTemplate: true,
    },
    { id: 2, title: "Workout 2", image: "https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=600", duration: 60, style: 'Calisthenics', muscleGroup: 'Legs', day: 'Tuesday', difficulty: 3, equipment: 'Bodyweight', description: "Build lower body strength and endurance using only your bodyweight.", phases: [], isTemplate: true },
    { id: 3, title: "Workout 3", image: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=600", duration: 50, style: 'Bodybuilding', muscleGroup: 'Chest', day: 'Wednesday', difficulty: 4, equipment: 'Barbell', description: "Classic chest day focused on building mass and strength with heavy compound lifts.", phases: [], isTemplate: true },
    { id: 4, title: "Workout 4", image: "https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?auto=compress&cs=tinysrgb&w=600", duration: 85, style: 'Powerlifting', muscleGroup: 'Back', day: 'Thursday', difficulty: 5, equipment: 'Barbell', description: "A heavy deadlift session designed to maximize your pulling strength.", phases: [], isTemplate: true },
    { id: 5, title: "Workout 5", image: "https://images.pexels.com/photos/3837464/pexels-photo-3837464.jpeg?auto=compress&cs=tinysrgb&w=600", duration: 45, style: 'Bodybuilding', muscleGroup: 'Shoulders', day: 'Friday', difficulty: 3, equipment: 'Dumbbell', description: "Isolate and build your deltoids for a broader, more defined look.", phases: [], isTemplate: true },
    { id: 6, title: "Workout 6", image: "https://images.pexels.com/photos/3289711/pexels-photo-3289711.jpeg?auto=compress&cs=tinysrgb&w=600", duration: 55, style: 'CrossFit', muscleGroup: 'Arms', day: 'Saturday', difficulty: 4, equipment: 'Kettlebell', description: "A challenging CrossFit WOD combining kettlebell movements and gymnastics.", phases: [], isTemplate: true },
    { id: 7, title: "Workout 7", image: "https://images.pexels.com/photos/4753997/pexels-photo-4753997.jpeg?auto=compress&cs=tinysrgb&w=600", duration: 75, style: 'Calisthenics', muscleGroup: 'Chest', day: 'Monday', difficulty: 3, equipment: 'Bodyweight', description: "Master your bodyweight with advanced push-up variations and dips.", phases: [], isTemplate: true },
    { id: 8, title: "Workout 8", image: "https://images.pexels.com/photos/28080/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600", duration: 60, style: 'HIIT', muscleGroup: 'Legs', day: 'Sunday', difficulty: 5, equipment: 'Dumbbell', description: "An explosive leg day HIIT workout to build power and shred fat.", phases: [], isTemplate: true },
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
        sharedPlans: [],
        sharedGoals: [],
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
        sharedPlans: [],
        sharedGoals: [],
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
        sharedPlans: [],
        sharedGoals: [],
        goals: [],
        workouts: [],
        meals: [],
    }
];

// For the "All Feed" tab, we just combine all posts from all communities.
export const ALL_POSTS_DATA = COMMUNITIES_DATA.flatMap(c => c.posts);