export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Attendance: undefined;
  Lessons: undefined;
  Calendar: undefined;
  More: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  StudentDetails: { studentId: string };
  ClassDetails: { classId: string };
};

export type AttendanceStackParamList = {
  AttendanceList: undefined;
  TakeAttendance: { classId: string };
};

export type LessonStackParamList = {
  LessonList: undefined;
  LessonDetails: { lessonId: string };
  AddLesson: { classId?: string };
};

export type CalendarStackParamList = {
  CalendarView: undefined;
  EventDetails: { eventId: string };
  AddEvent: { date?: string };
};

export type MoreStackParamList = {
  MoreMenu: undefined;
  Students: undefined;
  AddStudent: undefined;
  Classes: undefined;
  AddClass: undefined;
  Progress: undefined;
  Notifications: undefined;
  Settings: undefined;
};
