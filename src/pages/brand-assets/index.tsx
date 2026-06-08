import React, { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import styles from './index.module.scss';
import { savedComponents } from '@/data/materials';

const BrandAssetsPage: React.FC = () => {
  const [activeColor, setActiveColor] = useState(0);
  const [activeFont, setActiveFont] = useState(0);

  const brandColors = [
    { name: '主色', hex: '#7B61FF' },
    { name: '辅助色', hex: '#FF6B9D' },
    { name: '强调色', hex: '#30D158' },
    { name: '警示色', hex: '#FF9F0A' },
    { name: '深色', hex: '#1D2129' },
    { name: '中灰色', hex: '#4E5969' },
    { name: '浅灰色', hex: '#86909C' },
    { name: '背景色', hex: '#F7F8FA' }
  ];

  const brandFonts = [
    { name: '默认字体', preview: '创意设计' },
    { name: '粗黑体', preview: '创意设计' },
    { name: '宋体', preview: '创意设计' },
    { name: '楷体', preview: '创意设计' },
    { name: '圆体', preview: '创意设计' },
    { name: '艺术体', preview: '创意设计' }
  ];

  const handleApplyBrand = () => {
    console.log('[BrandAssets] 应用品牌设置');
    Taro.showToast({
      title: '已应用到画布',
      icon: 'success'
    });
    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  const handleAddColor = () => {
    console.log('[BrandAssets] 添加品牌色');
    Taro.showToast({
      title: '添加品牌色',
      icon: 'none'
    });
  };

  const handleAddComponent = () => {
    console.log('[BrandAssets] 添加常用组件');
    Taro.showToast({
      title: '添加组件',
      icon: 'none'
    });
  };

  const handleColorClick = (index: number) => {
    setActiveColor(index);
    console.log('[BrandAssets] 选择颜色:', index);
  };

  const handleFontClick = (index: number) => {
    setActiveFont(index);
    console.log('[BrandAssets] 选择字体:', index);
  };

  return (
    <View className={styles.page}>
      <View className={styles.section}>
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionTitleText}>品牌色</Text>
          <Text className={styles.sectionAction} onClick={handleAddColor}>+ 添加</Text>
        </View>
        <View className={styles.colorList}>
          {brandColors.map((color, index) => (
            <View
              key={index}
              className={styles.colorItem}
              onClick={() => handleColorClick(index)}
            >
              <View
                className={classNames(styles.colorSwatch, activeColor === index && styles.active)}
                style={{ backgroundColor: color.hex }}
              />
              <Text className={styles.colorName}>{color.name}</Text>
              <Text className={styles.colorHex}>{color.hex}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionTitleText}>品牌字体</Text>
        </View>
        <View className={styles.fontList}>
          {brandFonts.map((font, index) => (
            <View
              key={index}
              className={styles.fontItem}
              onClick={() => handleFontClick(index)}
            >
              <Text className={styles.fontPreview} style={{ fontFamily: font.name }}>
                {font.preview}
              </Text>
              <Text className={styles.fontName}>{font.name}</Text>
              {activeFont === index && (
                <View className={styles.fontCheck}>
                  <Text>✓</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionTitleText}>常用组件</Text>
          <Text className={styles.sectionAction}>管理</Text>
        </View>
        <View className={styles.componentsGrid}>
          {savedComponents.slice(0, 4).map(comp => (
            <View key={comp.id} className={styles.componentCard}>
              <Image
                className={styles.componentImg}
                src={comp.cover}
                mode="aspectFill"
              />
              <View className={styles.componentInfo}>
                <Text className={styles.componentName}>{comp.name}</Text>
                <Text className={styles.componentType}>{comp.type}</Text>
              </View>
            </View>
          ))}
        </View>
        <View className={styles.addBtn} onClick={handleAddComponent}>
          <Text>+ 添加常用组件</Text>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.applyBtn} onClick={handleApplyBrand}>
          <Text>应用到画布</Text>
        </View>
      </View>
    </View>
  );
};

export default BrandAssetsPage;
