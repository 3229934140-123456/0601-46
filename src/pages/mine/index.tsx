import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const MinePage: React.FC = () => {
  const handleBrandAssets = () => {
    console.log('[Mine] 跳转到品牌资产');
    Taro.navigateTo({
      url: '/pages/brand-assets/index'
    });
  };

  const handleExportHistory = () => {
    console.log('[Mine] 跳转到导出历史');
    Taro.navigateTo({
      url: '/pages/export/index'
    });
  };

  const handleCollaboration = () => {
    console.log('[Mine] 跳转到协作管理');
    Taro.navigateTo({
      url: '/pages/collaboration/index'
    });
  };

  const handleMenuItem = (itemName: string) => {
    console.log('[Mine] 点击菜单项:', itemName);
    Taro.showToast({
      title: itemName,
      icon: 'none'
    });
  };

  const handleAddMember = () => {
    console.log('[Mine] 添加成员');
    Taro.showToast({
      title: '邀请成员',
      icon: 'none'
    });
  };

  const menuItems = [
    { icon: '⭐', text: '我的收藏', desc: '收藏的模板和素材' },
    { icon: '📦', text: '导出历史', desc: '查看所有导出记录', action: handleExportHistory },
    { icon: '🤝', text: '协作管理', desc: '3个协作项目', badge: '3', action: handleCollaboration }
  ];

  const settingItems = [
    { icon: '⚙️', text: '设置' },
    { icon: '❓', text: '帮助中心' },
    { icon: '💬', text: '意见反馈' },
    { icon: 'ℹ️', text: '关于我们' }
  ];

  const teamMembers = [
    { id: 1, avatar: 'https://picsum.photos/id/177/100/100' },
    { id: 2, avatar: 'https://picsum.photos/id/1027/100/100' },
    { id: 3, avatar: 'https://picsum.photos/id/1012/100/100' },
    { id: 4, avatar: 'https://picsum.photos/id/338/100/100' },
    { id: 5, avatar: 'https://picsum.photos/id/64/100/100' }
  ];

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.userInfo}>
          <View className={styles.avatar}>
            <Image
              className={styles.avatarImg}
              src="https://picsum.photos/id/177/200/200"
              mode="aspectFill"
            />
          </View>
          <View className={styles.userDetail}>
            <Text className={styles.userName}>张设计师</Text>
            <View className={styles.userRole}>
              <Text className={styles.roleText}>✨ 专业版会员</Text>
            </View>
          </View>
          <View className={styles.settingBtn} onClick={() => handleMenuItem('设置')}>
            <Text className={styles.settingIcon}>⚙️</Text>
          </View>
        </View>

        <View className={styles.statsCard}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>28</Text>
            <Text className={styles.statLabel}>作品</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>156</Text>
            <Text className={styles.statLabel}>导出次数</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>42</Text>
            <Text className={styles.statLabel}>收藏</Text>
          </View>
        </View>
      </View>

      <View className={styles.brandCard} onClick={handleBrandAssets}>
        <View className={styles.brandIcon}>
          <Text>🎨</Text>
        </View>
        <View className={styles.brandInfo}>
          <Text className={styles.brandTitle}>品牌资产管理</Text>
          <Text className={styles.brandDesc}>管理品牌色、字体和常用组件</Text>
        </View>
        <View className={styles.brandAction}>
          <Text className={styles.brandActionText}>去设置</Text>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionTitle}>常用功能</View>
        <View className={styles.menuList}>
          {menuItems.map((item, index) => (
            <View
              key={index}
              className={styles.menuItem}
              onClick={item.action || (() => handleMenuItem(item.text))}
            >
              <View className={styles.menuIcon}>
                <Text>{item.icon}</Text>
              </View>
              <View className={styles.menuContent}>
                <Text className={styles.menuText}>{item.text}</Text>
                {item.desc && <Text className={styles.menuDesc}>{item.desc}</Text>}
              </View>
              {item.badge && (
                <View className={styles.menuBadge}>
                  <Text className={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
              <Text className={styles.menuArrow}>›</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.teamSection}>
        <Text className={styles.teamTitle}>我的团队</Text>
        <View className={styles.teamCard}>
          <View className={styles.teamHeader}>
            <View className={styles.teamAvatar}>
              <Text>🏢</Text>
            </View>
            <View className={styles.teamName}>
              <Text className={styles.teamNameText}>品牌设计组</Text>
              <Text className={styles.teamMembers}>{teamMembers.length} 位成员</Text>
            </View>
          </View>
          <View className={styles.teamMembersRow}>
            {teamMembers.map(member => (
              <View key={member.id} className={styles.memberAvatar}>
                <Image
                  className={styles.memberImg}
                  src={member.avatar}
                  mode="aspectFill"
                />
              </View>
            ))}
            <View className={styles.addMember} onClick={handleAddMember}>
              <Text>+</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionTitle}>设置与帮助</View>
        <View className={styles.menuList}>
          {settingItems.map((item, index) => (
            <View
              key={index}
              className={styles.menuItem}
              onClick={() => handleMenuItem(item.text)}
            >
              <View className={styles.menuIcon}>
                <Text>{item.icon}</Text>
              </View>
              <View className={styles.menuContent}>
                <Text className={styles.menuText}>{item.text}</Text>
              </View>
              <Text className={styles.menuArrow}>›</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default MinePage;
