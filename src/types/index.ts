export type Language = 'en' | 'ar';

export type TabType =
  | 'voice'
  | 'youtube'
  | 'videoPlan'
  | 'video-plan'
  | 'freelance'
  | 'chat'
  | 'image'
  | 'subscription'
  | 'gate';

export interface VoiceGenerationItem {
  id: string;
  text: string;
  voiceName: string;
  style: string;
  audioUrl: string;
  mimeType: string;
  charCount: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ImageGenerationItem {
  id: string;
  prompt: string;
  aspectRatio: string;
  style: string;
  imageUrl: string;
  createdAt: string;
}

export interface TrialState {
  isActive: boolean;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  planName: 'trial' | 'starter' | 'pro' | 'master';
  usage: {
    voiceGenerations: number;
    maxVoiceGenerations: number;
    imageGenerations: number;
    maxImageGenerations: number;
    chatMessages: number;
    maxChatMessages: number;
    videoPlans: number;
    maxVideoPlans: number;
  };
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
