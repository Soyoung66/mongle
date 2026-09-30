import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SentenceItem {
  id: string;
  content: string;
  date: string;
}

interface DetailModalProps {
  visible: boolean;
  onClose: () => void;
  item: SentenceItem | null;
}

export default function DetailModal({ visible, onClose, item }: DetailModalProps) {
  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{item?.date}</Text>
          <Text style={styles.detailContentText}>"{item?.content}"</Text>
          
          {/* 가시성을 대폭 개선한 닫기 버튼 */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  detailContentText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  closeBtn: {
    backgroundColor: '#374151', // 눈에 띄는 진한 회색/차콜 컬러로 변경
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700', // 폰트 굵기를 키워 가독성 향상
  },
});