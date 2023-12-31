const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors'); 

const app = express();
const port = 3000;


app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'task_manager_db',
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

//sign up
app.post('/signup', (req, res) => {
  const { username, name, surname, email, password } = req.body;

  if (!name || !email || !password || !username) {
    return res.status(400).json({ error: 'Name, username, email, and password are required' });
  }

  db.query('INSERT INTO users (username, name, surname, email, password) VALUES (?, ?, ?, ?, ?)', [username, name, surname, email, password], (error, results) => {
    if (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Username is already taken' });
      }

      console.error('Error adding user:', error);
      res.status(500).json({ error: 'Error adding user' });
      return;
    }
    res.json({ username, name, surname, email, password });
  });
});



//sign in
app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  authenticateUser(email, password)
    .then((user) => {
      if (user) {
        res.json({ success: true });
      } else {
        res.status(401).json({ error: 'Invalid email or password' });
      }
    })
    .catch((error) => {
      console.error('Error during authentication:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

function authenticateUser(email, password) {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (error, results) => {

      if (results.length > 0) {
        const user = results[0];
        resolve(user);
      } else {
        resolve(null);
      }
    });
  });
}

// task mtaa sarra 
app.post('/tasks', (req, res) => {
  const newTask = req.body;

  delete newTask.id;

  db.query('INSERT INTO tasks SET ?', newTask, (error, results) => {
    if (error) {
      console.error('Error inserting task:', error);
      res.status(500).json({ error: 'Error adding task' });
      return;
    }

    newTask.id = results.insertId;

    res.json(newTask);
  });
});


app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (error, results) => {
    if (error) {
      console.error('Error getting tasks:', error);
      res.status(500).json({ error: 'Error getting tasks' });
      return;
    }
    res.json(results);
  });
});

app.put('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const updatedTask = req.body;

  db.query(
    'UPDATE tasks SET name = ?, description = ?, deadline = ?, owner = ?, state = ?, file = ? WHERE id = ?',
    [
      updatedTask.name,
      updatedTask.description,
      updatedTask.deadline,
      updatedTask.owner,
      updatedTask.state,
      updatedTask.file,
      taskId
    ],
    (error) => {
      if (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Error updating task' });
        return;
      }
      res.json({ message: 'Task updated successfully' });
    }
  );
});


app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  db.query('DELETE FROM tasks WHERE id = ?', taskId, (error, results) => {
    if (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Error deleting task' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Task not found' });
    } else {
      res.json({ message: 'Task deleted successfully' });
    }
  });
});



// Get user details by username
app.get('/users', (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const sql = 'SELECT name, surname FROM users WHERE username = ?';
  db.query(sql, [username], (error, results) => {
    if (error) {
      console.error('Error fetching user details:', error);
      return res.status(500).json({ error: 'Error fetching user details' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userDetails = results[0];
    res.json(userDetails);
  });
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
