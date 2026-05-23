export interface VideoStats {
  videoId: string
  title: string
  description: string
  thumbnail: string
  publishedAt: string
  views: number
  likes: number
  comments: number
  duration_seconds: number
  channelId: string
  channelTitle: string
  url: string
  defaultAudioLanguage?: string
  defaultLanguage?: string
}

export interface ChannelInfo {
  channelId: string
  title: string
  description: string
  subscriberCount: number
  videoCount: number
  viewCount: number
  thumbnail: string
  customUrl?: string
  uploadsPlaylistId: string
}

export interface ChannelBaseline {
  median: number
  mean: number
  considered_video_count: number
}

export interface OutlierVideo extends VideoStats {
  outlier_score: number
  velocity: number
  channel_subscribers?: number
  channel_median?: number
}

export interface QuotaStatus {
  keyIndex: number
  estimatedUsed: number
  estimatedRemaining: number
  exhausted: boolean
}

export type DiscoveryResponse = {
  channel?: ChannelInfo
  baseline?: ChannelBaseline
  videos: OutlierVideo[]
}
