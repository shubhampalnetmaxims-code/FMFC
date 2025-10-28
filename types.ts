


export type UserRole = 'customer' | 'admin';

export interface User {
  id: number;
  name: string;
  avatar: string;
  role?: UserRole;
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
  likes: number;
  commentCount: number;
  comments: Comment[];
  description: string;
  hashtags: string[];
}

export type NavItemType = 'Community' | 'Session' | 'Goals' | 'Workouts' | 'Profile';

export interface Reaction {
  emoji: string;
  user: User;
}

export interface ChatMessage {
  id: number;
  user: User;
  text: string;
  timestamp: string;
  reactions: Reaction[];
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  notes?: string;
  // FIX: Added optional 'toUserId' property to support targeted admin replies in support channels, resolving a type error in SupportAdminView.tsx.
  toUserId?: number;
}

export type ChannelType = 'posts' | 'chat' | 'members' | 'admin-only';

export interface Channel {
  id: number;
  name: string;
  type: ChannelType;
  isPrivate?: boolean;
}

export interface File {
  id: number;
  name: string;
  url: string; // This would be a URL to the file storage
  size: string;
  type: 'PDF' | 'DOCX' | 'PNG' | 'JPG' | 'XLSX';
}

export interface Goal {
  id: number;
  title: string;
  description: string;
  target: string;
  isCompleted: boolean;
}

export interface Workout {
    id: number;
    name: string;
    description: string;
    type: 'Cardio' | 'Strength' | 'Flexibility' | 'HIIT' | 'Other';
    duration: number; // in minutes
    videoUrl?: string;
    imageUrl?: string;
}

export interface Meal {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface Community {
  id: number;
  name: string;
  description?: string;
  isPrivate?: boolean;
  adminId: number;
  members: User[];
  channels: Channel[];
  posts: Post[];
  chatMessages: ChatMessage[];
  files?: File[];
  goals?: Goal[];
  workouts?: Workout[];
  meals?: Meal[];
}

// --- Nutrition Plan Types ---

export interface FoodItem {
  name: string;
  quantity: number;
  calories: number;
}

export interface MealEntry {
  mealTime: string; // 'M1', 'M2', 'Breakfast', etc.
  items: FoodItem[];
}

export interface NutritionTotals {
  energy: number; // Cal
  carbohydrates: number; // g
  proteins: number; // g
  fats: number; // g
  fibre: number; // g
  water: number; // mL
}

export interface NutritionPlan {
  id: number;
  name:string;
  description: string;
  isTemplate: boolean;
  isActive: boolean;
  notes: string;
  totals: NutritionTotals;
  content: MealEntry[];
}

// --- Food Search and Diet Intake Types ---
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

export interface DietIntakeItem {
  id: string;
  description: string;
  meal: string;
  date: string; // YYYY-MM-DD
  quantity: number;
  energy: number;
  carbohydrates: number;
  proteins: number;
  fats: number;
  fibre: number;
  water: number;
}

// --- Profile Page Types ---
export interface UserPhoto {
  id: string;
  src: string;
  type: string;
  date: string;
  description: string;
}

export interface UserNote {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
}

export interface UserMeasurement {
  id: string;
  date: string; // YYYY-MM-DD
  weight?: number;
  height?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  neck?: number;
  thigh?: number;
  biceps?: number;
  triceps?: number;
  subscapular?: number;
  suprailiac?: number;
  bodyfat?: number;
}
