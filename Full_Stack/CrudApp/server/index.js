// Node.js/Express backend (server.js)
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

app.get('/employees', (req, res) => {
  const sql = 'SELECT * FROM employees';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching employees:', err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.send(result);
  });
});

app.post('/create', (req, res) => {
  const { fullname, age, country, position, salary } = req.body;
  const sql = 'INSERT INTO employees (fullname, age, country, position, salary) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [fullname, age, country, position, salary], (err, result) => {
    if (err) {
      console.error('Error creating employee:', err);
      res.status(500).send('Error creating employee');
      return;
    }
    console.log('Employee created:', result.insertId);
    res.send({ message: 'Employee created' });
  });
});

app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { fullname, age, country, position, salary } = req.body;
  const sql = 'UPDATE employees SET fullname = ?, age = ?, country = ?, position = ?, salary = ? WHERE id = ?';
  db.query(sql, [fullname, age, country, position, salary, id], (err, result) => {
    if (err) {
      console.error('Error updating employee:', err);
      res.status(500).send('Error updating employee');
      return;
    }
    console.log('Employee updated:', result.affectedRows);
    res.send({ message: 'Employee updated' });
  });
});

app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM employees WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting employee:', err);
      res.status(500).send('Error deleting employee');
      return;
    }
    console.log('Employee deleted:', result.affectedRows);
    res.send({ message: 'Employee deleted' });
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});