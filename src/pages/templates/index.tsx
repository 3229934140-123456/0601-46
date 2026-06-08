import React, { useState, useMemo } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import styles from './index.module.scss';
import TemplateCard from '@/components/TemplateCard';
import { templates, templateCategories, templateSizes } from '@/data/templates';
import type { Template } from '@/types/template';

const TemplatesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSize, setActiveSize] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      if (activeCategory !== 'all' && template.category !== activeCategory) {
        return false;
      }
      if (activeSize !== 'all' && template.size !== activeSize) {
        return false;
      }
      if (searchKeyword && !template.title.includes(searchKeyword) && !template.tags.some(tag => tag.includes(searchKeyword))) {
        return false;
      }
      return true;
    });
  }, [activeCategory, activeSize, searchKeyword]);

  const leftColumn = useMemo(() => {
    return filteredTemplates.filter((_, index) => index % 2 === 0);
  }, [filteredTemplates]);

  const rightColumn = useMemo(() => {
    return filteredTemplates.filter((_, index) => index % 2 === 1);
  }, [filteredTemplates]);

  const handleSearch = (e: any) => {
    setSearchKeyword(e.detail.value);
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleSizeClick = (sizeId: string) => {
    setActiveSize(sizeId);
  };

  const handleTemplateClick = (template: Template) => {
    Taro.switchTab({
      url: '/pages/canvas/index'
    }).then(() => {
      console.log('[Templates] 跳转到画布，模板ID:', template.id);
    }).catch(err => {
      console.error('[Templates] 跳转失败:', err);
    });
  };

  const onPullDownRefresh = () => {
    console.log('[Templates] 下拉刷新');
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.welcome}>
          <Text className={styles.welcomeTitle}>创意设计</Text>
          <Text className={styles.welcomeSubtitle}>精选模板，一键生成精美设计</Text>
        </View>
        <View className={styles.searchBar}>
          <Text className={styles.placeholderText}>🔍 搜索模板、素材...</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索模板、素材..."
            placeholder-class={styles.placeholderText}
            value={searchKeyword}
            onInput={handleSearch}
            confirmType="search"
          />
        </View>
      </View>

      <ScrollView
        className={styles.categoryScroll}
        scrollX
        enhanced
        showScrollbar={false}
      >
        <View className={styles.categoryList}>
          {templateCategories.map(category => (
            <View
              key={category.id}
              className={classNames(styles.categoryItem, activeCategory === category.id && styles.active)}
              onClick={() => handleCategoryClick(category.id)}
            >
              <Text className={styles.categoryText}>{category.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View className={styles.sizeFilter}>
        {templateSizes.slice(0, 5).map(size => (
          <View
            key={size.id}
            className={classNames(styles.sizeItem, activeSize === size.id && styles.active)}
            onClick={() => handleSizeClick(size.id)}
          >
            <Text className={styles.sizeText}>{size.name}</Text>
          </View>
        ))}
      </View>

      <View className={styles.section} style={{ marginTop: '24rpx' }}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>推荐模板</Text>
          <Text className={styles.moreBtn}>查看全部</Text>
        </View>
      </View>

      <View className={styles.templateGrid}>
        <View className={styles.templateCol}>
          {leftColumn.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onClick={() => handleTemplateClick(template)}
            />
          ))}
        </View>
        <View className={styles.templateCol}>
          {rightColumn.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onClick={() => handleTemplateClick(template)}
            />
          ))}
        </View>
      </View>

      {filteredTemplates.length === 0 && (
        <View className={styles.empty}>
          <Text style={{ fontSize: '80rpx' }}>🎨</Text>
          <Text className={styles.emptyText}>暂无相关模板，试试其他分类吧</Text>
        </View>
      )}
    </View>
  );
};

export default TemplatesPage;
