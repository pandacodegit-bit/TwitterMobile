import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';

interface BlockedAccount {
  id: string;
  userName: string;
  userId: string;
  profileImage: string;
  isBlocked: boolean;
}

const BlockedAccountsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [blockedAccounts, setBlockedAccounts] = useState<BlockedAccount[]>([
    {
      id: '1',
      userName: 'Spam Account',
      userId: 'spammer123',
      profileImage: 'https://i.pravatar.cc/150?img=30',
      isBlocked: true,
    },
    {
      id: '2',
      userName: 'Bot User',
      userId: 'botuser456',
      profileImage: 'https://i.pravatar.cc/150?img=31',
      isBlocked: true,
    },
    {
      id: '3',
      userName: 'Troll Account',
      userId: 'troll789',
      profileImage: 'https://i.pravatar.cc/150?img=32',
      isBlocked: true,
    },
  ]);

  const handleToggleBlock = (accountId: string) => {
    setBlockedAccounts(accounts =>
      accounts.map(account =>
        account.id === accountId
          ? { ...account, isBlocked: !account.isBlocked }
          : account
      )
    );
  };

  const renderAccount = ({ item }: { item: BlockedAccount }) => (
    <View style={styles.accountItem}>
      <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
      <View style={styles.accountInfo}>
        <Text style={styles.userId}>{item.userId}</Text>
      </View>
      <TouchableOpacity
        style={[styles.blockButton, item.isBlocked && styles.blockedButton]}
        onPress={() => handleToggleBlock(item.id)}
        activeOpacity={0.7}
      >
        <Text style={[styles.blockButtonText, item.isBlocked && styles.blockedButtonText]}>
          {item.isBlocked ? 'Blocked' : 'Block'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeftIcon color="#0F1419" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blocked Accounts</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={blockedAccounts}
        renderItem={renderAccount}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No blocked accounts</Text>
          </View>
        }
      />
    </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F1419',
  },
  placeholder: {
    width: 28,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  accountInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F1419',
  },
  userId: {
    fontSize: 14,
    color: '#000',
    marginTop: 2,
  },
  blockButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#0F1419',
  },
  blockedButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CFD9DE',
  },
  blockButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  blockedButtonText: {
    color: '#0F1419',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#536471',
  },
});

export default BlockedAccountsScreen;
