// migrations/dropTables.js
const mongoose = require("mongoose");
require("dotenv").config();

async function down() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.drop();
      console.log(`Dropped: ${collection.collectionName}`);
    }

    console.log("All collections dropped ✅");
  } catch (err) {
    console.error(err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

down();