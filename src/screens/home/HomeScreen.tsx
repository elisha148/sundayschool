import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, Button, Avatar } from 'react-native-paper';
import { useAuthStore } from '../../store/authStore';
import { useStudentStore } from '../../store/studentStore';
import { useClassStore } from '../../store/classStore';
import { useEventStore } from '../../store/eventStore';
import { BibleVerseService } from '../../services/bibleVerse';
import { COLORS } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';

const HomeScreen = ({ navigation }: any) => {
  const { user, logout } = useAuthStore();
  const { students, loadStudents } = useStudentStore();
  const { classes, loadClasses } = useClassStore();
  const { events, loadEvents, getUpcomingEvents } = useEventStore();

  const verseOfTheDay = BibleVerseService.getVerseOfTheDay();
  const upcomingEvents = getUpcomingEvents().slice(0, 3);

  useEffect(() => {
    loadStudents();
    loadClasses();
    loadEvents();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0]}!</Text>
          <Text style={styles.role}>{user?.role?.charAt(0).toUpperCase()}{user?.role?.slice(1)}</Text>
        </View>
        <Button mode="text" onPress={logout} textColor={COLORS.error}>
          Logout
        </Button>
      </View>

      {/* Bible Verse of the Day */}
      <Card style={styles.verseCard}>
        <Card.Content>
          <Title style={styles.verseTitle}>📖 Verse of the Day</Title>
          <Text style={styles.verseText}>"{verseOfTheDay.text}"</Text>
          <Text style={styles.verseRef}>— {verseOfTheDay.reference}</Text>
        </Card.Content>
      </Card>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text style={styles.statNumber}>{students.length}</Text>
            <Text style={styles.statLabel}>Students</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text style={styles.statNumber}>{classes.length}</Text>
            <Text style={styles.statLabel}>Classes</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text style={styles.statNumber}>{upcomingEvents.length}</Text>
            <Text style={styles.statLabel}>Events</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Quick Actions */}
      <Title style={styles.sectionTitle}>Quick Actions</Title>
      <View style={styles.actionsRow}>
        <Button
          mode="contained"
          icon="check-circle"
          onPress={() => navigation.navigate('Attendance')}
          style={styles.actionButton}
          buttonColor={COLORS.primary}
        >
          Attendance
        </Button>
        <Button
          mode="contained"
          icon="book-open"
          onPress={() => navigation.navigate('Lessons')}
          style={styles.actionButton}
          buttonColor={COLORS.secondary}
        >
          Lessons
        </Button>
      </View>

      {/* Upcoming Events */}
      <Title style={styles.sectionTitle}>Upcoming Events</Title>
      {upcomingEvents.length > 0 ? (
        upcomingEvents.map(event => (
          <Card key={event.id} style={styles.eventCard}>
            <Card.Content>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDate}>{formatDate(event.date)} at {event.time}</Text>
              {event.location && <Text style={styles.eventLocation}>📍 {event.location}</Text>}
            </Card.Content>
          </Card>
        ))
      ) : (
        <Card style={styles.eventCard}>
          <Card.Content>
            <Text style={styles.noEvents}>No upcoming events</Text>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: COLORS.primary },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  role: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  verseCard: { margin: 16, backgroundColor: '#E8F4FD' },
  verseTitle: { fontSize: 16, color: COLORS.primary, marginBottom: 8 },
  verseText: { fontSize: 16, fontStyle: 'italic', color: COLORS.text, lineHeight: 24 },
  verseRef: { fontSize: 14, color: COLORS.textSecondary, marginTop: 8, textAlign: 'right' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8 },
  statCard: { flex: 1 },
  statContent: { alignItems: 'center', paddingVertical: 8 },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: 12, color: COLORS.textSecondary },
  sectionTitle: { fontSize: 18, marginHorizontal: 16, marginTop: 24, marginBottom: 12 },
  actionsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12 },
  actionButton: { flex: 1 },
  eventCard: { marginHorizontal: 16, marginBottom: 8 },
  eventTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  eventDate: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  eventLocation: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  noEvents: { textAlign: 'center', color: COLORS.textSecondary, fontStyle: 'italic' },
});

export default HomeScreen;
