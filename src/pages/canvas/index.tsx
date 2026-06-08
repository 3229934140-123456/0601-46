import React, { useState, useMemo } from 'react';
import { View, Text, Image, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import styles from './index.module.scss';
import { imageMaterials, stickerMaterials } from '@/data/materials';

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

const CanvasPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('properties');
  const [selectedElementId, setSelectedElementId] = useState<string | null>('text1');
  const [canUndo, setCanUndo] = useState(true);
  const [canRedo, setCanRedo] = useState(false);
  const [showMaterialPicker, setShowMaterialPicker] = useState(false);
  const [pickerType, setPickerType] = useState<'image' | 'sticker'>('image');
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(0);
  const [brandFont, setBrandFont] = useState('default');
  const [layerCounter, setLayerCounter] = useState(10);

  const [layers, setLayers] = useState<Layer[]>([
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
  ]);

  const selectedLayer = layers.find(l => l.id === selectedElementId);

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

  const getNewLayerId = () => {
    const newId = `layer_${layerCounter}`;
    setLayerCounter(prev => prev + 1);
    return newId;
  };

  const handleUndo = () => {
    console.log('[Canvas] 撤销');
    setCanUndo(false);
    setCanRedo(true);
  };

  const handleRedo = () => {
    console.log('[Canvas] 重做');
    setCanUndo(true);
    setCanRedo(false);
  };

  const handleSave = () => {
    console.log('[Canvas] 保存草稿');
    const workData = {
      id: 'work_' + Date.now(),
      title: '618活动主视觉',
      cover: layers.find(l => l.type === 'image')?.content || '',
      status: 'draft',
      size: '750×1334',
      updatedAt: new Date().toLocaleString('zh-CN'),
      createdAt: new Date().toLocaleString('zh-CN')
    };
    
    try {
      const savedWorks = Taro.getStorageSync('draftWorks') || [];
      savedWorks.unshift(workData);
      Taro.setStorageSync('draftWorks', savedWorks);
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
    setSelectedElementId(layerId);
    console.log('[Canvas] 选中元素:', layerId);
  };

  const handleColorChange = (color: string) => {
    if (!selectedElementId) return;
    setLayers(prev =>
      prev.map(l =>
        l.id === selectedElementId ? { ...l, color } : l
      )
    );
    console.log('[Canvas] 修改颜色:', color);
  };

  const handleOpacityChange = (opacity: number) => {
    if (!selectedElementId) return;
    setLayers(prev =>
      prev.map(l =>
        l.id === selectedElementId ? { ...l, opacity } : l
      )
    );
  };

  const handleToggleShadow = () => {
    if (!selectedElementId) return;
    setLayers(prev =>
      prev.map(l =>
        l.id === selectedElementId ? { ...l, shadow: !l.shadow } : l
      )
    );
  };

  const handleTextAlignChange = (align: 'left' | 'center' | 'right') => {
    if (!selectedElementId) return;
    setLayers(prev =>
      prev.map(l =>
        l.id === selectedElementId ? { ...l, textAlign: align } : l
      )
    );
    console.log('[Canvas] 修改对齐:', align);
  };

  const handleFontChange = (fontId: string) => {
    if (!selectedElementId) return;
    setLayers(prev =>
      prev.map(l =>
        l.id === selectedElementId ? { ...l, fontFamily: fontId } : l
      )
    );
    console.log('[Canvas] 修改字体:', fontId);
  };

  const handleToggleVisibility = (layerId: string) => {
    setLayers(prev =>
      prev.map(l =>
        l.id === layerId ? { ...l, visible: !l.visible } : l
      )
    );
  };

  const handleToggleLock = (layerId: string) => {
    setLayers(prev =>
      prev.map(l =>
        l.id === layerId ? { ...l, locked: !l.locked } : l
      )
    );
  };

  const handleMoveLayer = (layerId: string, direction: 'up' | 'down') => {
    const sorted = [...layers].sort((a, b) => b.zIndex - a.zIndex);
    const currentIndex = sorted.findIndex(l => l.id === layerId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const newLayers = [...layers];
    const currentLayer = newLayers.find(l => l.id === layerId);
    const targetLayer = sorted[targetIndex];
    if (!currentLayer || !targetLayer) return;

    const tempZIndex = currentLayer.zIndex;
    currentLayer.zIndex = targetLayer.zIndex;
    targetLayer.zIndex = tempZIndex;

    setLayers(newLayers);
    console.log('[Canvas] 移动图层:', layerId, direction);
  };

  const handleDeleteLayer = (layerId: string) => {
    if (layerId === 'bg1') {
      Taro.showToast({ title: '背景层不能删除', icon: 'none' });
      return;
    }
    setLayers(prev => prev.filter(l => l.id !== layerId));
    if (selectedElementId === layerId) {
      setSelectedElementId(null);
    }
    console.log('[Canvas] 删除图层:', layerId);
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
    
    console.log('[Canvas] 应用品牌:', brandIndex);
    Taro.showToast({
      title: '已应用品牌风格',
      icon: 'success'
    });
  };

  const handleBrandFontChange = (fontId: string) => {
    setBrandFont(fontId);
    console.log('[Canvas] 品牌字体:', fontId);
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
      fontFamily: 'default',
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
    console.log('[Canvas] 添加文字:', newId);
  };

  const handleAddSticker = () => {
    setPickerType('sticker');
    setShowMaterialPicker(true);
  };

  const handleAddImage = () => {
    setPickerType('image');
    setShowMaterialPicker(true);
  };

  const handleSelectSticker = (emoji: string) => {
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
    console.log('[Canvas] 添加贴纸:', newId);
  };

  const handleSelectImage = (imageUrl: string) => {
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
    console.log('[Canvas] 添加图片:', newId);
  };

  const handleReplaceImage = () => {
    setPickerType('image');
    setShowMaterialPicker(true);
  };

  const handleReplaceImageConfirm = (imageUrl: string) => {
    if (!selectedElementId) return;
    setLayers(prev =>
      prev.map(l =>
        l.id === selectedElementId
          ? { ...l, content: imageUrl, cropX: 0, cropY: 0, cropScale: 1 }
          : l
      )
    );
    setShowMaterialPicker(false);
    console.log('[Canvas] 替换图片:', selectedElementId);
    Taro.showToast({
      title: '图片已替换',
      icon: 'success'
    });
  };

  const handleOpenCrop = () => {
    if (!selectedElementId || selectedLayer?.type !== 'image') return;
    setShowCropModal(true);
  };

  const handleCropAdjust = (direction: 'x' | 'y' | 'scale', value: number) => {
    if (!selectedElementId) return;
    setLayers(prev =>
      prev.map(l => {
        if (l.id !== selectedElementId) return l;
        if (direction === 'x') return { ...l, cropX: value };
        if (direction === 'y') return { ...l, cropY: value };
        if (direction === 'scale') return { ...l, cropScale: value };
        return l;
      })
    );
  };

  const handleCropConfirm = () => {
    setShowCropModal(false);
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
    console.log('[Canvas] 添加形状:', newId);
  };

  const handlePreview = () => {
    console.log('[Canvas] 预览');
    Taro.showToast({
      title: '预览功能',
      icon: 'none'
    });
  };

  const renderCanvasElement = (layer: Layer) => {
    const isSelected = layer.id === selectedElementId;

    const getTextAlignStyle = () => {
      if (layer.textAlign === 'left') return 'flex-start';
      if (layer.textAlign === 'right') return 'flex-end';
      return 'center';
    };

    return (
      <View
        key={layer.id}
        className={classNames(
          styles.canvasElement,
          isSelected && styles.selected,
          !layer.visible && styles.hidden
        )}
        style={{
          left: `${layer.x}%`,
          top: `${layer.y}%`,
          width: `${layer.width}%`,
          height: `${layer.height}%`,
          transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
          zIndex: layer.zIndex,
          opacity: layer.visible ? layer.opacity : 0.3,
          justifyContent: 'center',
          alignItems: layer.type === 'text' ? getTextAlignStyle() : 'center',
          display: 'flex'
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleElementClick(layer.id);
        }}
      >
        {layer.type === 'text' && (
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
        )}
        {layer.type === 'image' && (
          <View className={styles.imageContainer}>
            <Image
              className={styles.elementImage}
              src={layer.content}
              mode="aspectFill"
              style={{
                transform: `scale(${layer.cropScale || 1})`,
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
            <View className={classNames(styles.resizeHandle, styles.bottomRight)} />
            <View className={classNames(styles.resizeHandle, styles.topLeft)} />
            <View className={classNames(styles.resizeHandle, styles.topRight)} />
            <View className={classNames(styles.resizeHandle, styles.bottomLeft)} />
          </>
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

    return (
      <>
        {isTextType && (
          <View className={styles.panelSection}>
            <Text className={styles.panelTitle}>颜色</Text>
            <View className={styles.colorList}>
              {colorPalette.map((color, index) => (
                <View
                  key={index}
                  className={classNames(styles.colorItem, selectedLayer.color === color && styles.active)}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
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
        </View>

        <View className={styles.panelSection}>
          <Text className={styles.panelTitle}>阴影</Text>
          <View className={styles.alignButtons}>
            <View
              className={classNames(styles.alignBtn, selectedLayer.shadow && styles.active)}
              onClick={handleToggleShadow}
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
                className={classNames(styles.alignBtn, selectedLayer.textAlign === 'left' && styles.active)}
                onClick={() => handleTextAlignChange('left')}
              >
                <Text>左对齐</Text>
              </View>
              <View
                className={classNames(styles.alignBtn, selectedLayer.textAlign === 'center' && styles.active)}
                onClick={() => handleTextAlignChange('center')}
              >
                <Text>居中</Text>
              </View>
              <View
                className={classNames(styles.alignBtn, selectedLayer.textAlign === 'right' && styles.active)}
                onClick={() => handleTextAlignChange('right')}
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
                  className={classNames(styles.fontItem, selectedLayer.fontFamily === font.id && styles.active)}
                  onClick={() => handleFontChange(font.id)}
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
              <View className={styles.alignBtn} onClick={handleReplaceImage}>
                <Text>替换图片</Text>
              </View>
              <View className={styles.alignBtn} onClick={handleOpenCrop}>
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
                className={classNames(styles.alignBtn, styles.dangerBtn)}
                onClick={() => handleDeleteLayer(selectedLayer.id)}
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
          className={classNames(styles.layerItem, layer.id === selectedElementId && styles.selected)}
          onClick={() => handleElementClick(layer.id)}
        >
          <View className={styles.layerIcon}>
            <Text>
              {layer.type === 'text' ? 'T' : layer.type === 'image' ? '🖼' : layer.type === 'sticker' ? '✨' : '⬜'}
            </Text>
          </View>
          <Text className={styles.layerName}>{layer.name}</Text>
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
              className={styles.layerAction}
              onClick={(e) => { e.stopPropagation(); handleMoveLayer(layer.id, 'up'); }}
            >
              <Text>↑</Text>
            </View>
            <View
              className={styles.layerAction}
              onClick={(e) => { e.stopPropagation(); handleMoveLayer(layer.id, 'down'); }}
            >
              <Text>↓</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderBrandPanel = () => (
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
              className={classNames(styles.fontItem, brandFont === font.id && styles.active)}
              onClick={() => handleBrandFontChange(font.id)}
            >
              <Text>{font.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );

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

    const materials = pickerType === 'image' ? imageMaterials : stickerMaterials;
    const items = pickerType === 'sticker' 
      ? stickerEmojis.map((emoji) => ({ id: emoji, name: emoji, cover: '', type: 'sticker' as const }))
      : materials;

    const handleSelect = pickerType === 'image' ? handleSelectImage : handleSelectSticker;
    const handleReplace = selectedElementId && selectedLayer?.type === 'image' && pickerType === 'image';
    const selectFn = handleReplace ? handleReplaceImageConfirm : handleSelect;

    return (
      <View className={styles.modalOverlay} onClick={() => setShowMaterialPicker(false)}>
        <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <View className={styles.modalHeader}>
            <Text className={styles.modalTitle}>
              {pickerType === 'image' ? '选择图片' : '选择贴纸'}
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
                    onClick={() => selectFn(emoji)}
                  >
                    <Text style={{ fontSize: '64rpx' }}>{emoji}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View className={styles.imageGrid}>
                {imageMaterials.map((material, index) => (
                  <View
                    key={material.id}
                    className={styles.imageItem}
                    onClick={() => selectFn(material.cover)}
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
            <View className={styles.sliderRow}>
              <Text className={styles.sliderLabel}>缩放</Text>
              <View className={styles.sliderTrack}>
                <View
                  className={styles.sliderFill}
                  style={{ width: `${((cropScale - 0.5) / 1.5 * 100}%` }}
                />
              </View>
              <Text className={styles.sliderValue}>{Math.round(cropScale * 100)}%</Text>
            </View>
            <View className={styles.sliderRow}>
              <Text className={styles.sliderLabel}>水平</Text>
              <View className={styles.sliderTrack}>
                <View
                  className={styles.sliderFill}
                  style={{ width: `${((cropX + 50) / 100 * 100}%` }}
                />
              </View>
              <Text className={styles.sliderValue}>{cropX}%</Text>
            </View>
            <View className={styles.sliderRow}>
              <Text className={styles.sliderLabel}>垂直</Text>
              <View className={styles.sliderTrack}>
                <View
                  className={styles.sliderFill}
                  style={{ width: `${((cropY + 50) / 100 * 100)}%` }}
                />
              </View>
              <Text className={styles.sliderValue}>{cropY}%</Text>
            </View>
          </View>
          <View className={styles.cropActions}>
            <View
              className={styles.cropBtn}
              style={{ flex: 1, background: '#f5f6f7', color: '#1D2129' }}
              onClick={() => {
                handleCropAdjust('scale', 1);
                handleCropAdjust('x', 0);
                handleCropAdjust('y', 0);
              }}
            >
              <Text>重置</Text>
            </View>
            <View
              className={styles.cropBtn}
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

      <View className={styles.canvasArea} onClick={() => setSelectedElementId(null)}>
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

        <View className={styles.toolPanel}>
          {renderToolPanel()}
        </View>

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
