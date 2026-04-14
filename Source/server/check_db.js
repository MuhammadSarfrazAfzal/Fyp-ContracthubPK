require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://sarfrazafzal790_db_user:c8rkhPzpgzHXZ0wO@contracthubpk.t27zann.mongodb.net/";

async function checkDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB");

    // Get indexes for users collection
    const usersCollection = mongoose.connection.collection('users');
    const indexes = await usersCollection.indexes();
    console.log("User Indexes:");
    console.log(JSON.stringify(indexes, null, 2));

    // Attempt to insert a user directly to see the error
    const User = require('./models/User');

    // Check if unique issue
    const existing = await User.find({});
    console.log("Existing Users:");
    console.log(existing);

    try {
      await User.create({ email: 'test123456789@test.com', password: 'password123', role: 'client' });
      console.log('Test user created successfully.');
      await User.deleteOne({ email: 'test123456789@test.com' });
    } catch (err) {
      console.log("Error inserting test user:");
      console.log(err.message);
      console.log(err);
    }

  } catch (error) {
    console.error("Connection error:", error);
  } finally {
    mongoose.disconnect();
  }
}

checkDB();
