import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, Title, SegmentedButtons } from 'react-native-paper';
import { useAuthStore } from '../../store/authStore';
import { COLORS } from '../../utils/constants';
import { UserRole } from '../../types';

const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('teacher');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    const success = await register(name, email, password, role);
    setLoading(false);
    if (!success) {
      setError('Email already registered');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Title style={styles.title}>Create Account</Title>
        <Text style={styles.subtitle}>Join Sunday School</Text>

        <TextInput
          label="Full Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />

        <Text style={styles.roleLabel}>I am a:</Text>
        <SegmentedButtons
          value={role}
          onValueChange={(value) => setRole(value as UserRole)}
          buttons={[
            { value: 'admin', label: 'Admin' },
            { value: 'teacher', label: 'Teacher' },
            { value: 'parent', label: 'Parent' },
          ]}
          style={styles.segmented}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          mode="contained"
          onPress={handleRegister}
          loading={loading}
          style={styles.button}
          buttonColor={COLORS.primary}
        >
          Register
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          style={styles.linkButton}
        >
          Already have an account? Login
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, textAlign: 'center', color: COLORS.primary, marginBottom: 8 },
  subtitle: { fontSize: 16, textAlign: 'center', color: COLORS.textSecondary, marginBottom: 32 },
  input: { marginBottom: 16 },
  roleLabel: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 8 },
  segmented: { marginBottom: 16 },
  button: { marginTop: 8, paddingVertical: 4 },
  linkButton: { marginTop: 16 },
  error: { color: COLORS.error, textAlign: 'center', marginBottom: 8 },
});

export default RegisterScreen;
