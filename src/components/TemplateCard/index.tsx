import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import styles from './index.module.scss';
import type { Template } from '@/types/template';

interface TemplateCardProps {
  template: Template;
  onClick?: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: '/pages/canvas/index?templateId=' + template.id
      });
    }
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.imageWrap}>
        <Image
          className={styles.image}
          src={template.cover}
          mode="aspectFill"
          lazyLoad
        />
        {(template.isHot || template.isNew) && (
          <View className={styles.tagWrap}>
            {template.isHot && (
              <View className={classNames(styles.tag, styles.tagHot)}>
                <Text className={styles.tagText}>热门</Text>
              </View>
            )}
            {template.isNew && (
              <View className={classNames(styles.tag, styles.tagNew)}>
                <Text className={styles.tagText}>新品</Text>
              </View>
            )}
          </View>
        )}
        <View className={styles.sizeTag}>
          <Text className={styles.sizeText}>{template.size}</Text>
        </View>
      </View>
      <View className={styles.info}>
        <Text className={styles.title}>{template.title}</Text>
        <View className={styles.meta}>
          <Text className={styles.usedCount}>{template.usedCount} 人使用</Text>
          <View className={styles.sceneTag}>
            <Text className={styles.sceneText}>{template.scene}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TemplateCard;
