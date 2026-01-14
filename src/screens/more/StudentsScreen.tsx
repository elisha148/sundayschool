import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Text, FAB, IconButton, Chip } from 'react-native-paper';
import { useStudentStore } from '../../store/studentStore';
import { useClassStore } from '../../store/classStore';
import { useAttendanceStore } from '../../store/attendanceStore';
import { useAuthStore } from '../../store/authStore';
import { COLORS } from '../../utils/constants';
import { getFullName, calculateAge, getAttendancePercentage } from '../../utils/helpers';
import { Student } from '../../types';

const StudentsScreen = ({ navigation }: any) => {
  const { students, loadStudents, deleteStudent } = useStudentStore();
  const { classes, loadClasses } = useClassStore();
  const { loadAttendance, getAttendanceStats } = useAttendanceStore();
  const { user } = useAuthStore();
  
  const canEdit = user?.role === 'admin' || user?.role === 'teacher';

  useEffect(() => {
    loadStudents();
    loadClasses();
    loadAttendance();
  }, []);

  const getClassName = (classId: string) => {
    return classes.find(c => c.id === classId)?.name || 'No Class';
  };

  const renderStudent = ({ item }: { item: Student }) => {
    const stats = getAttendanceStats(item.id);
    const attendancePercent = getAttendancePercentage(stats.present, stats.total);

    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.studentInfo}>
              <Title style={styles.name}>{getFullName(item.firstName, item.lastName)}</Title>
              <Text style={styles.age}>Age: {calculateAge(item.dateOfBirth)}</Text>
            </View>
            {canEdit && (
              <IconButton
                icon="delete"
                size={20}
                onPress={() => deleteStudent(item.id)}
              />
            )}
          </View>
          <Chip icon="school" style={styles.classChip}>{getClassName(item.classId)}</Chip>
          {stats.total > 0 && (
            <View style={styles.statsRow}>
              <Text style={styles.stat}>Attendance: {attendancePercent}%</Text>
              <Text style={styles.stat}>({stats.present}/{stats.total} classes)</Text>
            </View>
          )}
          {item.notes && <Text style={styles.notes}>{item.notes}</Text>}
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {students.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No students yet.</Text>
          <Text style={styles.emptySubtext}>Tap + to add your first student.</Text>
        </View>
      ) : (
        <FlatList
          data={students}
          renderItem={renderStudent}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      {canEdit && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate('AddStudent')}
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
  studentInfo: { flex: 1 },
  name: { fontSize: 18 },
  age: { color: COLORS.textSecondary },
  classChip: { alignSelf: 'flex-start', marginTop: 8 },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  stat: { color: COLORS.textSecondary, fontSize: 13 },
  notes: { marginTop: 8, fontStyle: 'italic', color: COLORS.textSecondary },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: COLORS.primary },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyText: { fontSize: 18, color: COLORS.textSecondary },
  emptySubtext: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: 8 },
});

export default StudentsScreen;
