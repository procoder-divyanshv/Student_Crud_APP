// ================= IMPORTS =================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // 🔥 IMPORTANT

// ================= APP INIT =================
const app = express();
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

// ================= ENV VARIABLES =================
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// ================= DB CONNECT =================
mongoose.connect(MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// ================= MODEL =================
const StudentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  course: String
});

const Student = mongoose.model("Student", StudentSchema);

// ================= AUTH MIDDLEWARE =================
const auth = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // 🔥 using ENV
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};

// ================= ROUTES =================

// 🔹 REGISTER
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, course } = req.body;

    let user = await Student.findOne({ email });
    if (user) return res.status(400).json({ msg: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new Student({
      name,
      email,
      password: hashedPassword,
      course
    });

    await user.save();

    res.json({ msg: "Registered successfully" });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// 🔹 LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Student.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET, // 🔥 using ENV
      { expiresIn: "1h" }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// 🔹 GET CURRENT USER
app.get("/api/me", auth, async (req, res) => {
  try {
    const user = await Student.findById(req.user.id).select("-password");
    res.json(user);
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
});

// 🔹 UPDATE PASSWORD
app.put("/api/update-password", auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await Student.findById(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Wrong old password" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ msg: "Password updated successfully" });

  } catch {
    res.status(500).json({ msg: "Server error" });
  }
});

// 🔹 UPDATE COURSE
app.put("/api/update-course", auth, async (req, res) => {
  try {
    const { course } = req.body;

    const user = await Student.findById(req.user.id);
    user.course = course;
    await user.save();

    res.json({ msg: "Course updated successfully" });

  } catch {
    res.status(500).json({ msg: "Server error" });
  }
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

// THIS IS THE FULL BACKEND DEPLOYABLE CODE 
