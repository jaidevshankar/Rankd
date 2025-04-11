import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Friend = {
  id: string;
  name: string;
  avatar: string;
};

// Sample friend data - in a real app, this would come from your backend
const initialFriends: Friend[] = [
  { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: '4', name: 'Sarah Williams', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: '5', name: 'David Brown', avatar: 'https://i.pravatar.cc/150?img=5' },
];

export default function PeopleScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<Friend[]>(initialFriends);

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFriend = ({ item }: { item: Friend }) => (
    <View style={styles.friendItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <Text style={styles.friendName}>{item.name}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Friends</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search friends..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredFriends}
        renderItem={renderFriend}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '500',
  },
});

