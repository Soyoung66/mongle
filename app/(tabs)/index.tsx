import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import DetailModal from '../component/DetailModal';
import SentenceModal from '../component/SentenceModal';
import Sidebar from '../component/Sidebar';

interface SentenceItem {
  id: string;
  content: string;
  date: string;
}

export default function HomeScreen() {
  const [deleting, setDeleting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sentenceModalVisible, setSentenceModalVisible] = useState(false);
  const [todaySentence, setTodaySentence] = useState('');

  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedSentence, setSelectedSentence] = useState<SentenceItem | null>(null);

  const [sentenceList, setSentenceList] = useState<SentenceItem[]>([
    { id: '1', content: '작은 일에도 감사할 수 있는 여유를 가진 하루.', date: '2026.06.07' },
    { id: '2', content: '구름이 가득했지만 마음만큼은 맑고 포근했던 시간.', date: '2026.06.06' },
    { id: '3', content: '시작이 반이다. 오늘도 한 걸음 소중하게 내딛기.', date: '2026.06.05' },
  ]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('[ERROR] 로그아웃 실패:', error);
      return;
    }
    router.replace('/(auth)/login' as any);
  };

  const handleDeleteAccount = () => {
    setSidebarOpen(false);
    Alert.alert(
      '회원탈퇴',
      '정말 탈퇴하시겠어요? 모든 데이터가 삭제되며 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        { text: '탈퇴하기', style: 'destructive', onPress: confirmDeleteAccount },
      ]
    );
  };

  const confirmDeleteAccount = async () => {
    try {
      setDeleting(true);
      const { error } = await supabase.rpc('delete_my_account');
      if (error) {
        Alert.alert('오류', '탈퇴 처리 중 문제가 발생했습니다.');
        return;
      }
      await supabase.auth.signOut();
      router.replace('/(auth)/login' as any);
    } catch (err) {
      Alert.alert('오류', '알 수 없는 오류가 발생했습니다.');
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveSentence = () => {
    if (!todaySentence.trim()) {
      Alert.alert('알림', '오늘 하루의 문장을 입력해주세요.');
      return;
    }

    const newItem: SentenceItem = {
      id: Date.now().toString(),
      content: todaySentence,
      date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
    };

    setSentenceList([newItem, ...sentenceList]);
    setTodaySentence('');
    setSentenceModalVisible(false);
  };

  const handleDeleteSentence = (id: string) => {
    Alert.alert('문장 삭제', '이 문장을 삭제하시겠어요?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => setSentenceList(sentenceList.filter((item) => item.id !== id)) },
    ]);
  };

  const handleOpenDetail = (item: SentenceItem) => {
    setSelectedSentence(item);
    setDetailModalVisible(true);
  };

  const renderSentenceItem = ({ item }: { item: SentenceItem }) => (
    <View style={styles.sentenceCard}>
      <TouchableOpacity style={styles.cardMainTouchable} onPress={() => handleOpenDetail(item)}>
        <Text style={styles.cardDate}>{item.date}</Text>
        <Text style={styles.cardContent} numberOfLines={2}>"{item.content}"</Text>
      </TouchableOpacity>
      
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleOpenDetail(item)}>
          <Text style={styles.actionDetailText}>자세히</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleDeleteSentence(item.id)}>
          <Text style={styles.actionDeleteText}>삭제</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setSidebarOpen(true)}>
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>몽글(Mongle)</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>안녕하세요, 오늘도 몽글한 하루 보내세요 ✨</Text>

        <TouchableOpacity style={styles.sentenceButton} onPress={() => setSentenceModalVisible(true)}>
          <Text style={styles.sentenceButtonText}>✏️ 오늘 하루의 문장 남기기</Text>
        </TouchableOpacity>

        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>내가 기록한 문장들</Text>
          <FlatList
            data={sentenceList}
            keyExtractor={(item) => item.id}
            renderItem={renderSentenceItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>아직 기록된 문장이 없어요. 첫 문장을 남겨보세요!</Text>
            }
          />
        </View>
      </View>

      <Sidebar 
        visible={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
        deleting={deleting}
      />

      <SentenceModal 
        visible={sentenceModalVisible}
        onClose={() => setSentenceModalVisible(false)}
        value={todaySentence}
        onChangeText={setTodaySentence}
        onSave={handleSaveSentence}
      />

      <DetailModal 
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        item={selectedSentence}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { height: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 40, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#333' },
  menuButton: { width: 40, height: 40, justifyContent: 'center' },
  menuButtonText: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  welcomeText: { fontSize: 16, fontWeight: '600', color: '#4B5563', marginBottom: 16 },
  sentenceButton: { backgroundColor: '#6C63FF', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 16, alignItems: 'center', shadowColor: '#6C63FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4, marginBottom: 24 },
  sentenceButtonText: { fontSize: 16, color: '#fff', fontWeight: '600' },
  listContainer: { flex: 1 },
  listTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 12 },
  listContent: { paddingBottom: 20, gap: 12 },
  sentenceCard: { backgroundColor: '#fff', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  cardMainTouchable: { marginBottom: 10 },
  cardDate: { fontSize: 12, color: '#9CA3AF', marginBottom: 6, fontWeight: '500' },
  cardContent: { fontSize: 15, color: '#374151', lineHeight: 22 },
  cardActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 8 },
  actionBtn: { paddingVertical: 4, paddingHorizontal: 8 },
  actionDetailText: { fontSize: 13, color: '#6C63FF', fontWeight: '600' },
  actionDeleteText: { fontSize: 13, color: '#EF4444', fontWeight: '600' },
  emptyText: { textAlign: 'center', color: '#9CA3AF', marginTop: 40, fontSize: 14 },
});