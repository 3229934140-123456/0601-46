import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import classNames from 'classnames';
import styles from './index.module.scss';
import type { Material } from '@/types/material';

interface MaterialCardProps {
  material: Material;
  onClick?: () => void;
  onFavorite?: () => void;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material, onClick, onFavorite }) => {
  const handleFavorite = (e: any) => {
    e.stopPropagation();
    if (onFavorite) {
      onFavorite();
    }
  };

  return (
    <View className={styles.card} onClick={onClick}>
      <View className={styles.imageWrap}>
        <Image
          className={styles.image}
          src={material.cover}
          mode="aspectFill"
          lazyLoad
        />
        <View className={styles.favoriteBtn} onClick={handleFavorite}>
          <Text className={classNames(styles.favoriteIcon, material.isFavorite && styles.active)}>
            {material.isFavorite ? '♥' : '♡'}
          </Text>
        </View>
      </View>
      <View className={styles.info}>
        <Text className={styles.name}>{material.name}</Text>
      </View>
    </View>
  );
};

export default MaterialCard;
