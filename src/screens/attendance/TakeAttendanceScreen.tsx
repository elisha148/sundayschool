import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Text, Checkbox, Button, Snackbar } from 'react-native-paper';
import { useStudentStore } from '../../store/studentStore';
import { useClassStore } from '../../store/classStore';
import { useAttendanceStore } from '../../store/attendanceStore';
import { COLORS } from '../../utils/constants';
import { getToday, getFullName } from '../../utils/helpers';

const TakeAttendanceScreen = ({ route, navigation }: any) => {
  const { classId } = route.params;
  const { students } = useStudentStore();
  const { classes } = useClassStore();
  const { records, markAttendance, getAttendanceByDate } = useAttendanceStore();

  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const classInfo = classes.find(c => c.id === classId);
  const classStudents = students.filter(s => s.classId === classId);
  const today = getToday();
  const todayRecords = getAttendanceByDate(today, classId);

  useEffect(() => {
    // Initialize with existing records
    const initial: Record<string, boolean> = {};
    classStudents.forEach(student => {
      const record = todayRecords.find(r => r.studentId === student.id);
      initial[student.id] = record?.present ?? false;
    });
    setAttendance(initial);
  }, [classId, records]);

  const toggleAttendance = (studentId: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  const saveAttendance = async () => {
    setSaving(true);
    for (const student of classStudents) {
      await markAttendance(student.id, classId, attendance[student.id] || false);
    }
    setSaving(false);
    setSnackbar(true);
  };

  const markAllPresent = () => {
    const all: Record<string, boolean> = {};
    classStudents.forEach(s => { all[s.id] = true; });
    setAttendance(all);
  };

  const renderStudent = ({ item }: { item: typeof classStudents[0] }) => (
    <Card style={styles.studentCard}>
      <Card.Content style={styles.studentRow}>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{getFullName(item.firstName, item.lastName)}</Text>
        </View>
        <Checkbox
          status={attendance[item.id] ? 'checked' : 'unchecked'}
          onPress={() => toggleAttendance(item.id)}
          color={COLORS.success}
        />
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title>{classInfo?.name || 'Class'}</Title>
        <Text style={styles.subtitle}>{classInfo?.ageGroup}</Text>
        <View style={styles.headerActions}>
          <Button mode="outlined" onPress={markAllPresent} style={styles.markAllBtn}>
            Mark All Present
          </Button>
        </View>
      </View>

      {classStudents.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No students in this class yet.</Text>
        </View>
      ) : (
        <FlatList
          data={classStudents}
          renderItem={renderStudent}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      <View style={styles.footer}>
        <Text style={styles.summary}>
          Present: {Object.values(attendance).filter(Boolean).length} / {classStudents.length}
        </Text>
        <Button
          mode="contained"
          onPress={saveAttendance}
          loading={saving}
          disabled={classStudents.length === 0}
          buttonColor={COLORS.primary}
        >
          Save Attendance
        </Button>
      </View>

      <Snackbar
        visible={snackbar}
        onDismiss={() => setSnackbar(false)}
        duration={2000}
      >
        Attendance saved successfully!
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 16, backgroundColor: COLORS.surface },
  subtitle: { color: COLORS.textSecondary },
  headerActions: { marginTop: 12 },
  markAllBtn: { alignSelf: 'flex-start' },
  list: { padding: 16 },
  studentCard: { marginBottom: 8 },
  studentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  studentInfo: { flex: 1 },
  studentName: { fontSize: 16 },
  footer: { padding: 16, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border },
  summary: { textAlign: 'center', marginBottom: 12, color: COLORS.textSecondary },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: COLORS.textSecondary },
});

export default TakeAttendanceScreen;
