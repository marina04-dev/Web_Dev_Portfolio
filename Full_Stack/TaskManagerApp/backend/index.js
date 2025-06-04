const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Marichat04!',
  database: 'crud',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.get('/tasks', (req, res) => {
  const sql = 'SELECT * FROM tasks';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.send(result);
  });
});

app.post('/create', (req, res) => {
  const { name, description } = req.body;
  const sql = 'INSERT INTO tasks (name, description) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, description], (err, result) => {
    if (err) {
      console.error('Error creating task:', err);
      res.status(500).send('Error creating task');
      return;
    }
    console.log('Task created:', result.insertId);
    res.send({ message: 'Task created' });
  });
});

app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const sql = 'UPDATE employees SET name = ?, description = ? WHERE id = ?';
  db.query(sql, [name, description, id], (err, result) => {
    if (err) {
      console.error('Error updating task:', err);
      res.status(500).send('Error updating task');
      return;
    }
    console.log('Task updated:', result.affectedRows);
    res.send({ message: 'Task updated' });
  });
});

app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM tasks WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting task:', err);
      res.status(500).send('Error deleting task');
      return;
    }
    console.log('Task deleted:', result.affectedRows);
    res.send({ message: 'Task deleted' });
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});