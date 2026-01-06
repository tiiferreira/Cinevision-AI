export interface CommercialIdea {
  title: string;
  synopsis: string;
  visualHook: string;
}

export interface CineAnalysisResult {
  cinematicPrompt: string;
  cameraAngles: string[];
  lightingSuggestions: string[];
  commercialIdeas: CommercialIdea[];
}

export interface SceneJsonPrompt {
  positive: string;
  negative: string;
  camera: string;
  aspect_ratio: string;
}

export interface StoryboardScene {
  sceneHeader: string;
  visualDescription: string;
  shotType: string;
  jsonPrompt: SceneJsonPrompt;
}

export interface StoryboardResult {
  title: string;
  logline: string;
  scenes: StoryboardScene[];
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export type ActiveTab = 'image' | 'story';