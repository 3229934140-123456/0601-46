import type { Template, TemplateCategory, TemplateSize } from '@/types/template';

export const templateCategories: TemplateCategory[] = [
  { id: 'all', name: '全部' },
  { id: 'marketing', name: '营销推广' },
  { id: 'social', name: '社交媒体' },
  { id: 'poster', name: '海报宣传' },
  { id: 'banner', name: 'Banner' },
  { id: 'card', name: '卡片贺卡' },
  { id: 'invitation', name: '邀请函' },
  { id: 'ecommerce', name: '电商详情' }
];

export const templateSizes: TemplateSize[] = [
  { id: 'all', name: '全部尺寸', width: 0, height: 0 },
  { id: '1080x1920', name: '手机全屏', width: 1080, height: 1920 },
  { id: '1080x1080', name: '正方形', width: 1080, height: 1080 },
  { id: '750x1334', name: '海报', width: 750, height: 1334 },
  { id: '750x300', name: 'Banner', width: 750, height: 300 },
  { id: '1242x2208', name: 'iPhone Plus', width: 1242, height: 2208 },
  { id: '1080x1440', name: '小红书', width: 1080, height: 1440 }
];

export const templates: Template[] = [
  {
    id: 't1',
    title: '618大促活动海报',
    cover: 'https://picsum.photos/id/1025/400/600',
    category: 'marketing',
    scene: '促销活动',
    size: '750x1334',
    width: 750,
    height: 1334,
    tags: ['618', '促销', '电商'],
    usedCount: 2345,
    isHot: true
  },
  {
    id: 't2',
    title: '新品发布宣传图',
    cover: 'https://picsum.photos/id/96/400/600',
    category: 'marketing',
    scene: '新品发布',
    size: '1080x1080',
    width: 1080,
    height: 1080,
    tags: ['新品', '科技', '简约'],
    usedCount: 1890,
    isNew: true
  },
  {
    id: 't3',
    title: '品牌故事长图',
    cover: 'https://picsum.photos/id/1002/400/700',
    category: 'social',
    scene: '品牌故事',
    size: '1080x1920',
    width: 1080,
    height: 1920,
    tags: ['品牌', '故事', '长图'],
    usedCount: 1567
  },
  {
    id: 't4',
    title: '节日祝福贺卡',
    cover: 'https://picsum.photos/id/401/400/560',
    category: 'card',
    scene: '节日祝福',
    size: '1080x1440',
    width: 1080,
    height: 1440,
    tags: ['节日', '祝福', '温馨'],
    usedCount: 3200,
    isHot: true
  },
  {
    id: 't5',
    title: '活动邀请函',
    cover: 'https://picsum.photos/id/225/400/600',
    category: 'invitation',
    scene: '活动邀请',
    size: '750x1334',
    width: 750,
    height: 1334,
    tags: ['邀请', '高端', '商务'],
    usedCount: 890,
    isNew: true
  },
  {
    id: 't6',
    title: '电商产品Banner',
    cover: 'https://picsum.photos/id/201/700/280',
    category: 'banner',
    scene: '电商推广',
    size: '750x300',
    width: 750,
    height: 300,
    tags: ['电商', 'Banner', '产品'],
    usedCount: 4500,
    isHot: true
  },
  {
    id: 't7',
    title: '会员专享海报',
    cover: 'https://picsum.photos/id/1080/400/600',
    category: 'poster',
    scene: '会员活动',
    size: '750x1334',
    width: 750,
    height: 1334,
    tags: ['会员', '专享', 'VIP'],
    usedCount: 1234
  },
  {
    id: 't8',
    title: '年终总结长图',
    cover: 'https://picsum.photos/id/1019/400/700',
    category: 'social',
    scene: '年度总结',
    size: '1080x1920',
    width: 1080,
    height: 1920,
    tags: ['年终', '总结', '数据'],
    usedCount: 2100,
    isHot: true
  },
  {
    id: 't9',
    title: '美食宣传卡片',
    cover: 'https://picsum.photos/id/292/400/400',
    category: 'social',
    scene: '美食推广',
    size: '1080x1080',
    width: 1080,
    height: 1080,
    tags: ['美食', '餐饮', '推广'],
    usedCount: 1678
  },
  {
    id: 't10',
    title: '教育培训海报',
    cover: 'https://picsum.photos/id/20/400/600',
    category: 'poster',
    scene: '教育招生',
    size: '750x1334',
    width: 750,
    height: 1334,
    tags: ['教育', '培训', '招生'],
    usedCount: 987
  },
  {
    id: 't11',
    title: '健身运动打卡',
    cover: 'https://picsum.photos/id/1060/400/600',
    category: 'social',
    scene: '运动健身',
    size: '1080x1920',
    width: 1080,
    height: 1920,
    tags: ['健身', '运动', '打卡'],
    usedCount: 3456,
    isHot: true
  },
  {
    id: 't12',
    title: '旅行风景分享',
    cover: 'https://picsum.photos/id/1036/400/600',
    category: 'social',
    scene: '旅行分享',
    size: '1080x1440',
    width: 1080,
    height: 1440,
    tags: ['旅行', '风景', '分享'],
    usedCount: 2890,
    isNew: true
  }
];

export const hotTemplates = templates.filter(t => t.isHot);
export const newTemplates = templates.filter(t => t.isNew);
