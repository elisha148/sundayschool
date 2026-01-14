import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Modal } from 'react-native';
import { Card, Title, Text, Button, FAB, TextInput, Chip, IconButton } from 'react-native-paper';
import { useClassStore } from '../../store/classStore';
import { useLessonStore } from '../../store/lessonStore';
import { useAuthStore } from '../../store/authStore';
import { COLORS } from '../../utils/constants';
import { formatDate, generateId } from '../../utils/helpers';
import { LessonPlan } from '../../types';

const LessonsScreen = () => {
  const { classes, loadClasses } = useClassStore();
  const { lessons, loadLessons, addLesson, markLessonComplete, deleteLesson } = useLessonStore();
  const { user } = useAuthStore();
  
  const canEdit = user?.role === 'admin' || user?.role === 'teacher';
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [title, setTitle] = useState('');
  const [bibleVerse, setBibleVerse] = useState('');
  const [objectives, setObjectives] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadClasses();
    loadLessons();
  }, []);

  const handleAddLesson = async () => {
    if (!title.trim() || !selectedClass) return;
    await addLesson({
      classId: selectedClass,
      title: title.trim(),
      date,
      bibleVerse: bibleVerse.trim(),
      objectives: objectives.split('\n').filter(o => o.trim()),
      materials: [],
      activities: [],
      completed: false,
    });
    resetForm();
  };

  const resetForm = () => {
    setModalVisible(false);
    setTitle('');
    setBibleVerse('');
    setObjectives('');
    setSelectedClass('');
  };

  const getClassName = (classId: string) => {
    return classes.find(c => c.id === classId)?.name || 'Unknown Class';
  };

  const renderLesson = ({ item }: { item: LessonPlan }) => (
    <Card style={[styles.card, item.completed && styles.completedCard]}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title style={styles.lessonTitle}>{item.title}</Title>
          {canEdit && (
            <IconButton
              icon="delete"
              size={20}
              onPress={() => deleteLesson(item.id)}
            />
          )}
        </View>
        <Text style={styles.className}>{getClassName(item.classId)}</Text>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
        {item.bibleVerse && (
          <Chip icon="book" style={styles.verseChip}>{item.bibleVerse}</Chip>
        )}
        {item.objectives.length > 0 && (
          <View style={styles.objectives}>
            <Text style={styles.objectivesTitle}>Objectives:</Text>
            {item.objectives.map((obj, i) => (
              <Text key={i} style={styles.objective}>• {obj}</Text>
            ))}
          </View>
        )}
      </Card.Content>
      <Card.Actions>
        {canEdit && !item.completed && (
          <Button onPress={() => markLessonComplete(item.id)}>
            Mark Complete
          </Button>
        )}
        {item.completed && <Text style={styles.completedText}>✓ Completed</Text>}
      </Card.Actions>
    </Card>
  );

  const sortedLessons = [...lessons].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <View style={styles.container}>
      {lessons.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No lesson plans yet.</Text>
          <Text style={styles.emptySubtext}>Tap + to create your first lesson plan.</Text>
        </View>
      ) : (
        <FlatList
          data={sortedLessons}
          renderItem={renderLesson}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      {canEdit && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setModalVisible(true)}
          color="#fff"
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Title style={styles.modalTitle}>New Lesson Plan</Title>

            <TextInput
              label="Lesson Title"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Date (YYYY-MM-DD)"
              value={date}
              onChangeText={setDate}
              mode="outlined"
              style={styles.input}
            />

            <Text style={styles.label}>Select Class:</Text>
            <View style={styles.classChips}>
              {classes.map(c => (
                <Chip
                  key={c.id}
                  selected={selectedClass === c.id}
                  onPress={() => setSelectedClass(c.id)}
                  style={styles.chip}
                >
                  {c.name}
                </Chip>
              ))}
            </View>

            <TextInput
              label="Bible Verse Reference"
              value={bibleVerse}
              onChangeText={setBibleVerse}
              mode="outlined"
              style={styles.input}
              placeholder="e.g., John 3:16"
            />

            <TextInput
              label="Objectives (one per line)"
              value={objectives}
              onChangeText={setObjectives}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
            />

            <View style={styles.modalActions}>
              <Button onPress={resetForm}>Cancel</Button>
              <Button mode="contained" onPress={handleAddLesson} buttonColor={COLORS.primary}>
                Add Lesson
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 16 },
  card: { marginBottom: 12 },
  completedCard: { opacity: 0.7 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lessonTitle: { fontSize: 18, flex: 1 },
  className: { color: COLORS.primary, fontWeight: '600' },
  date: { color: COLORS.textSecondary, marginBottom: 8 },
  verseChip: { alignSelf: 'flex-start', marginVertical: 8 },
  objectives: { marginTop: 8 },
  objectivesTitle: { fontWeight: '600', marginBottom: 4 },
  objective: { color: COLORS.textSecondary, marginLeft: 8 },
  completedText: { color: COLORS.success, fontWeight: '600', marginLeft: 8 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: COLORS.primary },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyText: { fontSize: 18, color: COLORS.textSecondary },
  emptySubtext: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20 },
  modalTitle: { marginBottom: 16 },
  input: { marginBottom: 12 },
  label: { marginBottom: 8, color: COLORS.textSecondary },
  classChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: { marginBottom: 4 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 16 },
});

export default LessonsScreen;
