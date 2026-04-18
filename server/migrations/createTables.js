// migrations/createTables.js
const mongoose = require("mongoose");
require("dotenv").config();

// import your real model
const User = require("../models/User");

async function up() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Force collection creation
    await User.createCollection();
    console.log("Users collection created ✅");

  } catch (err) {
    console.error(err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

up();