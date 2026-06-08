import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import styles from './index.module.scss';
import type { Work } from '@/types/work';

interface WorkCardProps {
  work: Work;
  onClick?: () => void;
  onMore?: () => void;
}

const WorkCard: React.FC<WorkCardProps> = ({ work, onClick, onMore }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.switchTab({
        url: '/pages/canvas/index'
      });
    }
  };

  const handleMore = (e: any) => {
    e.stopPropagation();
    if (onMore) {
      onMore();
    }
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.imageWrap}>
        <Image
          className={styles.image}
          src={work.cover}
          mode="aspectFill"
          lazyLoad
        />
        <View className={styles.statusBadge}>
          <Text className={classNames(styles.statusText, work.status === 'published' && styles.published)}>
            {work.status === 'draft' ? '草稿' : '已发布'}
          </Text>
        </View>
        <View className={styles.moreBtn} onClick={handleMore}>
          <Text className={styles.moreIcon}>⋯</Text>
        </View>
      </View>
      <View className={styles.info}>
        <Text className={styles.title}>{work.title}</Text>
        <View className={styles.meta}>
          <Text className={styles.size}>{work.size}</Text>
          <Text className={styles.time}>{work.updatedAt}</Text>
        </View>
      </View>
    </View>
  );
};

export default WorkCard;
