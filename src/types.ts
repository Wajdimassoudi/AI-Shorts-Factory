/**
 * AI Shorts Factory Shared Type Definitions
 */

export interface UserSession {
  token: string;
  admin: boolean;
}

export interface Niche {
  id: string;
  name: string;
  promptStyle: string;
  scheduleTime: string; // e.g. "12:00", "18:00"
  hashtags: string;
  affiliateTitle: string;
  affiliateLink: string;
  landingPageUrl: string;
}

export type VideoStatus = 'Idea' | 'Script' | 'Voice' | 'Video' | 'Subtitle' | 'Thumbnail' | 'Schedule' | 'Publish';

export interface VideoProject {
  id: string;
  title: string;
  nicheId: string;
  nicheName: string;
  language: string;
  tone: string;
  duration: number; // in seconds
  status: VideoStatus;
  progress: number; // 0 - 100
  // Script generated elements
  viralHook?: string;
  scriptText?: string;
  ctaText?: string;
  hashtags?: string;
  seoDescription?: string;
  // File attachments/mock URLs
  voiceUrl?: string;
  videoUrl?: string;
  imageUrl?: string; // thumbnail
  // Publishing metadata
  scheduledDate?: string; // e.g. "2026-05-23"
  scheduledTime?: string; // e.g. "15:30"
  platforms?: {
    tiktok: 'queued' | 'published' | 'failed' | 'none';
    youtube: 'queued' | 'published' | 'failed' | 'none';
    instagram: 'queued' | 'published' | 'failed' | 'none';
    facebook: 'queued' | 'published' | 'failed' | 'none';
  };
  retryCount?: number;
  lastError?: string;
  createdAt: string;
  publishedAt?: string;
  // Generated analytics
  stats?: {
    views: number;
    engagement: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
}

export interface SystemSettings {
  openaiApiKey: string;
  crayoApiKey: string;
  veoApiKey: string;
  youtubeApiKey: string;
  tiktokClientKey: string;
  tiktokClientSecret: string;
  instagramAppId: string;
  instagramAppSecret: string;
  fullAutoMode: boolean;
}

export interface AnalyticsSummary {
  viewsToday: number;
  viewsTotal: number;
  scheduledToday: number;
  publishedTotal: number;
  revenueTotal: number;
  affiliateClicks: number;
  affiliateConversions: number;
  estimatedRPM: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}
