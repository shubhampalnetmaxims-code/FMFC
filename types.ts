

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
  image: string;
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
}