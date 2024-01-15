import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from "mysql2"
import {getAlltasks,createtask,getCollabs,addcollab} from './database.js'
const app = express();
const port = 3000;
// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'task_manager_db',
});
app.get('/tasklist',async (req,res)=>{
  const tasks =await getAlltasks()
  res.send(tasks)
})
app.post('/tasklist', async (req, res) => {
  try {
    const { etat, titre, description, proprietaire, date_fin } = req.body;
    const note = await createtask(etat, titre, description, proprietaire, date_fin);
    res.send(note);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.post('/collab', async (req, res) => {
  const { passwordd ,collabusername} = req.body;
  if (!passwordd||!collabusername) {
    return res.status(400).json({ error: 'passwordd is required' });
  }
  if (res.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }
  const collabs = await addcollab(passwordd,collabusername);
  res.send(collabs);
});

app.get('/collab', async (req, res) => {
  const { password } = req.query;
  if (!password) {
    return res.status(400).json({ error: 'password is required' });
  }
  if (res.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }
  const collabs = await getCollabs(password);
  res.send(collabs);
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


// Sign in 
app.post('/signin', (req, res) => {

  db.query('DELETE FROM active_user', (error, results) => {
  });

  const { email, password } = req.body;
  authenticateUser(email, password)
    .then((user) => {
      if (user) {
  const insertQuery = `
    INSERT INTO active_user (username, name, surname, email)
    VALUES (?, ?, ?, ?)
  `;

  const { username, name, surname, email } = user;
  db.query(insertQuery, [username, name, surname, email], (error, results) => {
    res.json({ success: true, userDetails: user });
  });
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
    db.query(
      'SELECT username, name, surname, email FROM users WHERE email = ? AND password = ?',
      [email, password],
      (error, results) => {
        if (results.length > 0) {
          const user = results[0];
          resolve(user);
        } else {
          resolve(null);
        }
      }
    );
  });
}

// logout route
app.post('/logout', (req, res) => {
  db.query('DELETE FROM active_user', (error, results) => {
    if (error) {
      console.error('Error clearing user from active_user table:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.json({ message: 'User cleared from active_user table' });
  });
});




// create a new task (sarra) 
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


// get active user details
app.get('/activeUser', (req, res) => {
  const sql = 'SELECT username FROM active_user LIMIT 1';
  db.query(sql, (error, results) => {
    if (error) {
      console.error('Error fetching active user details:', error);
      return res.status(500).json({ error: 'Error fetching active user details' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Active user not found' });
    }

    const activeUserDetails = results[0];
    res.json(activeUserDetails);
  });
});

// add collaborator endpoint
app.post('/addCollaborator', (req, res) => {
  const { username, collaborator } = req.body;

  if (!username || !collaborator) {
    return res.status(400).json({ error: 'Username and collaborator are required' });
  }

  // check if collaborator already exists for the specific user
  db.query('SELECT collaborators FROM users WHERE username = ?', [username], (selectError, selectResults) => {
    if (selectError) {
      console.error('Error checking for existing collaborator:', selectError);
      return res.status(500).json({ error: 'Error checking for existing collaborator' });
    }

    const existingCollaborators = selectResults[0]?.collaborators || '';
    
    // check if collaborator already exists
    if (existingCollaborators.split(',').includes(collaborator)) {
      return res.status(400).json({ error: 'Collaborator already exists for the user' });
    }

    // update collaborators in the users table for the specific user
    db.query('UPDATE users SET collaborators = CONCAT_WS(",", collaborators, ?) WHERE username = ?',
      [collaborator, username], (updateError, updateResults) => {
        if (updateError) {
          console.error('Error adding collaborator to the database:', updateError);
          return res.status(500).json({ error: 'Error adding collaborator to the database' });
        }

        res.json({ message: 'Collaborator added successfully to the database' });
      });
  });
});


function fetchCollaborators(username, callback) {
  const collaboratorsSql = 'SELECT collaborators FROM users WHERE username = ?';
  db.query(collaboratorsSql, [username], (error, results) => {
    if (error) {
      console.error('Error fetching collaborators:', error);
      callback(error, null);
      return;
    }

    const collaborators = results[0]?.collaborators ? results[0].collaborators.split(',') : [];
    callback(null, collaborators);
  });
}

// Example endpoint to get collaborators for the active user
app.get('/getCollaborators', (req, res) => {
  const activeUserSql = 'SELECT username FROM active_user LIMIT 1';
  db.query(activeUserSql, (error, results) => {
    if (error) {
      console.error('Error fetching active user details:', error);
      return res.status(500).json({ error: 'Error fetching active user details' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Active user not found' });
    }

    const activeUserDetails = results[0];

    fetchCollaborators(activeUserDetails.username, (collaboratorsError, collaborators) => {
      if (collaboratorsError) {
        return res.status(500).json({ error: 'Error fetching collaborators' });
      }

      res.json(collaborators);
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
