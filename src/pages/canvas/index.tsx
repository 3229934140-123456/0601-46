import React, { useState } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import styles from './index.module.scss';

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
  opacity: number;
  rotation: number;
  shadow: boolean;
  visible: boolean;
  locked: boolean;
  zIndex: number;
}

const CanvasPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('properties');
  const [selectedElementId, setSelectedElementId] = useState('text1');
  const [canUndo, setCanUndo] = useState(true);
  const [canRedo, setCanRedo] = useState(false);

  const [layers, setLayers] = useState<Layer[]>([
    {
      id: 'bg1',
      name: '背景图',
      type: 'image',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      content: 'https://picsum.photos/id/1025/600/800',
      opacity: 1,
      rotation: 0,
      shadow: false,
      visible: true,
      locked: true,
      zIndex: 0
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

  const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);

  const brandColors = [
    { name: '品牌紫', colors: ['#7B61FF', '#9B85FF', '#5A45E0'] },
    { name: '活力橙', colors: ['#FF7D00', '#FFA94D', '#E66A00'] }
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
    const layerIndex = layers.findIndex(l => l.id === layerId);
    if (layerIndex === -1) return;

    const newLayers = [...layers];
    const targetIndex = direction === 'up' ? layerIndex - 1 : layerIndex + 1;

    if (targetIndex < 0 || targetIndex >= layers.length) return;

    const tempZIndex = newLayers[layerIndex].zIndex;
    newLayers[layerIndex].zIndex = newLayers[targetIndex].zIndex;
    newLayers[targetIndex].zIndex = tempZIndex;

    setLayers(newLayers);
    console.log('[Canvas] 移动图层:', layerId, direction);
  };

  const handleApplyBrand = (brandIndex: number) => {
    console.log('[Canvas] 应用品牌:', brandIndex);
    Taro.showToast({
      title: '已应用品牌风格',
      icon: 'success'
    });
  };

  const handleAddElement = (type: string) => {
    console.log('[Canvas] 添加元素:', type);
    Taro.showToast({
      title: `添加${type}`,
      icon: 'none'
    });
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
          opacity: layer.visible ? layer.opacity : 0.3
        }}
        onClick={() => handleElementClick(layer.id)}
      >
        {layer.type === 'text' && (
          <Text
            className={styles.elementText}
            style={{
              fontSize: `${layer.fontSize}rpx`,
              color: layer.color,
              textShadow: layer.shadow ? '0 4rpx 12rpx rgba(0,0,0,0.3)' : 'none'
            }}
          >
            {layer.content}
          </Text>
        )}
        {layer.type === 'image' && (
          <Image
            className={styles.elementImage}
            src={layer.content}
            mode="aspectFill"
          />
        )}
        {layer.type === 'sticker' && (
          <Text style={{ fontSize: '80rpx' }}>{layer.content}</Text>
        )}
        {isSelected && (
          <View className={classNames(styles.resizeHandle, styles.bottomRight)} />
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

    return (
      <>
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

        <View className={styles.panelSection}>
          <Text className={styles.panelTitle}>透明度</Text>
          <View className={styles.sliderRow}>
            <Text className={styles.sliderLabel}>不透明</Text>
            <View
              className={styles.sliderTrack}
              onClick={(e: any) => {
                const rect = e.currentTarget.getBoundingClientRect?.();
                if (rect) {
                  const percent = Math.min(1, Math.max(0, (e.detail.x - rect.left) / rect.width));
                  handleOpacityChange(Math.round(percent * 100) / 100);
                }
              }}
            >
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

        <View className={styles.panelSection}>
          <Text className={styles.panelTitle}>对齐</Text>
          <View className={styles.alignButtons}>
            <View className={styles.alignBtn}><Text>左对齐</Text></View>
            <View className={classNames(styles.alignBtn, styles.active)}><Text>居中</Text></View>
            <View className={styles.alignBtn}><Text>右对齐</Text></View>
          </View>
        </View>

        <View className={styles.panelSection}>
          <Text className={styles.panelTitle}>字体</Text>
          <View className={styles.fontList}>
            {fonts.map(font => (
              <View
                key={font.id}
                className={classNames(styles.fontItem, font.id === 'default' && styles.active)}
              >
                <Text>{font.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </>
    );
  };

  const renderLayersPanel = () => (
    <View className={styles.layerList}>
      {sortedLayers.map((layer, index) => (
        <View
          key={layer.id}
          className={classNames(styles.layerItem, layer.id === selectedElementId && styles.selected)}
          onClick={() => handleElementClick(layer.id)}
        >
          <View className={styles.layerIcon}>
            <Text>
              {layer.type === 'text' ? 'T' : layer.type === 'image' ? '🖼' : '✨'}
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
              className={styles.brandItem}
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
              className={classNames(styles.fontItem, font.id === 'default' && styles.active)}
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
            { icon: '📝', name: '文字' },
            { icon: '🖼️', name: '图片' },
            { icon: '⭐', name: '贴纸' },
            { icon: '⬜', name: '形状' },
            { icon: '📱', name: '二维码' },
            { icon: '💬', name: '气泡' }
          ].map((item, index) => (
            <View
              key={index}
              style={{
                width: 'calc(33.33% - 12rpx)',
                padding: '24rpx',
                background: '#f5f6f7',
                borderRadius: '12rpx',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8rpx'
              }}
              onClick={() => handleAddElement(item.name)}
            >
              <Text style={{ fontSize: '40rpx' }}>{item.icon}</Text>
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

  return (
    <View className={styles.page}>
      <View className={styles.topBar}>
        <View className={styles.topBarLeft}>
          <View className={styles.topBtn} onClick={handleUndo}>
            <Text className={classNames(styles.topBtnText, !canUndo && styles.disabled)}>↶</Text>
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

      <View className={styles.canvasArea}>
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
    </View>
  );
};

export default CanvasPage;
