import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface SentenceModalProps {
  visible: boolean;
  onClose: () => void;
  value: string;
  onChangeText: (text: string) => void;
  onSave: () => void;
}

export default function SentenceModal({ visible, onClose, value, onChangeText, onSave }: SentenceModalProps) {
  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>오늘 하루의 문장</Text>
          <TextInput
            style={styles.textInput}
            placeholder="오늘 하루를 관통하는 문장을 남겨주세요..."
            placeholderTextColor="#999"
            multiline
            value={value}
            onChangeText={onChangeText}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={onClose}>
              <Text style={styles.cancelBtnText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={onSave}>
              <Text style={styles.saveBtnText}>저장하기</Text>
            </TouchableOpacity>
          </View>
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
    padding: 20,
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
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
    fontSize: 15,
    marginBottom: 20,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#F3F4F6',
  },
  cancelBtnText: {
    color: '#4B5563',
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#6C63FF',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
});