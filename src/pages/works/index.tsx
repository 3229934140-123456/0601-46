import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import styles from './index.module.scss';
import WorkCard from '@/components/WorkCard';
import { draftWorks as initialDraftWorks, publishedWorks } from '@/data/works';
import type { Work } from '@/types/work';

const WorksPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'draft' | 'published'>('draft');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [draftList, setDraftList] = useState<Work[]>([...initialDraftWorks]);

  useEffect(() => {
    loadDraftWorks();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      loadDraftWorks();
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const loadDraftWorks = async () => {
    try {
      const storageKey = 'draft_works';
      const res = await Taro.getStorage({ key: storageKey }).catch(() => ({ data: [] }));
      const savedWorks: Work[] = res.data || [];
      const existingIds = new Set(initialDraftWorks.map(w => w.id));
      const newWorks = savedWorks.filter(w => !existingIds.has(w.id));
      setDraftList([...newWorks, ...initialDraftWorks]);
    } catch (e) {
      console.error('[Works] 加载草稿失败:', e);
    }
  };

  const currentWorks = useMemo(() => {
    const works = activeTab === 'draft' ? draftList : publishedWorks;
    let result = works;

    if (searchKeyword) {
      result = result.filter(w =>
        w.title.includes(searchKeyword) ||
        (w.tags && w.tags.some(tag => tag.includes(searchKeyword)))
      );
    }

    if (activeFilter !== 'all') {
      result = result.filter(w => w.size.includes(activeFilter));
    }

    return result;
  }, [activeTab, searchKeyword, activeFilter]);

  const leftColumn = useMemo(() => {
    return currentWorks.filter((_, index) => index % 2 === 0);
  }, [currentWorks]);

  const rightColumn = useMemo(() => {
    return currentWorks.filter((_, index) => index % 2 === 1);
  }, [currentWorks]);

  const handleTabChange = (tab: 'draft' | 'published') => {
    setActiveTab(tab);
  };

  const handleSearch = (e: any) => {
    setSearchKeyword(e.detail.value);
  };

  const handleWorkClick = async (work: Work) => {
    console.log('[Works] 点击作品:', work.id);
    try {
      await Taro.setStorage({ key: 'current_edit_work_id', data: work.id });
    } catch (e) {
      console.error('[Works] 存储作品ID失败:', e);
    }
    Taro.switchTab({
      url: '/pages/canvas/index'
    });
  };

  const handleWorkMore = (work: Work) => {
    console.log('[Works] 更多操作:', work.id);
    Taro.showActionSheet({
      itemList: ['编辑', '重命名', '复制', '分享', '删除'],
      success: (res) => {
        console.log('[Works] 选择操作:', res.tapIndex);
      }
    });
  };

  const handleCreateNew = () => {
    Taro.switchTab({
      url: '/pages/templates/index'
    });
  };

  const onPullDownRefresh = () => {
    console.log('[Works] 下拉刷新');
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  };

  const filters = [
    { id: 'all', name: '全部' },
    { id: '750', name: '海报' },
    { id: '1080', name: '方图' },
    { id: '1920', name: '长图' },
    { id: '300', name: 'Banner' }
  ];

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>我的作品</Text>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索作品..."
            value={searchKeyword}
            onInput={handleSearch}
            confirmType="search"
          />
        </View>
      </View>

      <View className={styles.tabBar}>
        <View
          className={classNames(styles.tabItem, activeTab === 'draft' && styles.active)}
          onClick={() => handleTabChange('draft')}
        >
          <Text className={styles.tabText}>草稿</Text>
          <Text className={styles.tabCount}>{draftList.length}</Text>
        </View>
        <View
          className={classNames(styles.tabItem, activeTab === 'published' && styles.active)}
          onClick={() => handleTabChange('published')}
        >
          <Text className={styles.tabText}>已发布</Text>
          <Text className={styles.tabCount}>{publishedWorks.length}</Text>
        </View>
      </View>

      <View className={styles.statsBar}>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{draftList.length + publishedWorks.length}</Text>
          <Text className={styles.statLabel}>作品总数</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>3</Text>
          <Text className={styles.statLabel}>协作中</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>12</Text>
          <Text className={styles.statLabel}>本月导出</Text>
        </View>
      </View>

      <ScrollView className={styles.filterBar} scrollX enhanced showScrollbar={false}>
        {filters.map(filter => (
          <View
            key={filter.id}
            className={classNames(styles.filterItem, activeFilter === filter.id && styles.active)}
            onClick={() => setActiveFilter(filter.id)}
          >
            <Text className={styles.filterText}>{filter.name}</Text>
          </View>
        ))}
      </ScrollView>

      <View className={styles.section} style={{ paddingBottom: 0 }}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            {activeTab === 'draft' ? '草稿作品' : '已发布作品'}
          </Text>
          <Text className={styles.sectionAction}>批量管理</Text>
        </View>
      </View>

      {currentWorks.length > 0 ? (
        <View className={styles.workGrid}>
          <View className={styles.workCol}>
            {leftColumn.map(work => (
              <WorkCard
                key={work.id}
                work={work}
                onClick={() => handleWorkClick(work)}
                onMore={() => handleWorkMore(work)}
              />
            ))}
          </View>
          <View className={styles.workCol}>
            {rightColumn.map(work => (
              <WorkCard
                key={work.id}
                work={work}
                onClick={() => handleWorkClick(work)}
                onMore={() => handleWorkMore(work)}
              />
            ))}
          </View>
        </View>
      ) : (
        <View className={styles.empty}>
          <Text className={styles.emptyIcon}>📁</Text>
          <Text className={styles.emptyText}>
            {activeTab === 'draft' ? '暂无草稿作品' : '暂无已发布作品'}
          </Text>
          <View className={styles.emptyBtn} onClick={handleCreateNew}>
            <Text>去创建</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default WorksPage;
