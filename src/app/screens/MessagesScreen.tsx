import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, FlatList, Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { headerTranslateY, CustomHeader } from '../navigation/BottomTabNavigator';
import { Message } from '../types/Message';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Message>);

// Mock data
const generateMockMessages = (): Message[] => {
  const messages: Message[] = [
    {
      id: '1',
      profileImage: 'https://i.pravatar.cc/150?img=20',
      userName: 'Alice Cooper',
      lastMessage: 'Hey! Did you see the latest updates?',
      timestamp: '5m',
      unread: true,
    },
    {
      id: '2',
      profileImage: 'https://i.pravatar.cc/150?img=21',
      userName: 'Bob Smith',
      lastMessage: 'Thanks for sharing that!',
      timestamp: '1h',
      unread: true,
    },
    {
      id: '3',
      profileImage: 'https://i.pravatar.cc/150?img=22',
      userName: 'Charlie Davis',
      lastMessage: 'See you tomorrow at the meeting',
      timestamp: '3h',
      unread: false,
    },
    {
      id: '4',
      profileImage: 'https://i.pravatar.cc/150?img=23',
      userName: 'Diana Prince',
      lastMessage: 'Let me know when you\'re free',
      timestamp: '5h',
      unread: false,
    },
    {
      id: '5',
      profileImage: 'https://i.pravatar.cc/150?img=24',
      userName: 'Ethan Hunt',
      lastMessage: 'Mission accomplished! 🎉',
      timestamp: '1d',
      unread: false,
    },
    {
      id: '6',
      profileImage: 'https://i.pravatar.cc/150?img=25',
      userName: 'Fiona Green',
      lastMessage: 'Can you send me the files?',
      timestamp: '2d',
      unread: false,
    },
    {
      id: '7',
      profileImage: 'https://i.pravatar.cc/150?img=26',
      userName: 'George Miller',
      lastMessage: 'Perfect, talk soon!',
      timestamp: '3d',
      unread: false,
    },
    {
      id: '8',
      profileImage: 'https://i.pravatar.cc/150?img=27',
      userName: 'Hannah White',
      lastMessage: 'Great job on the presentation',
      timestamp: '1w',
      unread: false,
    },
  ];
  return messages;
};

const MessagesScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);

  useEffect(() => {
    setMessages(generateMockMessages());
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

  const renderMessageItem = ({ item }: { item: Message }) => (
    <TouchableOpacity 
      style={[styles.messageItem, item.unread && styles.unreadItem]}
      activeOpacity={0.7}
      onPress={() => (navigation as any).navigate('ChatScreen', { message: item })}
    >
      <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
      <View style={styles.messageContent}>
        <View style={styles.headerRow}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <Text 
          style={[styles.lastMessage, item.unread && styles.unreadMessage]} 
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>
      {item.unread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <CustomHeader title="Messages" />
      <AnimatedFlatList
        data={messages}
        renderItem={renderMessageItem}
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
  messageItem: {
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
    borderRadius: 24,
    backgroundColor: '#E1E8ED',
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
    paddingRight: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F1419',
  },
  timestamp: {
    fontSize: 13,
    color: '#536471',
  },
  lastMessage: {
    fontSize: 15,
    lineHeight: 20,
    color: '#536471',
  },
  unreadMessage: {
    color: '#0F1419',
    fontWeight: '500',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1D9BF0',
    marginTop: 6,
  },
});

export default MessagesScreen;
