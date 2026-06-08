import type { Material, MaterialCategory, SavedComponent } from '@/types/material';

export const materialCategories: MaterialCategory[] = [
  { id: 'all', name: '全部', count: 1256 },
  { id: 'image', name: '图片', count: 680 },
  { id: 'sticker', name: '贴纸', count: 320 },
  { id: 'illustration', name: '插画', count: 156 },
  { id: 'component', name: '组件', count: 100 }
];

export const imageMaterials: Material[] = [
  { id: 'img1', name: '商务办公场景', cover: 'https://picsum.photos/id/1/300/300', category: 'image', type: 'image', tags: ['商务', '办公', '职场'], isFavorite: true },
  { id: 'img2', name: '科技感背景', cover: 'https://picsum.photos/id/2/300/300', category: 'image', type: 'image', tags: ['科技', '背景', '未来'], isFavorite: false },
  { id: 'img3', name: '自然风景', cover: 'https://picsum.photos/id/1015/300/300', category: 'image', type: 'image', tags: ['自然', '风景', '山水'], isFavorite: true },
  { id: 'img4', name: '城市建筑', cover: 'https://picsum.photos/id/1067/300/300', category: 'image', type: 'image', tags: ['城市', '建筑', '现代'], isFavorite: false },
  { id: 'img5', name: '美食特写', cover: 'https://picsum.photos/id/312/300/300', category: 'image', type: 'image', tags: ['美食', '餐饮', '特写'], isFavorite: false },
  { id: 'img6', name: '人物肖像', cover: 'https://picsum.photos/id/177/300/300', category: 'image', type: 'image', tags: ['人物', '肖像', '时尚'], isFavorite: true },
  { id: 'img7', name: '抽象艺术', cover: 'https://picsum.photos/id/1039/300/300', category: 'image', type: 'image', tags: ['抽象', '艺术', '创意'], isFavorite: false },
  { id: 'img8', name: '植物花卉', cover: 'https://picsum.photos/id/106/300/300', category: 'image', type: 'image', tags: ['植物', '花卉', '自然'], isFavorite: false },
  { id: 'img9', name: '数码产品', cover: 'https://picsum.photos/id/96/300/300', category: 'image', type: 'image', tags: ['数码', '产品', '科技'], isFavorite: true },
  { id: 'img10', name: '运动健身', cover: 'https://picsum.photos/id/1060/300/300', category: 'image', type: 'image', tags: ['运动', '健身', '活力'], isFavorite: false },
  { id: 'img11', name: '旅行风景', cover: 'https://picsum.photos/id/1036/300/300', category: 'image', type: 'image', tags: ['旅行', '风景', '度假'], isFavorite: false },
  { id: 'img12', name: '家居生活', cover: 'https://picsum.photos/id/1048/300/300', category: 'image', type: 'image', tags: ['家居', '生活', '温馨'], isFavorite: false }
];

export const stickerMaterials: Material[] = [
  { id: 'stk1', name: '促销标签', cover: 'https://picsum.photos/id/100/200/200', category: 'sticker', type: 'sticker', tags: ['促销', '标签', '电商'], isFavorite: true },
  { id: 'stk2', name: '装饰边框', cover: 'https://picsum.photos/id/101/200/200', category: 'sticker', type: 'sticker', tags: ['边框', '装饰', '相框'], isFavorite: false },
  { id: 'stk3', name: '表情贴纸', cover: 'https://picsum.photos/id/102/200/200', category: 'sticker', type: 'sticker', tags: ['表情', 'emoji', '可爱'], isFavorite: false },
  { id: 'stk4', name: '箭头标注', cover: 'https://picsum.photos/id/103/200/200', category: 'sticker', type: 'sticker', tags: ['箭头', '标注', '指引'], isFavorite: true },
  { id: 'stk5', name: '节日元素', cover: 'https://picsum.photos/id/104/200/200', category: 'sticker', type: 'sticker', tags: ['节日', '装饰', '庆祝'], isFavorite: false },
  { id: 'stk6', name: '几何图形', cover: 'https://picsum.photos/id/105/200/200', category: 'sticker', type: 'sticker', tags: ['几何', '图形', '简约'], isFavorite: false },
  { id: 'stk7', name: '气泡对话框', cover: 'https://picsum.photos/id/107/200/200', category: 'sticker', type: 'sticker', tags: ['气泡', '对话', '文字框'], isFavorite: false },
  { id: 'stk8', name: '手绘装饰', cover: 'https://picsum.photos/id/108/200/200', category: 'sticker', type: 'sticker', tags: ['手绘', '装饰', '文艺'], isFavorite: true }
];

export const illustrationMaterials: Material[] = [
  { id: 'ill1', name: '商务人物插画', cover: 'https://picsum.photos/id/110/300/300', category: 'illustration', type: 'illustration', tags: ['商务', '人物', '插画'], isFavorite: false },
  { id: 'ill2', name: '场景概念插画', cover: 'https://picsum.photos/id/111/300/300', category: 'illustration', type: 'illustration', tags: ['场景', '概念', '创意'], isFavorite: true },
  { id: 'ill3', name: '扁平化图标组', cover: 'https://picsum.photos/id/112/300/300', category: 'illustration', type: 'illustration', tags: ['扁平', '图标', 'UI'], isFavorite: false },
  { id: 'ill4', name: '渐变色块插画', cover: 'https://picsum.photos/id/113/300/300', category: 'illustration', type: 'illustration', tags: ['渐变', '色块', '现代'], isFavorite: false },
  { id: 'ill5', name: '线条艺术插画', cover: 'https://picsum.photos/id/114/300/300', category: 'illustration', type: 'illustration', tags: ['线条', '艺术', '简约'], isFavorite: false },
  { id: 'ill6', name: '3D立体插画', cover: 'https://picsum.photos/id/115/300/300', category: 'illustration', type: 'illustration', tags: ['3D', '立体', '新潮'], isFavorite: true }
];

export const savedComponents: SavedComponent[] = [
  { id: 'comp1', name: '品牌标题组件', cover: 'https://picsum.photos/id/119/200/120', type: 'text', savedAt: '2024-01-15' },
  { id: 'comp2', name: '价格标签', cover: 'https://picsum.photos/id/225/200/120', type: 'sticker', savedAt: '2024-01-10' },
  { id: 'comp3', name: '品牌Logo组合', cover: 'https://picsum.photos/id/230/200/120', type: 'image', savedAt: '2024-01-05' },
  { id: 'comp4', name: '活动按钮', cover: 'https://picsum.photos/id/250/200/120', type: 'shape', savedAt: '2023-12-28' },
  { id: 'comp5', name: '分割线装饰', cover: 'https://picsum.photos/id/292/200/120', type: 'decoration', savedAt: '2023-12-20' },
  { id: 'comp6', name: '二维码区域', cover: 'https://picsum.photos/id/401/200/120', type: 'code', savedAt: '2023-12-15' }
];

export const allMaterials: Material[] = [
  ...imageMaterials,
  ...stickerMaterials,
  ...illustrationMaterials
];
