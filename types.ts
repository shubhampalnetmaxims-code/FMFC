

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