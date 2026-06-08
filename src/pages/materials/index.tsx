import React, { useState, useMemo } from 'react';
import { View, Text, Input, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import styles from './index.module.scss';
import MaterialCard from '@/components/MaterialCard';
import {
  materialCategories,
  imageMaterials,
  stickerMaterials,
  illustrationMaterials,
  savedComponents,
  allMaterials
} from '@/data/materials';
import type { Material } from '@/types/material';

const MaterialsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [materials, setMaterials] = useState(allMaterials);

  const filteredMaterials = useMemo(() => {
    let result = materials;

    if (activeTab !== 'all') {
      result = result.filter(m => m.type === activeTab);
    }

    if (searchKeyword) {
      result = result.filter(m =>
        m.name.includes(searchKeyword) ||
        m.tags.some(tag => tag.includes(searchKeyword))
      );
    }

    return result;
  }, [activeTab, searchKeyword, materials]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleSearch = (e: any) => {
    setSearchKeyword(e.detail.value);
  };

  const handleMaterialClick = (material: Material) => {
    console.log('[Materials] 点击素材:', material.id);
    Taro.showToast({
      title: '已添加到画布',
      icon: 'success'
    });
  };

  const handleFavorite = (material: Material) => {
    setMaterials(prev =>
      prev.map(m =>
        m.id === material.id
          ? { ...m, isFavorite: !m.isFavorite }
          : m
      )
    );
    console.log('[Materials] 收藏素材:', material.id, !material.isFavorite);
  };

  const handleSavedComponentClick = (component: any) => {
    console.log('[Materials] 点击保存的组件:', component.id);
    Taro.showToast({
      title: '已添加到画布',
      icon: 'success'
    });
  };

  const getTabCount = (tabId: string) => {
    if (tabId === 'all') return allMaterials.length;
    return allMaterials.filter(m => m.type === tabId).length;
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>素材库</Text>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索素材..."
            value={searchKeyword}
            onInput={handleSearch}
            confirmType="search"
          />
        </View>
      </View>

      <View className={styles.tabBar}>
        {materialCategories.map(cat => (
          <View
            key={cat.id}
            className={classNames(styles.tabItem, activeTab === cat.id && styles.active)}
            onClick={() => handleTabChange(cat.id)}
          >
            <Text className={styles.tabText}>{cat.name}</Text>
            <Text className={styles.tabCount}>{getTabCount(cat.id)}</Text>
          </View>
        ))}
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>我的常用组件</Text>
          <Text className={styles.sectionAction}>管理</Text>
        </View>
        <ScrollView scrollX enhanced showScrollbar={false}>
          <View className={styles.savedComponents}>
            {savedComponents.map(comp => (
              <View
                key={comp.id}
                className={styles.componentItem}
                onClick={() => handleSavedComponentClick(comp)}
              >
                <Image
                  className={styles.componentImage}
                  src={comp.cover}
                  mode="aspectFill"
                />
                <View className={styles.componentInfo}>
                  <Text className={styles.componentName}>{comp.name}</Text>
                  <Text className={styles.componentDate}>{comp.savedAt}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View className={styles.section} style={{ paddingBottom: 0 }}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>精选素材</Text>
        </View>
      </View>

      <View className={styles.materialGrid}>
        {filteredMaterials.map(material => (
          <View key={material.id} className={styles.materialItem}>
            <MaterialCard
              material={material}
              onClick={() => handleMaterialClick(material)}
              onFavorite={() => handleFavorite(material)}
            />
          </View>
        ))}
      </View>

      {filteredMaterials.length === 0 && (
        <View style={{ padding: '120rpx 0', textAlign: 'center' }}>
          <Text style={{ fontSize: '80rpx' }}>🖼️</Text>
          <Text style={{ fontSize: '28rpx', color: '#86909C', marginTop: '24rpx', display: 'block' }}>
            暂无相关素材
          </Text>
        </View>
      )}
    </View>
  );
};

export default MaterialsPage;
