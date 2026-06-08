export interface Material {
  id: string;
  name: string;
  cover: string;
  category: string;
  type: 'image' | 'sticker' | 'component' | 'illustration';
  tags: string[];
  isFavorite?: boolean;
}

export interface MaterialCategory {
  id: string;
  name: string;
  count: number;
}

export interface SavedComponent {
  id: string;
  name: string;
  cover: string;
  type: string;
  savedAt: string;
}
