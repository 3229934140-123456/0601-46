import React, { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import styles from './index.module.scss';
import { comments, historyRecords } from '@/data/works';

const CollaborationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'comments' | 'history'>('comments');

  const handleInvite = () => {
    console.log('[Collaboration] 邀请成员');
    Taro.showToast({
      title: '邀请成员',
      icon: 'none'
    });
  };

  const handleSendComment = () => {
    console.log('[Collaboration] 发送批注');
    Taro.showToast({
      title: '已发送批注',
      icon: 'success'
    });
  };

  const handleReply = (commentId: string) => {
    console.log('[Collaboration] 回复批注:', commentId);
    Taro.showToast({
      title: '回复功能',
      icon: 'none'
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.workHeader}>
        <View className={styles.workCover}>
          <Image
            className={styles.workCoverImg}
            src="https://picsum.photos/id/1/200/300"
            mode="aspectFill"
          />
        </View>
        <View className={styles.workInfo}>
          <Text className={styles.workTitle}>618活动主视觉</Text>
          <Text className={styles.workMeta}>750 × 1334 · 草稿</Text>
        </View>
        <View className={styles.inviteBtn} onClick={handleInvite}>
          <Text className={styles.inviteBtnText}>+ 邀请</Text>
        </View>
      </View>

      <View className={styles.tabBar}>
        <View
          className={classNames(styles.tabItem, activeTab === 'comments' && styles.active)}
          onClick={() => setActiveTab('comments')}
        >
          <Text className={styles.tabText}>批注 ({comments.length})</Text>
        </View>
        <View
          className={classNames(styles.tabItem, activeTab === 'history' && styles.active)}
          onClick={() => setActiveTab('history')}
        >
          <Text className={styles.tabText}>修改历史</Text>
        </View>
      </View>

      {activeTab === 'comments' && (
        <View className={styles.commentList}>
          {comments.map(comment => (
            <View key={comment.id} className={styles.commentItem}>
              <View className={styles.commentAvatar}>
                <Image
                  className={styles.commentAvatarImg}
                  src={comment.avatar}
                  mode="aspectFill"
                />
              </View>
              <View className={styles.commentContent}>
                <View className={styles.commentHeader}>
                  <Text className={styles.commenterName}>{comment.userName}</Text>
                  <Text className={styles.commentTime}>{comment.createdAt}</Text>
                </View>
                <Text className={styles.commentText}>{comment.content}</Text>
                {comment.position && (
                  <View className={styles.commentPosition}>
                    <Text className={styles.positionText}>
                      📍 位置: ({comment.position.x}, {comment.position.y})
                    </Text>
                  </View>
                )}
                <Text
                  className={styles.replyBtn}
                  onClick={() => handleReply(comment.id)}
                >
                  回复
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {activeTab === 'history' && (
        <View className={styles.historyList}>
          {historyRecords.map(record => (
            <View key={record.id} className={styles.historyItem}>
              <View className={styles.historyDot} />
              <View className={styles.historyContent}>
                <Text className={styles.historyText}>{record.action}</Text>
                <Text className={styles.historyUser}>{record.userName}</Text>
                <Text className={styles.historyTime}>{record.createdAt}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View className={styles.bottomBar}>
        <View className={styles.inputArea}>
          <Text className={styles.inputPlaceholder}>输入批注内容...</Text>
        </View>
        <View className={styles.sendBtn} onClick={handleSendComment}>
          <Text>➤</Text>
        </View>
      </View>
    </View>
  );
};

export default CollaborationPage;
