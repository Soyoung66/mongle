import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  deleting: boolean;
}

export default function Sidebar({ visible, onClose, onLogout, onDeleteAccount, deleting }: SidebarProps) {
  if (!visible) return null;

  return (
    <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
      <View style={styles.sidebar} onStartShouldSetResponder={() => true}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarMenuTitle}>몽글 메뉴</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sidebarContent}>
          <TouchableOpacity style={styles.sidebarItem} onPress={onLogout}>
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>

          {deleting ? (
            <ActivityIndicator size="small" color="#999" style={{ marginTop: 20 }} />
          ) : (
            <TouchableOpacity style={styles.sidebarItem} onPress={onDeleteAccount}>
              <Text style={styles.deleteText}>회원탈퇴</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    zIndex: 100,
  },
  sidebar: {
    width: '70%',
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  sidebarMenuTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#999',
    fontWeight: '600',
  },
  sidebarContent: {
    gap: 15,
  },
  sidebarItem: {
    paddingVertical: 12,
  },
  logoutText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  deleteText: {
    fontSize: 15,
    color: '#e74c3c',
    fontWeight: '500',
  },
});