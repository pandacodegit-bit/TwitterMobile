import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, FlatList, Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { headerTranslateY, CustomHeader } from '../navigation/BottomTabNavigator';
import { Notification } from '../types/Notification';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Notification>);

// Mock data
const generateMockNotifications = (): Notification[] => {
  const notifications: Notification[] = [
    {
      id: '1',
      profileImage: 'https://i.pravatar.cc/150?img=10',
      userName: 'Sarah Johnson',
      text: 'liked your post',
      timestamp: '2m',
      read: false,
    },
    {
      id: '2',
      profileImage: 'https://i.pravatar.cc/150?img=11',
      userName: 'Mike Chen',
      text: 'started following you',
      timestamp: '15m',
      read: false,
    },
    {
      id: '3',
      profileImage: 'https://i.pravatar.cc/150?img=12',
      userName: 'Emma Wilson',
      text: 'commented on your post: "Great content!"',
      timestamp: '1h',
      read: true,
    },
    {
      id: '4',
      profileImage: 'https://i.pravatar.cc/150?img=13',
      userName: 'David Brown',
      text: 'reposted your video',
      timestamp: '2h',
      read: true,
    },
    {
      id: '5',
      profileImage: 'https://i.pravatar.cc/150?img=14',
      userName: 'Lisa Anderson',
      text: 'mentioned you in a comment',
      timestamp: '3h',
      read: true,
    },
    {
      id: '6',
      profileImage: 'https://i.pravatar.cc/150?img=15',
      userName: 'James Taylor',
      text: 'liked your comment',
      timestamp: '5h',
      read: true,
    },
    {
      id: '7',
      profileImage: 'https://i.pravatar.cc/150?img=16',
      userName: 'Jessica Martinez',
      text: 'started following you',
      timestamp: '1d',
      read: true,
    },
    {
      id: '8',
      profileImage: 'https://i.pravatar.cc/150?img=17',
      userName: 'Robert Lee',
      text: 'shared your post',
      timestamp: '2d',
      read: true,
    },
  ];
  return notifications;
};

const NotificationsScreen = () => {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);

  useEffect(() => {
    setNotifications(generateMockNotifications());
  }, []);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: (event: any) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        const diff = currentScrollY - lastScrollY.current;

        if (diff > 0 && currentScrollY > 50) {
          // Scrolling down - hide header
          Animated.timing(headerTranslateY, {
            toValue: -100,
            duration: 200,
            useNativeDriver: true,
          }).start();
        } else if (diff < 0) {
          // Scrolling up - show header
          Animated.timing(headerTranslateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }

        lastScrollY.current = currentScrollY;
      },
    }
  );

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, !item.read && styles.unreadItem]}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
      <View style={styles.notificationContent}>
        <Text style={styles.notificationText}>
          <Text style={styles.userName}>{item.userName}</Text>
          {' '}
          <Text style={styles.actionText}>{item.text}</Text>
        </Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <CustomHeader title="Notifications" />
      <AnimatedFlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingTop: insets.top + 64 }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingBottom: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
    backgroundColor: '#fff',
  },
  unreadItem: {
    backgroundColor: '#F7F9FA',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 4,
    backgroundColor: '#E1E8ED',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
    paddingRight: 8,
  },
  notificationText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#0F1419',
    marginBottom: 4,
  },
  userName: {
    fontWeight: '700',
    color: '#0F1419',
  },
  actionText: {
    fontWeight: '400',
    color: '#536471',
  },
  timestamp: {
    fontSize: 13,
    color: '#536471',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1D9BF0',
    marginTop: 6,
  },
});

export default NotificationsScreen;
