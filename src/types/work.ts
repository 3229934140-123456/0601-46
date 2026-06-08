export interface Work {
  id: string;
  title: string;
  cover: string;
  status: 'draft' | 'published';
  size: string;
  updatedAt: string;
  createdAt: string;
  tags?: string[];
}

export interface ExportRecord {
  id: string;
  workId: string;
  workTitle: string;
  format: 'png' | 'jpg' | 'pdf' | 'longImage';
  size: string;
  exportAt: string;
  status: 'success' | 'processing' | 'failed';
}

export interface Comment {
  id: string;
  workId: string;
  userId: string;
  userName: string;
  avatar: string;
  content: string;
  createdAt: string;
  position?: { x: number; y: number };
}

export interface HistoryRecord {
  id: string;
  workId: string;
  userId: string;
  userName: string;
  action: string;
  createdAt: string;
}
