import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Modal } from 'react-native';
import { Card, Title, Text, Button, FAB, TextInput } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import { useEventStore } from '../../store/eventStore';
import { COLORS } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import { Event } from '../../types';

const CalendarScreen = () => {
  const { events, loadEvents, addEvent, deleteEvent, getEventsByDate } = useEventStore();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [location, setLocation] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const selectedEvents = getEventsByDate(selectedDate);

  const markedDates = events.reduce((acc, event) => {
    acc[event.date] = { marked: true, dotColor: COLORS.primary };
    return acc;
  }, {} as Record<string, any>);

  markedDates[selectedDate] = {
    ...markedDates[selectedDate],
    selected: true,
    selectedColor: COLORS.primary,
  };

  const handleAddEvent = async () => {
    if (!title.trim()) return;
    await addEvent({
      title: title.trim(),
      description: description.trim(),
      date: selectedDate,
      time: time.trim(),
      location: location.trim(),
    });
    resetForm();
  };

  const resetForm = () => {
    setModalVisible(false);
    setTitle('');
    setDescription('');
    setTime('10:00 AM');
    setLocation('');
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day: any) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: COLORS.primary,
          todayTextColor: COLORS.primary,
          arrowColor: COLORS.primary,
        }}
      />

      <View style={styles.eventsSection}>
        <Title style={styles.eventsTitle}>Events on {formatDate(selectedDate)}</Title>
        <ScrollView style={styles.eventsList}>
          {selectedEvents.length === 0 ? (
            <Text style={styles.noEvents}>No events on this day</Text>
          ) : (
            selectedEvents.map(event => (
              <Card key={event.id} style={styles.eventCard}>
                <Card.Content>
                  <View style={styles.eventHeader}>
                    <Title style={styles.eventTitle}>{event.title}</Title>
                    <Button
                      mode="text"
                      textColor={COLORS.error}
                      onPress={() => deleteEvent(event.id)}
                      compact
                    >
                      Delete
                    </Button>
                  </View>
                  <Text style={styles.eventTime}>🕐 {event.time}</Text>
                  {event.location && <Text style={styles.eventLocation}>📍 {event.location}</Text>}
                  {event.description && <Text style={styles.eventDesc}>{event.description}</Text>}
                </Card.Content>
              </Card>
            ))
          )}
        </ScrollView>
      </View>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        color="#fff"
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Title style={styles.modalTitle}>New Event</Title>
            <Text style={styles.modalDate}>Date: {formatDate(selectedDate)}</Text>

            <TextInput
              label="Event Title"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Time"
              value={time}
              onChangeText={setTime}
              mode="outlined"
              style={styles.input}
              placeholder="e.g., 10:00 AM"
            />

            <TextInput
              label="Location (optional)"
              value={location}
              onChangeText={setLocation}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Description (optional)"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
            />

            <View style={styles.modalActions}>
              <Button onPress={resetForm}>Cancel</Button>
              <Button mode="contained" onPress={handleAddEvent} buttonColor={COLORS.primary}>
                Add Event
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
  eventsSection: { flex: 1, padding: 16 },
  eventsTitle: { fontSize: 18, marginBottom: 12 },
  eventsList: { flex: 1 },
  noEvents: { textAlign: 'center', color: COLORS.textSecondary, fontStyle: 'italic', marginTop: 20 },
  eventCard: { marginBottom: 8 },
  eventHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eventTitle: { fontSize: 16, flex: 1 },
  eventTime: { color: COLORS.textSecondary, marginTop: 4 },
  eventLocation: { color: COLORS.textSecondary, marginTop: 2 },
  eventDesc: { marginTop: 8, color: COLORS.text },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: COLORS.primary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20 },
  modalTitle: { marginBottom: 4 },
  modalDate: { color: COLORS.textSecondary, marginBottom: 16 },
  input: { marginBottom: 12 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 8 },
});

export default CalendarScreen;
