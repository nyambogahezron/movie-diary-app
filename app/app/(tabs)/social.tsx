import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image,
  ScrollView
} from 'react-native';
import { Heart, MessageCircle, Share2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useSocialFeed } from '@/hooks/useSocialFeed';
import UserAvatar from '@/components/UserAvatar';
import MediaMiniCard from '@/components/MediaMiniCard';
import RatingStars from '@/components/RatingStars';
import EmptyState from '@/components/EmptyState';

export default function SocialScreen() {
  const { posts, isLoading, error } = useSocialFeed();
  const [activeTab, setActiveTab] = useState('following');

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Something went wrong</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
      </View>
    );
  }

  const renderTabButton = (tab: string, label: string) => (
    <TouchableOpacity 
      style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
      onPress={() => setActiveTab(tab)}>
      <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
        {label}
      </Text>
      {activeTab === tab && <View style={styles.tabIndicator} />}
    </TouchableOpacity>
  );

  const renderPostItem = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <UserAvatar user={item.user} size={40} />
        <View style={styles.postHeaderText}>
          <Text style={styles.userName}>{item.user.name}</Text>
          <Text style={styles.postTime}>{item.timeAgo}</Text>
        </View>
      </View>
      
      <MediaMiniCard media={item.media} />
      
      <View style={styles.postContent}>
        <View style={styles.ratingContainer}>
          <RatingStars rating={item.rating} size={16} />
          <Text style={styles.ratingText}>{item.rating}/5</Text>
        </View>
        
        <Text style={styles.reviewText}>{item.review}</Text>
      </View>
      
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Heart size={20} color={Colors.neutral[400]} />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle size={20} color={Colors.neutral[400]} />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Share2 size={20} color={Colors.neutral[400]} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Social Feed</Text>
      </View>
      <View style={styles.tabsContainer}>
        {renderTabButton('following', 'Following')}
        {renderTabButton('popular', 'Popular')}
        {renderTabButton('discover', 'Discover')}
      </View>
      <View style={styles.contentContainer}>
        {posts.length > 0 ? (
          <FlatList
            data={posts}
            renderItem={renderPostItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyState 
            message="No posts to show" 
            subMessage="Follow users to see their activity here" 
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[950],
  },
  header: {
    padding: 16,
    paddingTop: 48,
    paddingBottom: 8,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: Colors.neutral[50],
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[800],
  },
  contentContainer: {
    flex: 1,
  },
  tabButton: {
    paddingVertical: 16,
    marginRight: 24,
    position: 'relative',
  },
  tabButtonActive: {},
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.neutral[400],
  },
  tabTextActive: {
    color: Colors.neutral[50],
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.primary[500],
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  postContainer: {
    backgroundColor: Colors.neutral[900],
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  postHeaderText: {
    marginLeft: 12,
  },
  userName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.neutral[100],
  },
  postTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[500],
  },
  postContent: {
    marginTop: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.accent[500],
    marginLeft: 8,
  },
  reviewText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.neutral[200],
    lineHeight: 22,
  },
  postActions: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[800],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[400],
    marginLeft: 6,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.neutral[100],
    marginBottom: 8,
  },
  errorSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[400],
    textAlign: 'center',
  },
});