const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// 👉 Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Database
const db = new sqlite3.Database("./database.db");

// Create table
db.run(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    course TEXT NOT NULL
  )
`);

// ================= ROUTES =================

// ROOT ROUTE (Fix Cannot GET /)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// CREATE
app.post("/students", (req, res) => {
  const { name, email, course } = req.body;

  db.run(
    "INSERT INTO students (name, email, course) VALUES (?, ?, ?)",
    [name, email, course],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Student added successfully", id: this.lastID });
    }
  );
});

// READ
app.get("/students", (req, res) => {
  db.all("SELECT * FROM students", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// UPDATE
app.put("/students/:id", (req, res) => {
  const { name, email, course } = req.body;
  const { id } = req.params;

  db.run(
    "UPDATE students SET name=?, email=?, course=? WHERE id=?",
    [name, email, course, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Student updated successfully" });
    }
  );
});

// DELETE
app.delete("/students/:id", (req, res) => {
  const { id } = req.params;

  db.run(
    "DELETE FROM students WHERE id=?",
    [id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Student deleted successfully" });
    }
  );
});

// Server
app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
