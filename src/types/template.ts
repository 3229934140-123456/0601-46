export interface Template {
  id: string;
  title: string;
  cover: string;
  category: string;
  scene: string;
  size: string;
  width: number;
  height: number;
  tags: string[];
  usedCount: number;
  isNew?: boolean;
  isHot?: boolean;
}

export interface TemplateCategory {
  id: string;
  name: string;
  icon?: string;
}

export interface TemplateSize {
  id: string;
  name: string;
  width: number;
  height: number;
}

export type TemplateScene = 'marketing' | 'social' | 'poster' | 'banner' | 'card' | 'invitation';
