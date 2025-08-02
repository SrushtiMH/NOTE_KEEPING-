const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Get a note by ID
app.get('/notes/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await db.execute('SELECT * FROM notes WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new note
app.post('/notes', async (req, res) => {
  const { title, content } = req.body;

  try {
    const [result] = await db.execute(
      'INSERT INTO notes (title, content, createdAt, updatedAt) VALUES (?, ?, ?, ?)', 
      [title, content, new Date(), new Date()]
    );

    const newNote = {
      id: result.insertId,
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a note by ID
app.put('/notes/:id', async (req, res) => {
  const { title, content } = req.body;
  const id = req.params.id;

  try {
    const [result] = await db.execute(
      'UPDATE notes SET title = ?, content = ?, updatedAt = ? WHERE id = ?',
      [title, content, new Date(), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({
      id,
      title,
      content,
      updatedAt: new Date()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/notes/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const [result] = await db.execute('DELETE FROM notes WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`SQL-based Note Keeper API running at http://localhost:${PORT}`);
});
