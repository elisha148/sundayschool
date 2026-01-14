import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Text, FAB, IconButton, Chip } from 'react-native-paper';
import { useClassStore } from '../../store/classStore';
import { useStudentStore } from '../../store/studentStore';
import { useAuthStore } from '../../store/authStore';
import { COLORS } from '../../utils/constants';
import { Class } from '../../types';

const ClassesScreen = ({ navigation }: any) => {
  const { classes, loadClasses, deleteClass } = useClassStore();
  const { students, loadStudents } = useStudentStore();
  const { user } = useAuthStore();
  
  const canEdit = user?.role === 'admin' || user?.role === 'teacher';

  useEffect(() => {
    loadClasses();
    loadStudents();
  }, []);

  const getStudentCount = (classId: string) => {
    return students.filter(s => s.classId === classId).length;
  };

  const renderClass = ({ item }: { item: Class }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.classInfo}>
            <Title style={styles.name}>{item.name}</Title>
            <Chip icon="account-group" style={styles.ageChip}>{item.ageGroup}</Chip>
          </View>
          {canEdit && (
            <IconButton
              icon="delete"
              size={20}
              onPress={() => deleteClass(item.id)}
            />
          )}
        </View>
        <View style={styles.details}>
          <Text style={styles.detail}>📅 {item.schedule}</Text>
          {item.room && <Text style={styles.detail}>🚪 Room: {item.room}</Text>}
          <Text style={styles.detail}>👥 Students: {getStudentCount(item.id)}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {classes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No classes yet.</Text>
          <Text style={styles.emptySubtext}>Tap + to create your first class.</Text>
        </View>
      ) : (
        <FlatList
          data={classes}
          renderItem={renderClass}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      {canEdit && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate('AddClass')}
          color="#fff"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 16 },
  card: { marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  classInfo: { flex: 1 },
  name: { fontSize: 18 },
  ageChip: { alignSelf: 'flex-start', marginTop: 8 },
  details: { marginTop: 12 },
  detail: { color: COLORS.textSecondary, marginBottom: 4 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: COLORS.primary },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyText: { fontSize: 18, color: COLORS.textSecondary },
  emptySubtext: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: 8 },
});

export default ClassesScreen;
