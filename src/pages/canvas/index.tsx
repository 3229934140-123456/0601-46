import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, Image, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import styles from './index.module.scss';
import { imageMaterials } from '@/data/materials';

interface Layer {
  id: string;
  name: string;
  type: 'text' | 'image' | 'shape' | 'sticker';
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right';
  opacity: number;
  rotation: number;
  shadow: boolean;
  visible: boolean;
  locked: boolean;
  zIndex: number;
  cropX?: number;
  cropY?: number;
  cropScale?: number;
}

interface HistoryState {
  layers: Layer[];
  selectedElementId: string | null;
  layerCounter: number;
}

const defaultLayers: Layer[] = [
  {
    id: 'bg1',
    name: '背景图',
    type: 'image',
    x: 50,
    y: 50,
    width: 100,
    height: 100,
    content: 'https://picsum.photos/id/1025/600/800',
    opacity: 1,
    rotation: 0,
    shadow: false,
    visible: true,
    locked: true,
    zIndex: 0,
    cropX: 0,
    cropY: 0,
    cropScale: 1
  },
  {
    id: 'text1',
    name: '主标题',
    type: 'text',
    x: 50,
    y: 25,
    width: 80,
    height: 12,
    content: '618 大促狂欢',
    fontSize: 36,
    color: '#ffffff',
    fontFamily: 'default',
    textAlign: 'center',
    opacity: 1,
    rotation: 0,
    shadow: true,
    visible: true,
    locked: false,
    zIndex: 2
  },
  {
    id: 'text2',
    name: '副标题',
    type: 'text',
    x: 50,
    y: 38,
    width: 70,
    height: 8,
    content: '全场5折起 · 限时抢购',
    fontSize: 18,
    color: '#ffffff',
    fontFamily: 'default',
    textAlign: 'center',
    opacity: 0.9,
    rotation: 0,
    shadow: true,
    visible: true,
    locked: false,
    zIndex: 1
  },
  {
    id: 'sticker1',
    name: '装饰贴纸',
    type: 'sticker',
    x: 80,
    y: 15,
    width: 15,
    height: 15,
    content: '🎊',
    opacity: 1,
    rotation: 15,
    shadow: false,
    visible: true,
    locked: false,
    zIndex: 3
  }
];

const CanvasPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('add');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [showMaterialPicker, setShowMaterialPicker] = useState(false);
  const [pickerType, setPickerType] = useState<'image' | 'sticker'>('image');
  const [pickerMode, setPickerMode] = useState<'add' | 'replace'>('add');
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(0);
  const [brandFont, setBrandFont] = useState('default');
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingTextValue, setEditingTextValue] = useState('');
  const layerCounterRef = useRef(10);

  const historyStackRef = useRef<HistoryState[]>([]);
  const historyIndexRef = useRef(-1);
  const isRestoringRef = useRef(false);

  const [layers, setLayers] = useState<Layer[]>([...defaultLayers]);

  useEffect(() => {
    loadWorkFromStorage();
  }, []);

  const loadWorkFromStorage = async () => {
    try {
      const res = await Taro.getStorage({ key: 'current_edit_work_id' }).catch(() => ({ data: null }));
      const workId = res.data;

      if (workId) {
        await loadDraftWork(workId);
        await Taro.removeStorage({ key: 'current_edit_work_id' }).catch(() => {});
      } else {
        saveToHistory();
      }
    } catch (e) {
      console.error('[Canvas] 加载作品失败:', e);
      saveToHistory();
    }
  };

  const selectedLayer = layers.find(l => l.id === selectedElementId);
  const isLayerLocked = selectedLayer?.locked || false;

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyStackRef.current.length - 1;

  const sortedLayers = useMemo(() =>
    [...layers].sort((a, b) => b.zIndex - a.zIndex),
    [layers]
  );

  const maxZIndex = useMemo(() =>
    Math.max(...layers.map(l => l.zIndex)),
    [layers]
  );

  const brandColors = [
    { name: '品牌紫', colors: ['#7B61FF', '#9B85FF', '#5A45E0'], textColor: '#ffffff' },
    { name: '活力橙', colors: ['#FF7D00', '#FFA94D', '#E66A00'], textColor: '#ffffff' }
  ];

  const colorPalette = [
    '#ffffff', '#000000', '#7B61FF', '#FF6B9D',
    '#30D158', '#FF9F0A', '#FF453A', '#0E42D2',
    '#86909C', '#4E5969', '#FFD700', '#00CED1'
  ];

  const fonts = [
    { id: 'default', name: '默认字体' },
    { id: 'bold', name: '粗黑体' },
    { id: 'song', name: '宋体' },
    { id: 'kai', name: '楷体' },
    { id: 'round', name: '圆体' },
    { id: 'art', name: '艺术体' }
  ];

  const stickerEmojis = ['🎊', '🎉', '✨', '⭐', '💫', '🌟', '🎈', '🎁', '💎', '🌸', '🌺', '🌻'];

  const saveToHistory = () => {
    if (isRestoringRef.current) return;

    const state: HistoryState = {
      layers: JSON.parse(JSON.stringify(layers)),
      selectedElementId,
      layerCounter: layerCounterRef.current
    };

    if (historyIndexRef.current < historyStackRef.current.length - 1) {
      historyStackRef.current = historyStackRef.current.slice(0, historyIndexRef.current + 1);
    }

    historyStackRef.current.push(state);
    historyIndexRef.current = historyStackRef.current.length - 1;

    if (historyStackRef.current.length > 50) {
      historyStackRef.current.shift();
      historyIndexRef.current -= 1;
    }
  };

  const restoreFromHistory = (index: number) => {
    if (index < 0 || index >= historyStackRef.current.length) return;

    isRestoringRef.current = true;
    const state = historyStackRef.current[index];
    setLayers(JSON.parse(JSON.stringify(state.layers)));
    setSelectedElementId(state.selectedElementId);
    layerCounterRef.current = state.layerCounter;
    historyIndexRef.current = index;
    isRestoringRef.current = false;
  };

  const handleUndo = () => {
    if (!canUndo) return;
    restoreFromHistory(historyIndexRef.current - 1);
  };

  const handleRedo = () => {
    if (!canRedo) return;
    restoreFromHistory(historyIndexRef.current + 1);
  };

  const getNewLayerId = () => {
    const newId = `layer_${layerCounterRef.current}`;
    layerCounterRef.current += 1;
    return newId;
  };

  const loadDraftWork = async (workId: string) => {
    try {
      const storageKey = 'draft_works';
      const res = await Taro.getStorage({ key: storageKey }).catch(() => ({ data: [] }));
      const works = res.data || [];
      const work = works.find((w: any) => w.id === workId);

      if (work && work.canvasData) {
        isRestoringRef.current = true;
        setLayers(work.canvasData.layers || [...defaultLayers]);
        layerCounterRef.current = work.canvasData.layerCounter || 10;
        setSelectedElementId(null);
        isRestoringRef.current = false;
        saveToHistory();
      }
    } catch (e) {
      console.error('[Canvas] 加载草稿失败:', e);
    }
  };

  const handleSave = () => {
    console.log('[Canvas] 保存草稿');

    const canvasData = {
      layers: JSON.parse(JSON.stringify(layers)),
      layerCounter: layerCounterRef.current,
      selectedElementId
    };

    const workData = {
      id: 'work_' + Date.now(),
      title: '618活动主视觉',
      cover: layers.find(l => l.type === 'image')?.content || '',
      status: 'draft',
      size: '750×1334',
      updatedAt: new Date().toLocaleString('zh-CN'),
      createdAt: new Date().toLocaleString('zh-CN'),
      canvasData
    };

    try {
      const savedWorks = Taro.getStorageSync('draft_works') || [];
      savedWorks.unshift(workData);
      Taro.setStorageSync('draft_works', savedWorks);
    } catch (e) {
      console.error('[Canvas] 保存失败:', e);
    }

    Taro.showToast({
      title: '已保存到草稿',
      icon: 'success'
    });
  };

  const handleExport = () => {
    console.log('[Canvas] 导出');
    Taro.navigateTo({
      url: '/pages/export/index'
    });
  };

  const handleElementClick = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (!layer || !layer.visible) return;

    if (layer.locked && layer.id !== 'bg1') {
      Taro.showToast({
        title: '该元素已锁定',
        icon: 'none'
      });
      return;
    }

    if (editingTextId && editingTextId !== layerId) {
      setEditingTextId(null);
    }

    setSelectedElementId(layerId);
  };

  const handleCanvasClick = () => {
    setSelectedElementId(null);
    setEditingTextId(null);
  };

  const handleTextDoubleClick = (layer: Layer) => {
    if (layer.locked) return;
    setEditingTextId(layer.id);
    setEditingTextValue(layer.content);
  };

  const handleTextContentChange = (value: string) => {
    setEditingTextValue(value);
  };

  const handleTextContentConfirm = () => {
    if (!editingTextId) return;

    const newContent = editingTextValue || '文字';
    const shortName = newContent.slice(0, 8) + (newContent.length > 8 ? '...' : '');

    setLayers(prev =>
      prev.map(l =>
        l.id === editingTextId
          ? { ...l, content: newContent, name: shortName }
          : l
      )
    );

    setEditingTextId(null);
    saveToHistory();
  };

  const handleColorChange = (color: string) => {
    if (!selectedElementId || isLayerLocked) return;
    setLayers(prev =>
      prev.map(l =>
        l.id === selectedElementId ? { ...l, color } : l
      )
    );
    saveToHistory();
  };

  const handleOpacityChange = (opacity: number) => {
    if (!selectedElementId || isLayerLocked) return;
    setLayers(prev =>
      prev.map(l =>
        l.id === selectedElementId ? { ...l, opacity } : l
      )
    );
  };

  const handleOpacityChangeEnd = () => {
    if (!selectedElementId || isLayerLocked) return;
    saveToHistory();
  };

  const handleToggleShadow = () => {
    if (!selectedElementId || isLayerLocked) return;
    setLayers(prev =>
      prev.map(l =>
        l.id === selectedElementId ? { ...l, shadow: !l.shadow } : l
      )
    );
    saveToHistory();
  };

  const handleTextAlignChange = (align: 'left' | 'center' | 'right') => {
    if (!selectedElementId || isLayerLocked) return;
    setLayers(prev =>
      prev.map(l =>
        l.id === selectedElementId ? { ...l, textAlign: align } : l
      )
    );
    saveToHistory();
  };

  const handleFontChange = (fontId: string) => {
    if (!selectedElementId || isLayerLocked) return;
    setLayers(prev =>
      prev.map(l =>
        l.id === selectedElementId ? { ...l, fontFamily: fontId } : l
      )
    );
    setBrandFont(fontId);
    saveToHistory();
  };

  const handleToggleVisibility = (layerId: string) => {
    setLayers(prev =>
      prev.map(l =>
        l.id === layerId ? { ...l, visible: !l.visible } : l
      )
    );
    saveToHistory();
  };

  const handleToggleLock = (layerId: string) => {
    if (layerId === 'bg1') {
      Taro.showToast({ title: '背景层不能解锁', icon: 'none' });
      return;
    }
    setLayers(prev =>
      prev.map(l =>
        l.id === layerId ? { ...l, locked: !l.locked } : l
      )
    );
    saveToHistory();
  };

  const handleMoveLayer = (layerId: string, direction: 'up' | 'down') => {
    const layer = layers.find(l => l.id === layerId);
    if (layer?.locked) {
      Taro.showToast({ title: '锁定图层不能移动层级', icon: 'none' });
      return;
    }

    const unsorted = layers.filter(l => !l.locked).sort((a, b) => b.zIndex - a.zIndex);
    const currentIndex = unsorted.findIndex(l => l.id === layerId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= unsorted.length) return;

    const targetLayer = unsorted[targetIndex];
    if (!targetLayer) return;

    setLayers(prev => {
      const current = prev.find(ll => ll.id === layerId);
      const target = prev.find(ll => ll.id === targetLayer.id);
      if (!current || !target) return prev;

      return prev.map(l => {
        if (l.id === layerId) return { ...l, zIndex: target.zIndex };
        if (l.id === targetLayer.id) return { ...l, zIndex: current.zIndex };
        return l;
      });
    });
    saveToHistory();
  };

  const handleDeleteLayer = (layerId: string) => {
    if (layerId === 'bg1') {
      Taro.showToast({ title: '背景层不能删除', icon: 'none' });
      return;
    }
    const layer = layers.find(l => l.id === layerId);
    if (layer?.locked) {
      Taro.showToast({ title: '已锁定，不能删除', icon: 'none' });
      return;
    }
    setLayers(prev => prev.filter(l => l.id !== layerId));
    if (selectedElementId === layerId) {
      setSelectedElementId(null);
    }
    saveToHistory();
  };

  const handleApplyBrand = (brandIndex: number) => {
    setSelectedBrand(brandIndex);
    const brand = brandColors[brandIndex];

    setLayers(prev =>
      prev.map(l => {
        if (l.type === 'text' && !l.locked) {
          return { ...l, color: brand.textColor, fontFamily: brandFont };
        }
        return l;
      })
    );
    saveToHistory();

    Taro.showToast({
      title: '已应用品牌风格',
      icon: 'success'
    });
  };

  const handleBrandFontChange = (fontId: string) => {
    setBrandFont(fontId);
    if (selectedElementId && selectedLayer?.type === 'text' && !selectedLayer.locked) {
      setLayers(prev =>
        prev.map(l =>
          l.id === selectedElementId ? { ...l, fontFamily: fontId } : l
        )
      );
      saveToHistory();
    }
  };

  const handleAddText = () => {
    const newId = getNewLayerId();
    const newLayer: Layer = {
      id: newId,
      name: '新文字',
      type: 'text',
      x: 50,
      y: 50,
      width: 60,
      height: 10,
      content: '双击编辑文字',
      fontSize: 24,
      color: '#ffffff',
      fontFamily: brandFont,
      textAlign: 'center',
      opacity: 1,
      rotation: 0,
      shadow: false,
      visible: true,
      locked: false,
      zIndex: maxZIndex + 1
    };
    setLayers(prev => [...prev, newLayer]);
    setSelectedElementId(newId);
    setActiveTab('properties');
    saveToHistory();
  };

  const handleAddSticker = () => {
    setPickerType('sticker');
    setPickerMode('add');
    setShowMaterialPicker(true);
  };

  const handleAddImage = () => {
    setPickerType('image');
    setPickerMode('add');
    setShowMaterialPicker(true);
  };

  const handleSelectSticker = (emoji: string) => {
    if (pickerMode === 'replace') return;
    const newId = getNewLayerId();
    const newLayer: Layer = {
      id: newId,
      name: '贴纸',
      type: 'sticker',
      x: 50,
      y: 50,
      width: 15,
      height: 15,
      content: emoji,
      opacity: 1,
      rotation: 0,
      shadow: false,
      visible: true,
      locked: false,
      zIndex: maxZIndex + 1
    };
    setLayers(prev => [...prev, newLayer]);
    setSelectedElementId(newId);
    setShowMaterialPicker(false);
    setActiveTab('properties');
    saveToHistory();
  };

  const handleSelectImage = (imageUrl: string) => {
    if (pickerMode === 'replace') return;
    const newId = getNewLayerId();
    const newLayer: Layer = {
      id: newId,
      name: '图片',
      type: 'image',
      x: 50,
      y: 50,
      width: 60,
      height: 45,
      content: imageUrl,
      opacity: 1,
      rotation: 0,
      shadow: false,
      visible: true,
      locked: false,
      zIndex: maxZIndex + 1,
      cropX: 0,
      cropY: 0,
      cropScale: 1
    };
    setLayers(prev => [...prev, newLayer]);
    setSelectedElementId(newId);
    setShowMaterialPicker(false);
    setActiveTab('properties');
    saveToHistory();
  };

  const handleReplaceImage = () => {
    if (!selectedElementId || selectedLayer?.type !== 'image' || isLayerLocked) return;
    setPickerType('image');
    setPickerMode('replace');
    setShowMaterialPicker(true);
  };

  const handleReplaceImageConfirm = (imageUrl: string) => {
    if (!selectedElementId || pickerMode !== 'replace') return;
    setLayers(prev =>
      prev.map(l =>
        l.id === selectedElementId
          ? { ...l, content: imageUrl, cropX: 0, cropY: 0, cropScale: 1 }
          : l
      )
    );
    setShowMaterialPicker(false);
    saveToHistory();
    Taro.showToast({
      title: '图片已替换',
      icon: 'success'
    });
  };

  const handleMaterialSelect = (item: string) => {
    if (pickerMode === 'replace') {
      handleReplaceImageConfirm(item);
    } else {
      if (pickerType === 'sticker') {
        handleSelectSticker(item);
      } else {
        handleSelectImage(item);
      }
    }
  };

  const handleOpenCrop = () => {
    if (!selectedElementId || selectedLayer?.type !== 'image' || isLayerLocked) return;
    setShowCropModal(true);
  };

  const handleCropAdjust = (direction: 'x' | 'y' | 'scale', delta: number) => {
    if (!selectedElementId || isLayerLocked) return;
    setLayers(prev =>
      prev.map(l => {
        if (l.id !== selectedElementId) return l;
        if (direction === 'x') {
          const newX = Math.max(-50, Math.min(50, (l.cropX || 0) + delta));
          return { ...l, cropX: newX };
        }
        if (direction === 'y') {
          const newY = Math.max(-50, Math.min(50, (l.cropY || 0) + delta));
          return { ...l, cropY: newY };
        }
        if (direction === 'scale') {
          const newScale = Math.max(0.5, Math.min(2, (l.cropScale || 1) + delta));
          return { ...l, cropScale: Number(newScale.toFixed(2)) };
        }
        return l;
      })
    );
  };

  const handleCropReset = () => {
    if (!selectedElementId || isLayerLocked) return;
    setLayers(prev =>
      prev.map(l =>
        l.id === selectedElementId
          ? { ...l, cropX: 0, cropY: 0, cropScale: 1 }
          : l
      )
    );
  };

  const handleCropConfirm = () => {
    setShowCropModal(false);
    saveToHistory();
    Taro.showToast({
      title: '裁剪完成',
      icon: 'success'
    });
  };

  const handleAddShape = () => {
    const newId = getNewLayerId();
    const newLayer: Layer = {
      id: newId,
      name: '形状',
      type: 'shape',
      x: 50,
      y: 50,
      width: 30,
      height: 30,
      content: '',
      color: '#7B61FF',
      opacity: 1,
      rotation: 0,
      shadow: false,
      visible: true,
      locked: false,
      zIndex: maxZIndex + 1
    };
    setLayers(prev => [...prev, newLayer]);
    setSelectedElementId(newId);
    setActiveTab('properties');
    saveToHistory();
  };

  const handlePreview = () => {
    console.log('[Canvas] 预览');
    Taro.showToast({
      title: '预览功能',
      icon: 'none'
    });
  };

  const dragStartPos = useRef<{ x: number; y: number; layerX: number; layerY: number } | null>(null);
  const resizeStartPos = useRef<{ x: number; y: number; width: number; height: number; layerX: number; layerY: number } | null>(null);
  const resizeHandleType = useRef<string>('');
  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);

  const handleTouchStart = (e: any, layer: Layer) => {
    if (layer.locked || !layer.visible) return;
    e.stopPropagation();

    const touch = e.touches?.[0] || e;
    const canvasRect = (e.currentTarget?.closest?.('.' + styles.canvasArea) || {});

    isDraggingRef.current = true;
    dragStartPos.current = {
      x: touch.clientX,
      y: touch.clientY,
      layerX: layer.x,
      layerY: layer.y
    };

    setSelectedElementId(layer.id);
  };

  const handleTouchMove = (e: any) => {
    if (isResizingRef.current && selectedElementId && resizeStartPos.current && resizeHandleType.current) {
      const touch = e.touches?.[0] || e;
      const start = resizeStartPos.current;
      const handle = resizeHandleType.current;

      const dx = (touch.clientX - start.x) / 300 * 50;
      const dy = (touch.clientY - start.y) / 400 * 50;

      setLayers(prev =>
        prev.map(l => {
          if (l.id !== selectedElementId) return l;

          let newWidth = start.width;
          let newHeight = start.height;
          let newX = start.layerX;
          let newY = start.layerY;

          if (handle.includes('right')) {
            newWidth = Math.max(10, start.width + dx * 2);
          }
          if (handle.includes('left')) {
            newWidth = Math.max(10, start.width - dx * 2);
            newX = start.layerX + dx;
          }
          if (handle.includes('bottom')) {
            newHeight = Math.max(10, start.height + dy * 2);
          }
          if (handle.includes('top')) {
            newHeight = Math.max(10, start.height - dy * 2);
            newY = start.layerY + dy;
          }

          return { ...l, width: newWidth, height: newHeight, x: newX, y: newY };
        })
      );
      return;
    }

    if (isDraggingRef.current && selectedElementId && dragStartPos.current) {
      const touch = e.touches?.[0] || e;
      const start = dragStartPos.current;

      const dx = (touch.clientX - start.x) / 300 * 50;
      const dy = (touch.clientY - start.y) / 400 * 50;

      const newX = Math.max(0, Math.min(100, start.layerX + dx));
      const newY = Math.max(0, Math.min(100, start.layerY + dy));

      setLayers(prev =>
        prev.map(l =>
          l.id === selectedElementId ? { ...l, x: newX, y: newY } : l
        )
      );
    }
  };

  const handleTouchEnd = () => {
    if (isDraggingRef.current || isResizingRef.current) {
      saveToHistory();
    }
    isDraggingRef.current = false;
    isResizingRef.current = false;
    dragStartPos.current = null;
    resizeStartPos.current = null;
    resizeHandleType.current = '';
  };

  const handleResizeStart = (e: any, layer: Layer, handleType: string) => {
    if (layer.locked || !layer.visible) return;
    e.stopPropagation();
    e.preventDefault();

    const touch = e.touches?.[0] || e;

    isResizingRef.current = true;
    resizeStartPos.current = {
      x: touch.clientX,
      y: touch.clientY,
      width: layer.width,
      height: layer.height,
      layerX: layer.x,
      layerY: layer.y
    };
    resizeHandleType.current = handleType;
  };

  const renderCanvasElement = (layer: Layer) => {
    if (!layer.visible) return null;

    const isSelected = layer.id === selectedElementId;
    const isEditing = layer.id === editingTextId && layer.type === 'text';

    const getTextAlignStyle = () => {
      if (layer.textAlign === 'left') return 'flex-start';
      if (layer.textAlign === 'right') return 'flex-end';
      return 'center';
    };

    const imageTransform = `scale(${layer.cropScale || 1}) translate(${layer.cropX || 0}%, ${layer.cropY || 0}%)`;

    return (
      <View
        key={layer.id}
        className={classNames(
          styles.canvasElement,
          isSelected && styles.selected,
          layer.locked && styles.lockedElement
        )}
        style={{
          left: `${layer.x}%`,
          top: `${layer.y}%`,
          width: `${layer.width}%`,
          height: `${layer.height}%`,
          transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
          zIndex: layer.zIndex,
          opacity: layer.opacity,
          justifyContent: layer.type === 'text' ? getTextAlignStyle() : 'center',
          alignItems: 'center',
          display: 'flex',
          touchAction: 'none'
        }}
        onTouchStart={(e) => handleTouchStart(e, layer)}
        onClick={(e) => {
          e.stopPropagation();
          handleElementClick(layer.id);
        }}
        onDoubleClick={() => {
          if (layer.type === 'text') {
            handleTextDoubleClick(layer);
          }
        }}
      >
        {layer.type === 'text' && (
          isEditing ? (
            <Input
              className={styles.elementTextInput}
              value={editingTextValue}
              onInput={(e) => handleTextContentChange(e.detail.value)}
              onBlur={handleTextContentConfirm}
              onConfirm={handleTextContentConfirm}
              autoFocus
              style={{
                fontSize: `${layer.fontSize}rpx`,
                color: layer.color,
                textShadow: layer.shadow ? '0 4rpx 12rpx rgba(0,0,0,0.3)' : 'none',
                fontFamily: layer.fontFamily,
                textAlign: layer.textAlign,
                width: '100%'
              }}
            />
          ) : (
            <Text
              className={styles.elementText}
              style={{
                fontSize: `${layer.fontSize}rpx`,
                color: layer.color,
                textShadow: layer.shadow ? '0 4rpx 12rpx rgba(0,0,0,0.3)' : 'none',
                fontFamily: layer.fontFamily,
                textAlign: layer.textAlign,
                width: '100%'
              }}
            >
              {layer.content}
            </Text>
          )
        )}
        {layer.type === 'image' && (
          <View className={styles.imageContainer}>
            <Image
              className={styles.elementImage}
              src={layer.content}
              mode="aspectFill"
              style={{
                width: '100%',
                height: '100%',
                transform: imageTransform,
                transformOrigin: 'center center'
              }}
            />
          </View>
        )}
        {layer.type === 'sticker' && (
          <Text style={{ fontSize: '80rpx', lineHeight: 1 }}>{layer.content}</Text>
        )}
        {layer.type === 'shape' && (
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: layer.color,
              borderRadius: '12rpx',
              boxShadow: layer.shadow ? '0 4rpx 12rpx rgba(0,0,0,0.2)' : 'none'
            }}
          />
        )}
        {isSelected && !layer.locked && (
          <>
            <View
              className={classNames(styles.resizeHandle, styles.topLeft)}
              onTouchStart={(e) => handleResizeStart(e, layer, 'topLeft')}
              onClick={(e) => e.stopPropagation()}
            />
            <View
              className={classNames(styles.resizeHandle, styles.topRight)}
              onTouchStart={(e) => handleResizeStart(e, layer, 'topRight')}
              onClick={(e) => e.stopPropagation()}
            />
            <View
              className={classNames(styles.resizeHandle, styles.bottomLeft)}
              onTouchStart={(e) => handleResizeStart(e, layer, 'bottomLeft')}
              onClick={(e) => e.stopPropagation()}
            />
            <View
              className={classNames(styles.resizeHandle, styles.bottomRight)}
              onTouchStart={(e) => handleResizeStart(e, layer, 'bottomRight')}
              onClick={(e) => e.stopPropagation()}
            />
          </>
        )}
        {isSelected && layer.locked && (
          <View className={styles.lockIndicator}>
            <Text>🔒</Text>
          </View>
        )}
      </View>
    );
  };

  const renderPropertiesPanel = () => {
    if (!selectedLayer) {
      return (
        <View className={styles.panelSection}>
          <Text className={styles.panelTitle}>请选择一个元素</Text>
        </View>
      );
    }

    const isTextType = selectedLayer.type === 'text';
    const isImageType = selectedLayer.type === 'image';
    const isLocked = selectedLayer.locked;

    return (
      <>
        {isLocked && (
          <View className={styles.lockedNotice}>
            <Text className={styles.lockedNoticeText}>🔒 该元素已锁定，无法编辑</Text>
          </View>
        )}

        {isTextType && (
          <View className={styles.panelSection}>
            <Text className={styles.panelTitle}>文字内容</Text>
            <View className={styles.textEditorRow}>
              <Input
                className={styles.textEditorInput}
                value={selectedLayer.content}
                onInput={(e) => {
                  if (!isLocked) {
                    setLayers(prev =>
                      prev.map(l =>
                        l.id === selectedElementId ? { ...l, content: e.detail.value } : l
                      )
                    );
                  }
                }}
                onBlur={() => {
                  if (!isLocked) {
                    const shortName = selectedLayer.content.slice(0, 8) + (selectedLayer.content.length > 8 ? '...' : '');
                    setLayers(prev =>
                      prev.map(l =>
                        l.id === selectedElementId ? { ...l, name: shortName } : l
                      )
                    );
                    saveToHistory();
                  }
                }}
                placeholder="输入文字内容"
                disabled={isLocked}
              />
            </View>
          </View>
        )}

        {isTextType && (
          <View className={styles.panelSection}>
            <Text className={styles.panelTitle}>颜色</Text>
            <View className={styles.colorList}>
              {colorPalette.map((color, index) => (
                <View
                  key={index}
                  className={classNames(styles.colorItem, selectedLayer.color === color && styles.active, isLocked && styles.disabled)}
                  style={{ backgroundColor: color }}
                  onClick={() => !isLocked && handleColorChange(color)}
                >
                  {selectedLayer.color === color && (
                    <Text className={styles.colorCheck}>✓</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        <View className={styles.panelSection}>
          <Text className={styles.panelTitle}>透明度</Text>
          <View className={styles.sliderRow}>
            <Text className={styles.sliderLabel}>不透明</Text>
            <View className={styles.sliderTrack}>
              <View
                className={styles.sliderFill}
                style={{ width: `${selectedLayer.opacity * 100}%` }}
              />
            </View>
            <Text className={styles.sliderValue}>{Math.round(selectedLayer.opacity * 100)}%</Text>
          </View>
          {!isLocked && (
            <View className={styles.adjustButtons}>
              <View
                className={styles.adjustBtn}
                onClick={() => {
                  handleOpacityChange(Math.max(0, selectedLayer.opacity - 0.1));
                  handleOpacityChangeEnd();
                }}
              >
                <Text>-10%</Text>
              </View>
              <View
                className={styles.adjustBtn}
                onClick={() => {
                  handleOpacityChange(Math.min(1, selectedLayer.opacity + 0.1));
                  handleOpacityChangeEnd();
                }}
              >
                <Text>+10%</Text>
              </View>
            </View>
          )}
        </View>

        <View className={styles.panelSection}>
          <Text className={styles.panelTitle}>阴影</Text>
          <View className={styles.alignButtons}>
            <View
              className={classNames(styles.alignBtn, selectedLayer.shadow && styles.active, isLocked && styles.disabled)}
              onClick={() => !isLocked && handleToggleShadow()}
            >
              <Text>阴影效果</Text>
            </View>
          </View>
        </View>

        {isTextType && (
          <View className={styles.panelSection}>
            <Text className={styles.panelTitle}>对齐</Text>
            <View className={styles.alignButtons}>
              <View
                className={classNames(styles.alignBtn, selectedLayer.textAlign === 'left' && styles.active, isLocked && styles.disabled)}
                onClick={() => !isLocked && handleTextAlignChange('left')}
              >
                <Text>左对齐</Text>
              </View>
              <View
                className={classNames(styles.alignBtn, selectedLayer.textAlign === 'center' && styles.active, isLocked && styles.disabled)}
                onClick={() => !isLocked && handleTextAlignChange('center')}
              >
                <Text>居中</Text>
              </View>
              <View
                className={classNames(styles.alignBtn, selectedLayer.textAlign === 'right' && styles.active, isLocked && styles.disabled)}
                onClick={() => !isLocked && handleTextAlignChange('right')}
              >
                <Text>右对齐</Text>
              </View>
            </View>
          </View>
        )}

        {isTextType && (
          <View className={styles.panelSection}>
            <Text className={styles.panelTitle}>字体</Text>
            <View className={styles.fontList}>
              {fonts.map(font => (
                <View
                  key={font.id}
                  className={classNames(styles.fontItem, selectedLayer.fontFamily === font.id && styles.active, isLocked && styles.disabled)}
                  onClick={() => !isLocked && handleFontChange(font.id)}
                >
                  <Text>{font.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {isImageType && (
          <View className={styles.panelSection}>
            <Text className={styles.panelTitle}>图片操作</Text>
            <View className={styles.alignButtons}>
              <View
                className={classNames(styles.alignBtn, isLocked && styles.disabled)}
                onClick={() => !isLocked && handleReplaceImage()}
              >
                <Text>替换图片</Text>
              </View>
              <View
                className={classNames(styles.alignBtn, isLocked && styles.disabled)}
                onClick={() => !isLocked && handleOpenCrop()}
              >
                <Text>裁剪调整</Text>
              </View>
            </View>
          </View>
        )}

        {selectedLayer.id !== 'bg1' && (
          <View className={styles.panelSection}>
            <Text className={styles.panelTitle}>图层操作</Text>
            <View className={styles.alignButtons}>
              <View
                className={classNames(styles.alignBtn, styles.dangerBtn, isLocked && styles.disabled)}
                onClick={() => !isLocked && handleDeleteLayer(selectedLayer.id)}
              >
                <Text>删除元素</Text>
              </View>
            </View>
          </View>
        )}
      </>
    );
  };

  const renderLayersPanel = () => (
    <View className={styles.layerList}>
      {sortedLayers.map((layer) => (
        <View
          key={layer.id}
          className={classNames(
            styles.layerItem,
            layer.id === selectedElementId && styles.selected,
            !layer.visible && styles.layerHidden
          )}
          onClick={() => handleElementClick(layer.id)}
        >
          <View className={styles.layerIcon}>
            <Text>
              {layer.type === 'text' ? 'T' : layer.type === 'image' ? '🖼' : layer.type === 'sticker' ? '✨' : '⬜'}
            </Text>
          </View>
          <Text className={styles.layerName}>
            {layer.name}
            {layer.locked && ' 🔒'}
          </Text>
          <View className={styles.layerActions}>
            <View
              className={classNames(styles.layerAction, layer.visible && styles.active)}
              onClick={(e) => { e.stopPropagation(); handleToggleVisibility(layer.id); }}
            >
              <Text>{layer.visible ? '👁' : '🙈'}</Text>
            </View>
            <View
              className={classNames(styles.layerAction, layer.locked && styles.active)}
              onClick={(e) => { e.stopPropagation(); handleToggleLock(layer.id); }}
            >
              <Text>{layer.locked ? '🔒' : '🔓'}</Text>
            </View>
            <View
              className={classNames(styles.layerAction, layer.locked && styles.disabledAction)}
              onClick={(e) => { e.stopPropagation(); handleMoveLayer(layer.id, 'up'); }}
            >
              <Text>↑</Text>
            </View>
            <View
              className={classNames(styles.layerAction, layer.locked && styles.disabledAction)}
              onClick={(e) => { e.stopPropagation(); handleMoveLayer(layer.id, 'down'); }}
            >
              <Text>↓</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderBrandPanel = () => {
    const currentFont = selectedLayer?.type === 'text' ? selectedLayer.fontFamily : brandFont;

    return (
      <>
        <View className={styles.panelSection}>
          <Text className={styles.panelTitle}>品牌风格</Text>
          <View className={styles.brandRow}>
            {brandColors.map((brand, index) => (
              <View
                key={index}
                className={classNames(styles.brandItem, selectedBrand === index && styles.brandActive)}
                onClick={() => handleApplyBrand(index)}
              >
                <View className={styles.brandColors}>
                  {brand.colors.map((color, ci) => (
                    <View
                      key={ci}
                      className={styles.brandColor}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </View>
                <Text className={styles.brandText}>{brand.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.panelSection}>
          <Text className={styles.panelTitle}>品牌字体</Text>
          <View className={styles.fontList}>
            {fonts.slice(0, 4).map(font => (
              <View
                key={font.id}
                className={classNames(styles.fontItem, currentFont === font.id && styles.active)}
                onClick={() => handleBrandFontChange(font.id)}
              >
                <Text>{font.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </>
    );
  };

  const renderAddPanel = () => (
    <View style={{ display: 'flex', flexDirection: 'column', gap: '24rpx' }}>
      <View className={styles.panelSection}>
        <Text className={styles.panelTitle}>添加元素</Text>
        <View style={{ display: 'flex', flexWrap: 'wrap', gap: '16rpx' }}>
          {[
            { icon: '📝', name: '文字', action: handleAddText },
            { icon: '🖼️', name: '图片', action: handleAddImage },
            { icon: '⭐', name: '贴纸', action: handleAddSticker },
            { icon: '⬜', name: '形状', action: handleAddShape },
          ].map((item, index) => (
            <View
              key={index}
              style={{
                width: 'calc(50% - 8rpx)',
                padding: '24rpx',
                background: '#f5f6f7',
                borderRadius: '12rpx',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8rpx'
              }}
              onClick={item.action}
            >
              <Text style={{ fontSize: '48rpx' }}>{item.icon}</Text>
              <Text style={{ fontSize: '24rpx', color: '#4E5969' }}>{item.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderToolPanel = () => {
    switch (activeTab) {
      case 'add':
        return renderAddPanel();
      case 'properties':
        return renderPropertiesPanel();
      case 'layers':
        return renderLayersPanel();
      case 'brand':
        return renderBrandPanel();
      default:
        return null;
    }
  };

  const renderMaterialPicker = () => {
    if (!showMaterialPicker) return null;

    const handleSelect = (value: string) => {
      handleMaterialSelect(value);
    };

    return (
      <View className={styles.modalOverlay} onClick={() => setShowMaterialPicker(false)}>
        <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <View className={styles.modalHeader}>
            <Text className={styles.modalTitle}>
              {pickerMode === 'replace' ? '替换图片' : pickerType === 'image' ? '选择图片' : '选择贴纸'}
            </Text>
            <View className={styles.modalClose} onClick={() => setShowMaterialPicker(false)}>
              <Text>✕</Text>
            </View>
          </View>
          <ScrollView className={styles.modalBody} scrollY>
            {pickerType === 'sticker' ? (
              <View className={styles.stickerGrid}>
                {stickerEmojis.map((emoji, index) => (
                  <View
                    key={index}
                    className={styles.stickerItem}
                    onClick={() => handleSelect(emoji)}
                  >
                    <Text style={{ fontSize: '64rpx' }}>{emoji}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View className={styles.imageGrid}>
                {imageMaterials.map((material) => (
                  <View
                    key={material.id}
                    className={styles.imageItem}
                    onClick={() => handleSelect(material.cover)}
                  >
                    <Image
                      className={styles.imageItemImg}
                      src={material.cover}
                      mode="aspectFill"
                    />
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    );
  };

  const renderCropModal = () => {
    if (!showCropModal || !selectedLayer) return null;

    const cropX = selectedLayer.cropX || 0;
    const cropY = selectedLayer.cropY || 0;
    const cropScale = selectedLayer.cropScale || 1;
    const isLocked = selectedLayer.locked;

    return (
      <View className={styles.modalOverlay} onClick={() => setShowCropModal(false)}>
        <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <View className={styles.modalHeader}>
            <Text className={styles.modalTitle}>图片裁剪调整</Text>
            <View className={styles.modalClose} onClick={() => setShowCropModal(false)}>
              <Text>✕</Text>
            </View>
          </View>
          <View className={styles.cropPreview}>
            <View className={styles.cropPreviewImg}>
              <Image
                src={selectedLayer.content}
                mode="aspectFill"
                style={{
                  width: '100%',
                  height: '100%',
                  transform: `scale(${cropScale}) translate(${cropX * 0.5}px, ${cropY * 0.5}px)`
                }}
              />
            </View>
          </View>
          <View className={styles.cropControls}>
            <View className={styles.cropControlRow}>
              <Text className={styles.cropControlLabel}>缩放</Text>
              <View className={styles.cropControlBtns}>
                <View
                  className={classNames(styles.cropCtrlBtn, isLocked && styles.disabled)}
                  onClick={() => !isLocked && handleCropAdjust('scale', -0.1)}
                >
                  <Text>－</Text>
                </View>
                <Text className={styles.cropValue}>{Math.round(cropScale * 100)}%</Text>
                <View
                  className={classNames(styles.cropCtrlBtn, isLocked && styles.disabled)}
                  onClick={() => !isLocked && handleCropAdjust('scale', 0.1)}
                >
                  <Text>＋</Text>
                </View>
              </View>
            </View>
            <View className={styles.cropControlRow}>
              <Text className={styles.cropControlLabel}>水平</Text>
              <View className={styles.cropControlBtns}>
                <View
                  className={classNames(styles.cropCtrlBtn, isLocked && styles.disabled)}
                  onClick={() => !isLocked && handleCropAdjust('x', -5)}
                >
                  <Text>←</Text>
                </View>
                <Text className={styles.cropValue}>{cropX}%</Text>
                <View
                  className={classNames(styles.cropCtrlBtn, isLocked && styles.disabled)}
                  onClick={() => !isLocked && handleCropAdjust('x', 5)}
                >
                  <Text>→</Text>
                </View>
              </View>
            </View>
            <View className={styles.cropControlRow}>
              <Text className={styles.cropControlLabel}>垂直</Text>
              <View className={styles.cropControlBtns}>
                <View
                  className={classNames(styles.cropCtrlBtn, isLocked && styles.disabled)}
                  onClick={() => !isLocked && handleCropAdjust('y', -5)}
                >
                  <Text>↑</Text>
                </View>
                <Text className={styles.cropValue}>{cropY}%</Text>
                <View
                  className={classNames(styles.cropCtrlBtn, isLocked && styles.disabled)}
                  onClick={() => !isLocked && handleCropAdjust('y', 5)}
                >
                  <Text>↓</Text>
                </View>
              </View>
            </View>
          </View>
          <View className={styles.cropActions}>
            <View
              className={classNames(styles.cropBtn, isLocked && styles.disabled)}
              style={{ flex: 1, background: '#f5f6f7', color: '#1D2129' }}
              onClick={() => !isLocked && handleCropReset()}
            >
              <Text>重置</Text>
            </View>
            <View
              className={classNames(styles.cropBtn, isLocked && styles.disabled)}
              style={{ flex: 2, background: '#7B61FF', color: '#fff' }}
              onClick={handleCropConfirm}
            >
              <Text>确定</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className={styles.page}>
      <View className={styles.topBar}>
        <View className={styles.topBarLeft}>
          <View className={classNames(styles.topBtn, !canUndo && styles.disabled)} onClick={handleUndo}>
            <Text className={styles.topBtnText}>↶</Text>
          </View>
          <View className={classNames(styles.topBtn, !canRedo && styles.disabled)} onClick={handleRedo}>
            <Text className={styles.topBtnText}>↷</Text>
          </View>
        </View>

        <Text className={styles.canvasTitle}>618活动主视觉</Text>

        <View className={styles.topBarRight}>
          <View className={styles.topBtn} onClick={handlePreview}>
            <Text className={styles.topBtnText}>👁</Text>
          </View>
        </View>
      </View>

      <View
        className={styles.canvasArea}
        onClick={handleCanvasClick}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <View className={styles.canvasContainer}>
          {sortedLayers.map(layer => renderCanvasElement(layer))}
        </View>
      </View>

      <View className={styles.bottomToolbar}>
        <View className={styles.toolTabs}>
          {[
            { id: 'add', icon: '➕', text: '添加' },
            { id: 'properties', icon: '🎨', text: '属性' },
            { id: 'layers', icon: '📚', text: '图层' },
            { id: 'brand', icon: '✨', text: '品牌' }
          ].map(tab => (
            <View
              key={tab.id}
              className={classNames(styles.toolTab, activeTab === tab.id && styles.active)}
              onClick={() => setActiveTab(tab.id)}
            >
              <Text className={styles.toolTabIcon}>{tab.icon}</Text>
              <Text className={styles.toolTabText}>{tab.text}</Text>
            </View>
          ))}
        </View>

        <ScrollView className={styles.toolPanel} scrollY>
          {renderToolPanel()}
        </ScrollView>

        <View className={styles.actionButtons}>
          <View className={styles.secondaryBtn} onClick={handleSave}>
            <Text>保存草稿</Text>
          </View>
          <View className={styles.primaryBtn} onClick={handleExport}>
            <Text>立即导出</Text>
          </View>
        </View>
      </View>

      {renderMaterialPicker()}
      {renderCropModal()}
    </View>
  );
};

export default CanvasPage;
