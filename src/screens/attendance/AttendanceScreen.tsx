import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Text, Button, FAB } from 'react-native-paper';
import { useClassStore } from '../../store/classStore';
import { useStudentStore } from '../../store/studentStore';
import { useAttendanceStore } from '../../store/attendanceStore';
import { COLORS } from '../../utils/constants';
import { getToday } from '../../utils/helpers';

const AttendanceScreen = ({ navigation }: any) => {
  const { classes, loadClasses } = useClassStore();
  const { students, loadStudents } = useStudentStore();
  const { records, loadAttendance, getAttendanceByDate } = useAttendanceStore();

  const today = getToday();
  const todayRecords = getAttendanceByDate(today);

  useEffect(() => {
    loadClasses();
    loadStudents();
    loadAttendance();
  }, []);

  const getClassStats = (classId: string) => {
    const classStudents = students.filter(s => s.classId === classId);
    const classRecords = todayRecords.filter(r => r.classId === classId);
    const present = classRecords.filter(r => r.present).length;
    return { total: classStudents.length, present, recorded: classRecords.length };
  };

  const renderClass = ({ item }: { item: typeof classes[0] }) => {
    const stats = getClassStats(item.id);
    const isComplete = stats.recorded === stats.total && stats.total > 0;

    return (
      <Card style={styles.card} onPress={() => navigation.navigate('TakeAttendance', { classId: item.id })}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.className}>{item.name}</Title>
            {isComplete && <Text style={styles.completeBadge}>✓ Complete</Text>}
          </View>
          <Text style={styles.ageGroup}>{item.ageGroup}</Text>
          <View style={styles.statsRow}>
            <Text style={styles.stat}>Students: {stats.total}</Text>
            <Text style={styles.stat}>Present: {stats.present}</Text>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => navigation.navigate('TakeAttendance', { classId: item.id })}>
            Take Attendance
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Today's Attendance</Title>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
      </View>

      {classes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No classes yet.</Text>
          <Text style={styles.emptySubtext}>Add classes from the More menu to start taking attendance.</Text>
        </View>
      ) : (
        <FlatList
          data={classes}
          renderItem={renderClass}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 16, backgroundColor: COLORS.surface },
  title: { fontSize: 20 },
  date: { color: COLORS.textSecondary },
  list: { padding: 16 },
  card: { marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  className: { fontSize: 18 },
  completeBadge: { color: COLORS.success, fontWeight: '600' },
  ageGroup: { color: COLORS.textSecondary, marginBottom: 8 },
  statsRow: { flexDirection: 'row', gap: 16 },
  stat: { color: COLORS.textSecondary },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyText: { fontSize: 18, color: COLORS.textSecondary },
  emptySubtext: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: 8 },
});

export default AttendanceScreen;
