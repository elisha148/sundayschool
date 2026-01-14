import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../store/authStore';
import { COLORS } from '../utils/constants';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main Screens
import HomeScreen from '../screens/home/HomeScreen';
import AttendanceScreen from '../screens/attendance/AttendanceScreen';
import TakeAttendanceScreen from '../screens/attendance/TakeAttendanceScreen';
import LessonsScreen from '../screens/lessons/LessonsScreen';
import CalendarScreen from '../screens/calendar/CalendarScreen';
import MoreScreen from '../screens/more/MoreScreen';
import StudentsScreen from '../screens/more/StudentsScreen';
import AddStudentScreen from '../screens/more/AddStudentScreen';
import ClassesScreen from '../screens/more/ClassesScreen';
import AddClassScreen from '../screens/more/AddClassScreen';

import { RootStackParamList, AuthStackParamList, MainTabParamList } from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const AttendanceStack = createNativeStackNavigator();
const MoreStack = createNativeStackNavigator();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

const AttendanceNavigator = () => (
  <AttendanceStack.Navigator>
    <AttendanceStack.Screen name="AttendanceList" component={AttendanceScreen} options={{ title: 'Attendance' }} />
    <AttendanceStack.Screen name="TakeAttendance" component={TakeAttendanceScreen} options={{ title: 'Take Attendance' }} />
  </AttendanceStack.Navigator>
);

const MoreNavigator = () => (
  <MoreStack.Navigator>
    <MoreStack.Screen name="MoreMenu" component={MoreScreen} options={{ title: 'More' }} />
    <MoreStack.Screen name="Students" component={StudentsScreen} />
    <MoreStack.Screen name="AddStudent" component={AddStudentScreen} options={{ title: 'Add Student' }} />
    <MoreStack.Screen name="Classes" component={ClassesScreen} />
    <MoreStack.Screen name="AddClass" component={AddClassScreen} options={{ title: 'Add Class' }} />
  </MoreStack.Navigator>
);

const MainNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textSecondary,
    }}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
    <Tab.Screen name="Attendance" component={AttendanceNavigator} options={{ headerShown: false, tabBarLabel: 'Attendance' }} />
    <Tab.Screen name="Lessons" component={LessonsScreen} options={{ tabBarLabel: 'Lessons' }} />
    <Tab.Screen name="Calendar" component={CalendarScreen} options={{ tabBarLabel: 'Calendar' }} />
    <Tab.Screen name="More" component={MoreNavigator} options={{ headerShown: false, tabBarLabel: 'More' }} />
  </Tab.Navigator>
);

export const AppNavigator = () => {
  const { user } = useAuthStore();

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <RootStack.Screen name="Main" component={MainNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
