import React, { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import styles from './index.module.scss';
import { exportRecords } from '@/data/works';

const ExportPage: React.FC = () => {
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['current']);
  const [selectedFormat, setSelectedFormat] = useState('png');
  const [quality, setQuality] = useState(80);

  const sizes = [
    { id: 'current', name: '当前尺寸', value: '750 × 1334', isDefault: true },
    { id: 'square', name: '正方形', value: '1080 × 1080' },
    { id: 'phone', name: '手机全屏', value: '1080 × 1920' },
    { id: 'banner', name: 'Banner', value: '750 × 300' },
    { id: 'xhs', name: '小红书', value: '1080 × 1440' },
    { id: 'long', name: '长图', value: '1080 × 3840' }
  ];

  const formats = [
    { id: 'png', name: 'PNG', icon: '🖼️' },
    { id: 'jpg', name: 'JPG', icon: '📷' },
    { id: 'pdf', name: 'PDF', icon: '📄' },
    { id: 'longImage', name: '长图', icon: '📜' }
  ];

  const handleSizeToggle = (sizeId: string) => {
    setSelectedSizes(prev => {
      if (prev.includes(sizeId)) {
        return prev.filter(id => id !== sizeId);
      } else {
        return [...prev, sizeId];
      }
    });
    console.log('[Export] 选择尺寸:', sizeId);
  };

  const handleExport = () => {
    console.log('[Export] 开始导出:', {
      sizes: selectedSizes,
      format: selectedFormat,
      quality
    });
    Taro.showLoading({
      title: '正在导出...'
    });
    setTimeout(() => {
      Taro.hideLoading();
      Taro.showToast({
        title: '导出成功',
        icon: 'success'
      });
    }, 2000);
  };

  const handleDownload = (recordId: string) => {
    console.log('[Export] 下载:', recordId);
    Taro.showToast({
      title: '开始下载',
      icon: 'none'
    });
  };

  const recentExports = exportRecords.slice(0, 4);

  return (
    <View className={styles.page}>
      <View className={styles.workPreview}>
        <Text className={styles.previewTitle}>618活动主视觉</Text>
        <View className={styles.previewImage}>
          <Image
            className={styles.previewImg}
            src="https://picsum.photos/id/1/300/400"
            mode="aspectFill"
          />
        </View>
      </View>

      <View className={styles.sizeSelector}>
        <View className={styles.sectionTitle}>导出尺寸</View>
        <View className={styles.sizeList}>
          {sizes.map(size => (
            <View
              key={size.id}
              className={classNames(styles.sizeItem, selectedSizes.includes(size.id) && styles.active)}
              onClick={() => handleSizeToggle(size.id)}
            >
              <View
                className={classNames(styles.sizeCheck, selectedSizes.includes(size.id) && styles.active)}
              >
                {selectedSizes.includes(size.id) && (
                  <Text className={styles.checkIcon}>✓</Text>
                )}
              </View>
              <View className={styles.sizeInfo}>
                <Text className={styles.sizeName}>{size.name}</Text>
                <Text className={styles.sizeValue}>{size.value}</Text>
              </View>
              {size.isDefault && (
                <View className={styles.sizeTag}>
                  <Text className={styles.sizeTagText}>默认</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      <View className={styles.formatSelector}>
        <View className={styles.sectionTitle}>导出格式</View>
        <View className={styles.formatList}>
          {formats.map(format => (
            <View
              key={format.id}
              className={classNames(styles.formatItem, selectedFormat === format.id && styles.active)}
              onClick={() => setSelectedFormat(format.id)}
            >
              <Text className={styles.formatIcon}>{format.icon}</Text>
              <Text className={styles.formatName}>{format.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.qualitySelector}>
        <View className={styles.sectionTitle}>导出质量</View>
        <View className={styles.qualityList}>
          <View className={styles.qualityItem}>
            <Text className={styles.qualityLabel}>图片质量</Text>
            <View className={styles.qualitySlider}>
              <View className={styles.qualityFill} />
            </View>
            <Text className={styles.qualityValue}>{quality}%</Text>
          </View>
        </View>
      </View>

      <View className={styles.historySection}>
        <Text className={styles.historyTitle}>最近导出</Text>
        {recentExports.map(record => (
          <View
            key={record.id}
            className={styles.historyItem}
            onClick={() => handleDownload(record.id)}
          >
            <View className={styles.historyCover}>
              <Image
                className={styles.historyCoverImg}
                src={`https://picsum.photos/id/${100 + parseInt(record.id.slice(1))}/100/150`}
                mode="aspectFill"
              />
            </View>
            <View className={styles.historyInfo}>
              <Text className={styles.historyName}>{record.workTitle}</Text>
              <Text className={styles.historyMeta}>
                {record.format.toUpperCase()} · {record.size} · {record.exportAt}
              </Text>
            </View>
            <View
              className={classNames(
                styles.historyStatus,
                record.status === 'success' ? styles.statusSuccess : styles.statusProcessing
              )}
            >
              <Text style={{ fontSize: '22rpx' }}>
                {record.status === 'success' ? '成功' : '处理中'}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.secondaryBtn}>
          <Text>保存到作品</Text>
        </View>
        <View className={styles.primaryBtn} onClick={handleExport}>
          <Text>立即导出 ({selectedSizes.length}个)</Text>
        </View>
      </View>
    </View>
  );
};

export default ExportPage;
