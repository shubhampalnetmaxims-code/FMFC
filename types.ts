

// FIX: Replaced entire file content with proper type definitions and exports to resolve circular dependencies and missing type errors across the application.

export type NavItemType = 'Community' | 'Session' | 'Goals' | 'Workouts' | 'Profile';

export type UserRole = 'customer' | 'admin';

export interface User {
    id: number;
    name: string;
    avatar: string;
    role?: UserRole;
}

export interface File {
    id: number;
    name: string;
    url: string;
    size: string;
    type: string;
}

export type NotificationType = 'community' | 'goal' | 'mention' | 'like';

export interface Notification {
    id: number;
    type: NotificationType;
    text: string;
    timestamp: string;
    isRead: boolean;
}

export interface NutritionTotals {
    energy: number;
    carbohydrates: number;
    proteins: number;
    fats: number;
    fibre: number;
    water: number;
    vitaminA?: number;
    vitaminC?: number;
    calcium?: number;
    iron?: number;
}

export interface FoodItem {
    id: string;
    name: string;
    quantity: number;
    calories: number;
    carbohydrates?: number;
    proteins?: number;
    fats?: number;
    fibre?: number;
    water?: number;
    vitaminA?: number;
    vitaminC?: number;
    calcium?: number;
    iron?: number;
}

export interface MealEntry {
    mealTime: string;
    items: FoodItem[];
}

export interface NutritionPlan {
    id: number;
    name: string;
    description: string;
    isTemplate: boolean;
    isActive: boolean;
    notes: string;
    totals: NutritionTotals;
    content: MealEntry[];
}

export interface ChallengeTask {
    id: string;
    title: string;
    type: 'auto' | 'manual';
    frequency: 'daily' | 'weekly';
    category: 'Nutrition' | 'Activity' | 'Progress' | 'Mindfulness';
    autoCheckCondition?: string;
    repeatDays?: string[];
}

export type ChannelType = 'posts' | 'chat' | 'members' | 'admin-only';

export interface Channel {
    id: number;
    name: string;
    type: ChannelType;
    isPrivate?: boolean;
}

export interface Comment {
    user: User;
    text: string;
}

export interface Post {
    id: number;
    user: User;
    communityId: number;
    channelId: number;
    image?: string;
    video?: string;
    description: string;
    hashtags: string[];
    likes: number;
    commentCount: number;
    comments: Comment[];
}

export interface ChatMessage {
    id: number;
    user: User;
    text: string;
    timestamp: string;
    reactions: { emoji: string; user: User }[];
    toUserId?: number;
    notes?: string;
    imageUrl?: string;
    workout?: Workout;
}

export interface SharedGoal {
    id: number;
    user: User;
    date: string;
    tasks: ChallengeTask[];
    completedDaily: Set<string>;
    completedWeekly: Set<string>;
}

export interface Community {
    id: number;
    name: string;
    description: string;
    isPrivate: boolean;
    adminId: number;
    members: User[];
    channels: Channel[];
    posts: Post[];
    chatMessages: ChatMessage[];
    files?: File[];
    sharedPlans?: NutritionPlan[];
    sharedGoals?: SharedGoal[];
    goals?: any[];
    workouts?: Workout[];
    meals?: any[];
}

export interface DietIntakeItem {
    id: string;
    description: string;
    meal: string;
    date: string;
    quantity: number;
    energy: number;
    carbohydrates: number;
    proteins: number;
    fats: number;
    fibre: number;
    water: number;
    vitaminA?: number;
    vitaminC?: number;
    calcium?: number;
    iron?: number;
}

export interface UserNote {
    id: string;
    date: string;
    content: string;
}

export interface UserMeasurement {
    id: string;
    date: string;
    weight?: number;
    height?: number;
    chest?: number;
    waist?: number;
    bodyfat?: number;
    hips?: number;
    neck?: number;
    thigh?: number;
    biceps?: number;
    triceps?: number;
    subscapular?: number;
    suprailiac?: number;
}

export interface UserPhoto {
    id: string;
    src: string;
    type: string;
    date: string;
    description: string;
}

export interface FoodMeasure {
    name: string;
    grams: number;
}

export interface FoodSearchItem {
    id: number;
    description: string;
    nutrients_per_100g: NutritionTotals;
    measures: FoodMeasure[];
}

export interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
}

// --- WORKOUTS ---
export type WorkoutStyle = 'Calisthenics' | 'Bodybuilding' | 'CrossFit' | 'Powerlifting' | 'HIIT';
export type MuscleGroup = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core';
export type WorkoutDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export type Equipment = 'Dumbbell' | 'Barbell' | 'Kettlebell' | 'Bodyweight' | 'Machine';

export interface Exercise {
    id: string;
    name: string;
    image: string;
    videoUrl?: string;
    steps?: string[];
    benefits?: string[];
}

export interface ExerciseSet {
    id: string;
    name: string;
    reps: number;
    duration: number; // in mins
    exercises: Exercise[];
}

export interface WorkoutPhase {
    id: string;
    name: string;
    sets: ExerciseSet[];
}

export interface Workout {
    id: number;
    title: string;
    image: string;
    duration: number; // in minutes
    style: WorkoutStyle;
    muscleGroup: MuscleGroup;
    day: WorkoutDay;
    difficulty: 1 | 2 | 3 | 4 | 5;
    equipment: Equipment;
    description: string;
    phases: WorkoutPhase[];
    isTemplate?: boolean;
}