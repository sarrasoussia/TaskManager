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
app.get('/tasklist', async (req, res) => {
  db.query('SELECT username FROM active_user', async (error, usernameResults) => {
    if (error) {
      console.error('Error getting active username:', error);
      res.status(500).json({ error: 'Error getting active username' });
      return;
    }

    const active_username = usernameResults.length > 0 ? usernameResults[0].username : null;

    if (!active_username) {
      res.status(404).json({ error: 'Active username not found' });
      return;
    }

    // Utiliser l'active username pour récupérer les tâches associées
    try {
      const tasks = await getAlltasks(active_username);
      res.send(tasks);
    } catch (error) {
      console.error('Error getting tasks:', error);
      res.status(500).json({ error: 'Error getting tasks' });
    }
  });
});



app.post('/tasklist', async (req, res) => {
  try {
    const { etat, titre, description, proprietaire, date_fin, username } = req.body;
    const note = await createtask(etat, titre, description, proprietaire, date_fin, username);
    res.send(note);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.post('/collab', async (req, res) => {
  db.query('SELECT username FROM active_user', async (error, usernameResults) => {
    if (error) {
      console.error('Error getting active username:', error);
      res.status(500).json({ error: 'Error getting active username' });
      return;
    }

    const active_username = usernameResults.length > 0 ? usernameResults[0].username : null;

    if (!active_username) {
      res.status(404).json({ error: 'Active username not found' });
      return;
    }

    // Utiliser l'active username pour récupérer les tâches associées
    try {
      const {collabusername} = req.body;
      if (!collabusername) {
        return res.status(400).json({ error: 'collabusername is required' });
      }
      if (res.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      const collabs = await addcollab(active_username,collabusername);
      res.send(collabs);
    } catch (error) {
      console.error('Error getting tasks:', error);
      res.status(500).json({ error: 'Error getting tasks' });
    }
  });
});




app.get('/collab', async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: 'username is required' });
  }
  if (res.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }
  const collabs = await getCollabs(username);
  res.send(collabs);
});

app.delete('/collab', async (req, res) => {
  db.query('SELECT username FROM active_user', async (error, usernameResults) => {
    if (error) {
      console.error('Error getting active username:', error);
      res.status(500).json({ error: 'Error getting active username' });
      return;
    }

    const active_username = usernameResults.length > 0 ? usernameResults[0].username : null;

    if (!active_username) {
      res.status(404).json({ error: 'Active username not found' });
      return;
    }

    // Utiliser l'active username pour récupérer les tâches associées
    try {
      const {collabusername } = req.body;
      if (!collabusername) {
        return res.status(400).json({ error: 'Both username and collabusername are required' });
      }
  
      // Vérifier si l'utilisateur existe
      const userExists =await db.query('SELECT * FROM users WHERE username = ?', [active_username]);
      if (userExists.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Supprimer le collaborateur du champ collaborators dans la table users
      await db.query('UPDATE users SET collaborators = REPLACE(collaborators, ?, "") WHERE username = ?', [collabusername, active_username]);
  
      res.send({ success: true });
    } catch (error) {
      console.error('Error deleting collaborator:', error);
      res.status(500).json({ error: 'Internal Server Error' });
}
});
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



//**********Collaborators section ****************/

// add collaborator endpoint
app.post('/addCollaborator', (req, res) => {
  const { username, collaborator } = req.body;
  if (!username || !collaborator) {
    return res.status(400).json({ error: 'Username and collaborator are required' });
  }

  // Check if the collaborator exists in the list of users
  db.query('SELECT * FROM users where username = ? ',[collaborator], (checkError, checkResults) => {
    if (checkError) {
      console.error('Error checking for existing collaborator:', checkError);
      return res.status(500).json({ error: 'Error checking for existing collaborator' });
    }
    if (checkResults.length === 0) {
      // Collaborator does not exist in the list of users
      return res.status(400).json({ error: 'Collaborator does not exist' });
    }

    // Collaborator exists, proceed with checking and adding
    db.query('SELECT collaborators FROM users WHERE username = ?', [username], (selectError, selectResults) => {
      if (selectError) {
        console.error('Error checking for existing collaborator:', selectError);
        return res.status(500).json({ error: 'Error checking for existing collaborator' });
      }

      const existingCollaborators = selectResults[0]?.collaborators || '';
      if (existingCollaborators.split(',').includes(collaborator)) {
        return res.status(400).json({ error: 'Collaborator already exists for the user' });
      }

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
});


//delete all collaborators of the active_user
app.post('/clearCollaborators', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }
  db.query('UPDATE users SET collaborators = "" WHERE username = ?', [username], (updateError, updateResults) => {
    if (updateError) {
      console.error('Error clearing collaborators from the database:', updateError);
      return res.status(500).json({ error: 'Error clearing collaborators from the database' });
    }
    fetchCollaborators(username, (fetchError, updatedCollaborators) => {
      if (fetchError) {
        return res.status(500).json({ error: 'Error fetching collaborators' });
      }
      res.json(updatedCollaborators);
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

// get collaborators for the active user
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


//********** Tasks section ****************/


// create a new task (sarra) to the correspondant active_user
app.post('/tasks', (req, res) => {
  db.query('SELECT username FROM active_user', (error, usernameResults) => {
    if (error) {
      console.error('Error getting active username:', error);
      res.status(500).json({ error: 'Error getting active username' });
      return;
    }
    const active_username = usernameResults.length > 0 ? usernameResults[0].username : null;
    if (!active_username) {
      res.status(404).json({ error: 'Active username not found' });
      return;
    }
    const newTask = req.body;
    newTask.username_task = active_username; 
    delete newTask.id;
    db.query('INSERT INTO tasks SET ?', newTask, (taskError, results) => {
      if (taskError) {
        console.error('Error inserting task:', taskError);
        res.status(500).json({ error: 'Error adding task' });
        return;
      }
      newTask.id = results.insertId;
      res.json(newTask);
    });
  });
});

//display the tasks of the active_user
app.get('/tasks', (req, res) => {
  db.query('SELECT username FROM active_user', (error, usernameResults) => {
    if (error) {
      console.error('Error getting active username:', error);
      res.status(500).json({ error: 'Error getting active username' });
      return;
    }
    const active_username = usernameResults.length > 0 ? usernameResults[0].username : null;
    if (!active_username) {
      res.status(404).json({ error: 'Active username not found' });
      return;
    }
    db.query('SELECT * FROM tasks WHERE username_task = ?', [active_username], (tasksError, results) => {
      if (tasksError) {
        console.error('Error getting tasks:', tasksError);
        res.status(500).json({ error: 'Error getting tasks' });
        return;
      }
      res.json(results);
    });
  });
});


//updating the task of the active_user by just knowing its ID
app.put('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const updatedTask = req.body;
  const activeUserSql = 'SELECT username FROM active_user';

  db.query(activeUserSql, (error, results) => {
    if (error) {
      console.error('Error fetching active user details:', error);
      return res.status(500).json({ error: 'Error fetching active user details' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Active user not found' });
    }

    const activeUserDetails = results[0];

    const updateTaskSql = `
      UPDATE tasks 
      SET 
        name = ?, 
        description = ?, 
        deadline = ?, 
        state = ?, 
        file = ?
      WHERE 
        id = ? AND 
        username_task = ?`;

    db.query(
      updateTaskSql,
      [
        updatedTask.name,
        updatedTask.description,
        updatedTask.deadline,
        updatedTask.state,
        updatedTask.file,
        taskId,
        activeUserDetails.username
      ],
      (updateError) => {
        if (updateError) {
          console.error('Error updating task:', updateError);
          res.status(500).json({ error: 'Error updating task' });
          return;
        }

        // After updating, retrieve the updated tasks and send them in the response
        db.query('SELECT * FROM tasks WHERE username_task = ?', [activeUserDetails.username], (retrieveError, retrieveResults) => {
          if (retrieveError) {
            console.error('Error retrieving updated tasks:', retrieveError);
            res.status(500).json({ error: 'Error retrieving updated tasks' });
            return;
          }
          res.json(retrieveResults);
        });
      }
    );
  });
});


//delete the task 
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

// Get task details by taskId
app.get('/tasks/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  connection.query('SELECT * FROM tasks WHERE id = ?', taskId, (error, results) => {
    if (error) {
      console.error('Error getting task details:', error);
      res.status(500).json({ error: 'Error getting task details' });
      return;
    }
    const task = results[0];
    res.json(task);
  });
});




// Get comments by taskId
// app.get('/comments/:taskId', async (req, res) => {
//   const taskId = req.params.taskId;

//   try {
//     const result = await pool.query('SELECT * FROM comments WHERE taskId = $1', [taskId]);
//     res.json(result.rows);
//   } catch (error) {
//     console.error('Error fetching comments:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Add a new comment
// app.post('/comments', async (req, res) => {
//   const { content, created_at, taskId, owner } = req.body;

//   try {
//     const result = await pool.query(
//       'INSERT INTO comments (content, created_at, taskId, owner) VALUES ($1, $2, $3, $4) RETURNING *',
//       [content, created_at, taskId, owner]
//     );
//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error('Error adding comment:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });





app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});