require('dotenv').config();
const mongoose = require('mongoose');

async function checkDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log('=== USERS ===');
    users.forEach(u => {
      console.log(`- ${u.email} | ${u.name} | ${u.role}`);
    });
    console.log(`Total: ${users.length} users\n`);

    const classes = await mongoose.connection.db.collection('classes').find({}).toArray();
    console.log('=== CLASSES ===');
    classes.forEach(c => {
      console.log(`- ${c.name} | ${c.ageGroup}`);
    });
    console.log(`Total: ${classes.length} classes\n`);

    const students = await mongoose.connection.db.collection('students').find({}).toArray();
    console.log('=== STUDENTS ===');
    students.forEach(s => {
      console.log(`- ${s.firstName} ${s.lastName}`);
    });
    console.log(`Total: ${students.length} students`);

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkDB();
