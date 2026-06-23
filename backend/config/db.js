// File: backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // force strict query for Mongoose 7plus compatibility
    mongoose.set('strictQuery', false); 
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`done MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`error MongoDB Connection Error: ${error.message}`);
    process.exit(1); // exit process with failure
  }
};

module.exports = connectDB;