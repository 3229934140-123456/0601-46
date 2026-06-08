import React, { useState } from 'react';
import { View, Text, Image, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import styles from './index.module.scss';
import { comments as initialComments, historyRecords } from '@/data/works';
import type { Comment } from '@/types/work';

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

const mockMembers: TeamMember[] = [
  { id: 'u1', name: '张设计师', avatar: 'https://picsum.photos/id/177/100/100', role: '设计师' },
  { id: 'u2', name: '李经理', avatar: 'https://picsum.photos/id/1027/100/100', role: '产品经理' },
  { id: 'u3', name: '王运营', avatar: 'https://picsum.photos/id/1012/100/100', role: '运营' },
];

const candidateMembers: TeamMember[] = [
  { id: 'u4', name: '陈市场', avatar: 'https://picsum.photos/id/1005/100/100', role: '市场' },
  { id: 'u5', name: '刘策划', avatar: 'https://picsum.photos/id/1011/100/100', role: '策划' },
  { id: 'u6', name: '赵设计', avatar: 'https://picsum.photos/id/1025/100/100', role: '设计师' },
];

const CollaborationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'comments' | 'history'>('comments');
  const [commentText, setCommentText] = useState('');
  const [commentList, setCommentList] = useState<Comment[]>([...initialComments]);
  const [members, setMembers] = useState<TeamMember[]>([...mockMembers]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteCandidateIndex, setInviteCandidateIndex] = useState(0);

  const formatCurrentTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const handleInvite = () => {
    setShowInviteModal(true);
  };

  const handleCloseInvite = () => {
    setShowInviteModal(false);
  };

  const handleAddMember = () => {
    if (inviteCandidateIndex >= candidateMembers.length) {
      Taro.showToast({
        title: '没有更多可邀请的成员了',
        icon: 'none'
      });
      return;
    }
    const newMember = candidateMembers[inviteCandidateIndex];
    if (members.find(m => m.id === newMember.id)) {
      setInviteCandidateIndex(prev => prev + 1);
      return;
    }
    setMembers(prev => [...prev, newMember]);
    setInviteCandidateIndex(prev => prev + 1);
    Taro.showToast({
      title: `已邀请${newMember.name}`,
      icon: 'success'
    });
    setTimeout(() => {
      setShowInviteModal(false);
    }, 800);
  };

  const handleSendComment = () => {
    if (!commentText.trim()) {
      Taro.showToast({
        title: '请输入批注内容',
        icon: 'none'
      });
      return;
    }
    const newComment: Comment = {
      id: `c${Date.now()}`,
      workId: 'w1',
      userId: 'me',
      userName: '我',
      avatar: 'https://picsum.photos/id/64/100/100',
      content: commentText.trim(),
      createdAt: formatCurrentTime(),
    };
    setCommentList(prev => [newComment, ...prev]);
    setCommentText('');
    Taro.showToast({
      title: '已发送',
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

      <View className={styles.memberSection}>
        <View className={styles.memberList}>
          {members.map(member => (
            <View key={member.id} className={styles.memberItem}>
              <Image
                className={styles.memberAvatar}
                src={member.avatar}
                mode="aspectFill"
              />
              <Text className={styles.memberName}>{member.name}</Text>
            </View>
          ))}
        </View>
        <View className={styles.memberCount}>
          <Text className={styles.memberCountText}>{members.length}位成员</Text>
        </View>
      </View>

      <View className={styles.tabBar}>
        <View
          className={classNames(styles.tabItem, activeTab === 'comments' && styles.active)}
          onClick={() => setActiveTab('comments')}
        >
          <Text className={styles.tabText}>批注 ({commentList.length})</Text>
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
          {commentList.map(comment => (
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
          <Input
            className={styles.inputField}
            value={commentText}
            onInput={(e) => setCommentText(e.detail.value)}
            placeholder="输入批注内容..."
            placeholderClass={styles.inputPlaceholder}
            confirmType="send"
            onConfirm={handleSendComment}
          />
        </View>
        <View className={classNames(styles.sendBtn, !commentText.trim() && styles.disabled)} onClick={handleSendComment}>
          <Text>➤</Text>
        </View>
      </View>

      {showInviteModal && (
        <View className={styles.modalOverlay} onClick={handleCloseInvite}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>邀请成员</Text>
              <Text className={styles.modalClose} onClick={handleCloseInvite}>✕</Text>
            </View>
            <View className={styles.modalBody}>
              {inviteCandidateIndex < candidateMembers.length ? (
                <View className={styles.inviteCandidate}>
                  <Image
                    className={styles.candidateAvatar}
                    src={candidateMembers[inviteCandidateIndex].avatar}
                    mode="aspectFill"
                  />
                  <View className={styles.candidateInfo}>
                    <Text className={styles.candidateName}>
                      {candidateMembers[inviteCandidateIndex].name}
                    </Text>
                    <Text className={styles.candidateRole}>
                      {candidateMembers[inviteCandidateIndex].role}
                    </Text>
                  </View>
                </View>
              ) : (
                <View className={styles.noMoreMembers}>
                  <Text className={styles.noMoreText}>没有更多可邀请的成员了</Text>
                </View>
              )}
            </View>
            <View className={styles.modalFooter}>
              <View className={styles.cancelBtn} onClick={handleCloseInvite}>
                <Text className={styles.cancelBtnText}>取消</Text>
              </View>
              <View
                className={classNames(styles.confirmBtn, inviteCandidateIndex >= candidateMembers.length && styles.disabled)}
                onClick={handleAddMember}
              >
                <Text className={styles.confirmBtnText}>邀请</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default CollaborationPage;
