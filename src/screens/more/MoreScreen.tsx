import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Divider, Text } from 'react-native-paper';
import { useAuthStore } from '../../store/authStore';
import { COLORS } from '../../utils/constants';

const MoreScreen = ({ navigation }: any) => {
  const { user, logout } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const isTeacher = user?.role === 'teacher' || isAdmin;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.userSection}>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <Text style={styles.userRole}>{user?.role?.toUpperCase()}</Text>
      </View>

      <Divider />

      <List.Section>
        <List.Subheader>Management</List.Subheader>
        
        {isTeacher && (
          <>
            <List.Item
              title="Students"
              description="View and manage students"
              left={props => <List.Icon {...props} icon="account-group" />}
              onPress={() => navigation.navigate('Students')}
            />
            <List.Item
              title="Classes"
              description="View and manage classes"
              left={props => <List.Icon {...props} icon="school" />}
              onPress={() => navigation.navigate('Classes')}
            />
          </>
        )}

        {user?.role === 'parent' && (
          <List.Item
            title="My Children"
            description="View your children's progress"
            left={props => <List.Icon {...props} icon="account-child" />}
            onPress={() => navigation.navigate('Students')}
          />
        )}
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>Account</List.Subheader>
        <List.Item
          title="Logout"
          description="Sign out of your account"
          left={props => <List.Icon {...props} icon="logout" color={COLORS.error} />}
          onPress={logout}
        />
      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  userSection: { padding: 20, backgroundColor: COLORS.primary, alignItems: 'center' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  userEmail: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  userRole: { fontSize: 12, color: '#fff', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
});

export default MoreScreen;
