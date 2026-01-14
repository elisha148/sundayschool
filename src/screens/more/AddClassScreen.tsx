import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Chip, Snackbar } from 'react-native-paper';
import { useClassStore } from '../../store/classStore';
import { useAuthStore } from '../../store/authStore';
import { COLORS, AGE_GROUPS } from '../../utils/constants';

const AddClassScreen = ({ navigation }: any) => {
  const { addClass } = useClassStore();
  const { user } = useAuthStore();

  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [schedule, setSchedule] = useState('Sunday 9:00 AM');
  const [room, setRoom] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Class name is required');
      return;
    }
    if (!ageGroup) {
      setError('Please select an age group');
      return;
    }

    setLoading(true);
    setError('');

    await addClass({
      name: name.trim(),
      ageGroup,
      schedule: schedule.trim(),
      room: room.trim(),
      teacherIds: user ? [user.id] : [],
    });

    setLoading(false);
    setSnackbar(true);
    setTimeout(() => navigation.goBack(), 1500);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          label="Class Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          placeholder="e.g., Little Lambs"
        />

        <Text style={styles.label}>Age Group:</Text>
        <View style={styles.ageChips}>
          {AGE_GROUPS.map(ag => (
            <Chip
              key={ag}
              selected={ageGroup === ag}
              onPress={() => setAgeGroup(ag)}
              style={styles.chip}
            >
              {ag}
            </Chip>
          ))}
        </View>

        <TextInput
          label="Schedule"
          value={schedule}
          onChangeText={setSchedule}
          mode="outlined"
          style={styles.input}
          placeholder="e.g., Sunday 9:00 AM"
        />

        <TextInput
          label="Room (optional)"
          value={room}
          onChangeText={setRoom}
          mode="outlined"
          style={styles.input}
          placeholder="e.g., Room 101"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          mode="contained"
          onPress={handleSave}
          loading={loading}
          style={styles.button}
          buttonColor={COLORS.primary}
        >
          Create Class
        </Button>
      </View>

      <Snackbar
        visible={snackbar}
        onDismiss={() => setSnackbar(false)}
        duration={1500}
      >
        Class created successfully!
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  form: { padding: 16 },
  input: { marginBottom: 16 },
  label: { marginBottom: 8, color: COLORS.textSecondary, fontSize: 14 },
  ageChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: { marginBottom: 4 },
  button: { marginTop: 8 },
  error: { color: COLORS.error, marginBottom: 8 },
});

export default AddClassScreen;
