# Sunday School App

A React Native (Expo) app for managing Sunday School classes, students, attendance, lessons, and events.

## Features

- 👤 **User Roles**: Admin, Teacher, Parent
- 📋 **Attendance Tracking**: Mark daily attendance per class
- 📖 **Lesson Plans**: Create and manage curriculum
- 📅 **Event Calendar**: Schedule and view upcoming events
- 📊 **Progress Tracking**: Monitor student participation
- 📱 **Bible Verse of the Day**: Daily scripture inspiration
- 🔔 **Parent Communication**: (Ready for notifications)

## Getting Started

```bash
cd SundaySchoolApp
npm install
npx expo start
```

Scan the QR code with Expo Go (Android) or Camera app (iOS).

## Tech Stack

- React Native + Expo
- TypeScript
- Zustand (state management)
- AsyncStorage (local persistence)
- React Navigation
- React Native Paper (UI)

## Future: AWS Integration

The app is designed with a service layer that makes it easy to swap local storage for AWS:
- Replace `StorageService` with AWS Amplify/DynamoDB
- Add Cognito for authentication
- Use SNS/Pinpoint for push notifications
