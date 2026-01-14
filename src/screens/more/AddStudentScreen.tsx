import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Chip, Snackbar } from 'react-native-paper';
import { useStudentStore } from '../../store/studentStore';
import { useClassStore } from '../../store/classStore';
import { COLORS } from '../../utils/constants';

const AddStudentScreen = ({ navigation }: any) => {
  const { addStudent } = useStudentStore();
  const { classes, loadClasses } = useClassStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState(false);

  useEffect(() => {
    loadClasses();
  }, []);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('First and last name are required');
      return;
    }
    if (!dateOfBirth.trim()) {
      setError('Date of birth is required');
      return;
    }
    if (!selectedClass) {
      setError('Please select a class');
      return;
    }

    setLoading(true);
    setError('');

    await addStudent({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dateOfBirth,
      classId: selectedClass,
      parentIds: [],
      notes: notes.trim(),
    });

    setLoading(false);
    setSnackbar(true);
    setTimeout(() => navigation.goBack(), 1500);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Last Name"
          value={lastName}
          onChangeText={setLastName}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Date of Birth (YYYY-MM-DD)"
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          mode="outlined"
          style={styles.input}
          placeholder="2015-06-15"
        />

        <Text style={styles.label}>Select Class:</Text>
        {classes.length === 0 ? (
          <Text style={styles.noClasses}>No classes available. Please add a class first.</Text>
        ) : (
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
        )}

        <TextInput
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          mode="contained"
          onPress={handleSave}
          loading={loading}
          style={styles.button}
          buttonColor={COLORS.primary}
        >
          Add Student
        </Button>
      </View>

      <Snackbar
        visible={snackbar}
        onDismiss={() => setSnackbar(false)}
        duration={1500}
      >
        Student added successfully!
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  form: { padding: 16 },
  input: { marginBottom: 16 },
  label: { marginBottom: 8, color: COLORS.textSecondary, fontSize: 14 },
  classChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: { marginBottom: 4 },
  noClasses: { color: COLORS.error, marginBottom: 16 },
  button: { marginTop: 8 },
  error: { color: COLORS.error, marginBottom: 8 },
});

export default AddStudentScreen;
