import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';

interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  isMine: boolean;
}

interface RouteParams {
  message: {
    id: string;
    profileImage: string;
    userName: string;
    lastMessage: string;
  };
}

// Mock chat messages
const generateMockChatMessages = (): ChatMessage[] => {
  return [
    {
      id: '1',
      text: 'Hey! How are you doing?',
      timestamp: '10:30 AM',
      isMine: false,
    },
    {
      id: '2',
      text: "I'm doing great! Thanks for asking 😊",
      timestamp: '10:32 AM',
      isMine: true,
    },
    {
      id: '3',
      text: 'Did you see the latest updates?',
      timestamp: '10:35 AM',
      isMine: false,
    },
    {
      id: '4',
      text: 'Yes! They look amazing. Really impressed with the new features.',
      timestamp: '10:36 AM',
      isMine: true,
    },
    {
      id: '5',
      text: 'I agree! The team did a fantastic job.',
      timestamp: '10:38 AM',
      isMine: false,
    },
    {
      id: '6',
      text: 'Absolutely! Looking forward to using them.',
      timestamp: '10:40 AM',
      isMine: true,
    },
  ];
};

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { message } = (route.params as RouteParams) || {};

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setMessages(generateMockChatMessages());
  }, []);

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: inputText.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMine: true,
      };
      setMessages([...messages, newMessage]);
      setInputText('');
      
      // Scroll to bottom after sending
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[styles.messageContainer, item.isMine ? styles.myMessageContainer : styles.theirMessageContainer]}>
      {!item.isMine && (
        <Image source={{ uri: message.profileImage }} style={styles.messageProfileImage} />
      )}
      <View style={[styles.messageBubble, item.isMine ? styles.myMessageBubble : styles.theirMessageBubble]}>
        <Text style={[styles.messageText, item.isMine ? styles.myMessageText : styles.theirMessageText]}>
          {item.text}
        </Text>
        <Text style={[styles.messageTimestamp, item.isMine ? styles.myMessageTimestamp : styles.theirMessageTimestamp]}>
          {item.timestamp}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeftIcon color="#0F1419" size={24} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Image source={{ uri: message?.profileImage }} style={styles.headerProfileImage} />
          <Text style={styles.headerTitle}>{message?.userName}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#536471"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={280}
        />
        <TouchableOpacity 
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim()}
          activeOpacity={0.7}
        >
          <Text style={[styles.sendButtonText, !inputText.trim() && styles.sendButtonTextDisabled]}>
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
    backgroundColor: '#fff',
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerProfileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E1E8ED',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F1419',
  },
  headerSpacer: {
    width: 36,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  theirMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageProfileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E1E8ED',
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  myMessageBubble: {
    backgroundColor: '#1D9BF0',
    borderBottomRightRadius: 4,
  },
  theirMessageBubble: {
    backgroundColor: '#EFF3F4',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  myMessageText: {
    color: '#fff',
  },
  theirMessageText: {
    color: '#0F1419',
  },
  messageTimestamp: {
    fontSize: 11,
  },
  myMessageTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
  },
  theirMessageTimestamp: {
    color: '#536471',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EFF3F4',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#EFF3F4',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0F1419',
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#1D9BF0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
  },
  sendButtonDisabled: {
    backgroundColor: '#88C5F0',
  },
  sendButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  sendButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default ChatScreen;
