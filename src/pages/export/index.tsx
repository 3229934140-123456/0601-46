import React, { useState, useMemo } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import styles from './index.module.scss';
import { exportRecords as initialRecords } from '@/data/works';
import type { ExportRecord, Work } from '@/types/work';

const ExportPage: React.FC = () => {
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['current']);
  const [selectedFormat, setSelectedFormat] = useState('png');
  const [quality, setQuality] = useState(80);
  const [exportList, setExportList] = useState<ExportRecord[]>([...initialRecords]);
  const [isExporting, setIsExporting] = useState(false);

  const sizes = [
    { id: 'current', name: '当前尺寸', value: '750×1334', isDefault: true },
    { id: 'square', name: '正方形', value: '1080×1080' },
    { id: 'phone', name: '手机全屏', value: '1080×1920' },
    { id: 'banner', name: 'Banner', value: '750×300' },
    { id: 'xhs', name: '小红书', value: '1080×1440' },
    { id: 'long', name: '长图', value: '1080×3840' }
  ];

  const formats = [
    { id: 'png', name: 'PNG', icon: '🖼️' },
    { id: 'jpg', name: 'JPG', icon: '📷' },
    { id: 'pdf', name: 'PDF', icon: '📄' },
    { id: 'longImage', name: '长图', icon: '📜' }
  ];

  const formatCurrentTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const handleSizeToggle = (sizeId: string) => {
    setSelectedSizes(prev => {
      if (prev.includes(sizeId)) {
        return prev.filter(id => id !== sizeId);
      } else {
        return [...prev, sizeId];
      }
    });
  };

  const getSizeValue = (sizeId: string, formatId: string): string => {
    const size = sizes.find(s => s.id === sizeId);
    if (!size) return '';
    if (formatId === 'longImage' || sizeId === 'long') {
      return '1080×3840';
    }
    return size.value;
  };

  const handleExport = () => {
    if (selectedSizes.length === 0) {
      Taro.showToast({
        title: '请选择至少一个尺寸',
        icon: 'none'
      });
      return;
    }

    setIsExporting(true);
    Taro.showLoading({
      title: '正在导出...'
    });

    setTimeout(() => {
      const newRecords: ExportRecord[] = selectedSizes.map((sizeId, index) => {
        const size = sizes.find(s => s.id === sizeId);
        const sizeValue = getSizeValue(sizeId, selectedFormat);
        const format = selectedFormat === 'longImage' ? 'longImage' : selectedFormat as 'png' | 'jpg' | 'pdf' | 'longImage';
        return {
          id: `e${Date.now()}-${index}`,
          workId: 'current',
          workTitle: '618活动主视觉',
          format: format,
          size: sizeValue,
          exportAt: formatCurrentTime(),
          status: 'success' as const
        };
      });

      setExportList(prev => [...newRecords, ...prev]);
      Taro.hideLoading();
      Taro.showToast({
        title: `导出成功(${selectedSizes.length}张)`,
        icon: 'success'
      });
      setIsExporting(false);
    }, 1500);
  };

  const handleDownload = (recordId: string) => {
    console.log('[Export] 下载:', recordId);
    Taro.showToast({
      title: '开始下载',
      icon: 'none'
    });
  };

  const handleSaveToWorks = async () => {
    try {
      const newWork: Work = {
        id: `w${Date.now()}`,
        title: '618活动主视觉',
        cover: 'https://picsum.photos/id/1/400/600',
        status: 'draft',
        size: '750×1334',
        updatedAt: formatCurrentTime(),
        createdAt: formatCurrentTime(),
        tags: ['618', '促销']
      };

      const storageKey = 'draft_works';
      const existingData = await Taro.getStorage({ key: storageKey }).catch(() => ({ data: [] }));
      const existingWorks: Work[] = existingData.data || [];
      const updatedWorks = [newWork, ...existingWorks];
      
      await Taro.setStorage({ key: storageKey, data: updatedWorks });
      
      Taro.showToast({
        title: '已保存到草稿',
        icon: 'success'
      });
    } catch (e) {
      console.error('[Export] 保存失败:', e);
      Taro.showToast({
        title: '保存失败',
        icon: 'none'
      });
    }
  };

  const recentExports = useMemo(() => exportList.slice(0, 4), [exportList]);

  const formatDisplay = (format: string) => {
    if (format === 'longImage') return '长图';
    return format.toUpperCase();
  };

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
              <View className={styles.qualityFill} style={{ width: `${quality}%` }} />
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
                src={`https://picsum.photos/id/${100 + (parseInt(record.id.replace(/\D/g, '').slice(-3)) || 1) % 200}/100/150`}
                mode="aspectFill"
              />
            </View>
            <View className={styles.historyInfo}>
              <Text className={styles.historyName}>{record.workTitle}</Text>
              <Text className={styles.historyMeta}>
                {formatDisplay(record.format)} · {record.size} · {record.exportAt}
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
        <View className={styles.secondaryBtn} onClick={handleSaveToWorks}>
          <Text>保存到作品</Text>
        </View>
        <View
          className={classNames(styles.primaryBtn, (isExporting || selectedSizes.length === 0) && styles.disabled)}
          onClick={handleExport}
        >
          <Text>{isExporting ? '导出中...' : `立即导出 (${selectedSizes.length}个)`}</Text>
        </View>
      </View>
    </View>
  );
};

export default ExportPage;
