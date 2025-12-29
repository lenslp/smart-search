
export enum SearchType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

export enum TargetType {
  ALL = 'ALL',
  HUMAN = 'HUMAN',
  MOTOR = 'MOTOR',
  NON_MOTOR = 'NON_MOTOR'
}

export enum TaskStatus {
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

// Added CropType enum to fix missing export error in ManualCropModal.tsx
export enum CropType {
  FACE = 'FACE',
  BODY = 'BODY',
  CAR = 'CAR',
  NON_MOTOR = 'NON_MOTOR'
}

// Added SampleLabel type to fix missing export error in SearchResults.tsx
export type SampleLabel = 'positive' | 'negative' | 'none';

export interface Task {
  id: string;
  name: string;
  type: 'IMAGE_SEARCH' | 'VIDEO_ANALYSIS' | 'LOCAL_EXTRACT';
  status: TaskStatus;
  progress: number;
  duration: string;
  resultCount: number;
  createdAt: string;
  thumbnail: string;
}

export interface SearchParams {
  timeRange: '1d' | '3d' | '7d' | 'custom';
  spatialRange: string[];
  similarity: number;
  targetType: TargetType;
  microModel?: string;
  isLocalUpload?: boolean;
}
