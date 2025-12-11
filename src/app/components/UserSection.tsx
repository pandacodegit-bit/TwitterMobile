import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import PinIcon from './icons/PinIcon';
import TrashIcon from './icons/TrashIcon';
import ChatIcon from './icons/ChatIcon';

interface UserSectionProps {
  profileImage: string;
  userName: string;
  userId: string;
  timestamp?: string;
}

const UserSection = ({ profileImage, userName, userId, timestamp }: UserSectionProps) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleMenuAction = (action: string) => {
    setMenuVisible(false);
    // Handle actions: Pin, Delete, Who can reply
    console.log(`Action: ${action}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
        <View style={styles.userInfo}>
          <View style={styles.userIdRow}>
            <Text style={styles.userId}>{userId}</Text>
            {timestamp && (
              <>
                <Text style={styles.dot}>·</Text>
                <Text style={styles.timestamp}>{timestamp}</Text>
              </>
            )}
          </View>
        </View>
      </View>
      
      <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
        <Text style={styles.menuDots}>⋯</Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuPopup}>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuAction('pin')}>
              <PinIcon color="#0F1419" size={20} />
              <Text style={styles.menuItemText}>Pin</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuAction('delete')}>
              <TrashIcon color="#0F1419" size={20} />
              <Text style={[styles.menuItemText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuAction('reply')}>
              <ChatIcon color="#0F1419" size={20} />
              <Text style={styles.menuItemText}>Who can reply</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  leftSection: {
    flexDirection: 'row',
    flex: 1,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 4,
    backgroundColor: '#E1E8ED',
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F1419',
  },
  userIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  userId: {
    fontSize: 15,
    color: '#000',
  },
  dot: {
    fontSize: 15,
    color: '#000',
    marginHorizontal: 4,
  },
  timestamp: {
    fontSize: 15,
    color: '#000',
  },
  menuButton: {
    padding: 4,
  },
  menuDots: {
    fontSize: 20,
    color: '#536471',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuPopup: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#0F1419',
  },
  deleteText: {
    color: '#0F1419',
  },
});

export default UserSection;
