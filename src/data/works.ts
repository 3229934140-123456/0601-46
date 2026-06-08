import type { Work, ExportRecord, Comment, HistoryRecord } from '@/types/work';

export const draftWorks: Work[] = [
  {
    id: 'w1',
    title: '618活动主视觉',
    cover: 'https://picsum.photos/id/1/400/600',
    status: 'draft',
    size: '750×1334',
    updatedAt: '2024-06-08 14:30',
    createdAt: '2024-06-05 10:00',
    tags: ['618', '促销']
  },
  {
    id: 'w2',
    title: '新品发布海报',
    cover: 'https://picsum.photos/id/96/400/600',
    status: 'draft',
    size: '1080×1080',
    updatedAt: '2024-06-07 16:45',
    createdAt: '2024-06-03 09:30',
    tags: ['新品', '发布']
  },
  {
    id: 'w3',
    title: '品牌故事长图',
    cover: 'https://picsum.photos/id/1002/400/700',
    status: 'draft',
    size: '1080×1920',
    updatedAt: '2024-06-06 11:20',
    createdAt: '2024-06-01 14:00',
    tags: ['品牌', '故事']
  },
  {
    id: 'w4',
    title: '会员日活动图',
    cover: 'https://picsum.photos/id/1080/400/600',
    status: 'draft',
    size: '750×1334',
    updatedAt: '2024-06-05 09:15',
    createdAt: '2024-06-02 16:30',
    tags: ['会员', '活动']
  }
];

export const publishedWorks: Work[] = [
  {
    id: 'pw1',
    title: '端午节日海报',
    cover: 'https://picsum.photos/id/401/400/600',
    status: 'published',
    size: '1080×1440',
    updatedAt: '2024-06-03 18:00',
    createdAt: '2024-05-28 10:00',
    tags: ['端午', '节日']
  },
  {
    id: 'pw2',
    title: '产品详情页Banner',
    cover: 'https://picsum.photos/id/201/700/280',
    status: 'published',
    size: '750×300',
    updatedAt: '2024-06-02 15:30',
    createdAt: '2024-05-25 14:00',
    tags: ['产品', 'Banner']
  },
  {
    id: 'pw3',
    title: '618预热海报',
    cover: 'https://picsum.photos/id/1025/400/600',
    status: 'published',
    size: '750×1334',
    updatedAt: '2024-06-01 12:00',
    createdAt: '2024-05-20 09:00',
    tags: ['618', '预热']
  },
  {
    id: 'pw4',
    title: '品牌周年庆海报',
    cover: 'https://picsum.photos/id/1015/400/600',
    status: 'published',
    size: '750×1334',
    updatedAt: '2024-05-28 20:00',
    createdAt: '2024-05-15 11:00',
    tags: ['周年庆', '品牌']
  },
  {
    id: 'pw5',
    title: '年终总结长图',
    cover: 'https://picsum.photos/id/1019/400/700',
    status: 'published',
    size: '1080×1920',
    updatedAt: '2024-05-25 16:00',
    createdAt: '2024-05-10 13:00',
    tags: ['总结', '年度']
  },
  {
    id: 'pw6',
    title: '健身打卡海报',
    cover: 'https://picsum.photos/id/1060/400/600',
    status: 'published',
    size: '1080×1920',
    updatedAt: '2024-05-20 14:00',
    createdAt: '2024-05-05 10:00',
    tags: ['健身', '打卡']
  }
];

export const exportRecords: ExportRecord[] = [
  { id: 'e1', workId: 'pw1', workTitle: '端午节日海报', format: 'png', size: '1080×1440', exportAt: '2024-06-03 18:05', status: 'success' },
  { id: 'e2', workId: 'pw2', workTitle: '产品详情页Banner', format: 'jpg', size: '750×300', exportAt: '2024-06-02 15:35', status: 'success' },
  { id: 'e3', workId: 'pw3', workTitle: '618预热海报', format: 'longImage', size: '750×2668', exportAt: '2024-06-01 12:10', status: 'success' },
  { id: 'e4', workId: 'w1', workTitle: '618活动主视觉', format: 'png', size: '750×1334', exportAt: '2024-06-08 14:35', status: 'processing' },
  { id: 'e5', workId: 'pw4', workTitle: '品牌周年庆海报', format: 'pdf', size: '750×1334', exportAt: '2024-05-28 20:10', status: 'success' },
  { id: 'e6', workId: 'pw5', workTitle: '年终总结长图', format: 'longImage', size: '1080×3840', exportAt: '2024-05-25 16:05', status: 'success' }
];

export const comments: Comment[] = [
  { id: 'c1', workId: 'w1', userId: 'u1', userName: '张设计师', avatar: 'https://picsum.photos/id/177/100/100', content: '这个标题的字体可以再大一点吗？', createdAt: '2024-06-07 10:30', position: { x: 150, y: 200 } },
  { id: 'c2', workId: 'w1', userId: 'u2', userName: '李经理', avatar: 'https://picsum.photos/id/1027/100/100', content: '整体配色不错，保持品牌风格', createdAt: '2024-06-07 11:15', position: { x: 300, y: 400 } },
  { id: 'c3', workId: 'w1', userId: 'u3', userName: '王运营', avatar: 'https://picsum.photos/id/1012/100/100', content: '活动时间需要调整为6月18日', createdAt: '2024-06-07 14:20', position: { x: 200, y: 600 } },
  { id: 'c4', workId: 'w2', userId: 'u1', userName: '张设计师', avatar: 'https://picsum.photos/id/177/100/100', content: '产品图需要更换为最新版本', createdAt: '2024-06-06 09:45' }
];

export const historyRecords: HistoryRecord[] = [
  { id: 'h1', workId: 'w1', userId: 'u1', userName: '张设计师', action: '修改了标题文字', createdAt: '2024-06-08 14:30' },
  { id: 'h2', workId: 'w1', userId: 'u1', userName: '张设计师', action: '调整了背景图片位置', createdAt: '2024-06-08 14:15' },
  { id: 'h3', workId: 'w1', userId: 'u2', userName: '李经理', action: '添加了批注', createdAt: '2024-06-07 11:15' },
  { id: 'h4', workId: 'w1', userId: 'u1', userName: '张设计师', action: '创建了作品', createdAt: '2024-06-05 10:00' },
  { id: 'h5', workId: 'w2', userId: 'u3', userName: '王运营', action: '修改了产品图片', createdAt: '2024-06-07 16:45' }
];

export const allWorks = [...draftWorks, ...publishedWorks];
