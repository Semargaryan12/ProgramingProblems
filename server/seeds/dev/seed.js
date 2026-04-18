const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3 },
    surname: { type: String, required: true, minlength: 3 },
    username: { type: String, required: true, minlength: 3 },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true,
      match: /.+\@.+\..+/ 
    },
   password: { type: String, required: true, minlength: 6 },
    refreshToken: { type: String },
    role: { type: String, enum: ["user", "admin", "superadmin"], default: "user" },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function seed() {
  // Check if admin already exists to avoid unique email errors on re-run
  const existingAdmin = await User.findOne({ email: "SuperAdmin@gmail.com" });
  if (existingAdmin) {
    console.log("Super Admin already exists. Skipping...");
    return;
  }

  await User.create({
    name: "Seyran",
    surname: "Margaryan",
    username: "admin123",
    email: "SuperAdmin@gmail.com",
    password: await bcrypt.hash("Admin123", 10),
    refreshToken: null,
    role: "superadmin",
    isVerified: true

    
  });
}

async function init() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await seed();
    console.log("Successfully inserted all data ...");
    
    await mongoose.disconnect();
  } catch (error) {
    console.error(error.message);
  }
}

init();
