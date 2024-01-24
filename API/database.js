import mysql from "mysql2"
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'task_manager_db',
  }).promise()

 export async function getAlltasks(username) {
    const [rows] = await db.query("select * from tasksala where username = ?", [username])
    return rows
  }
  // const rows= await getAlltasks();
  // console.log(rows)
  
 export async function createtask(etat, titre, description, proprietaire, date_fin, username) {
  const userExists = await db.query('SELECT * FROM users WHERE username = ?', [proprietaire]);
  if (userExists.length === 0) {
    throw new Error('Le propriétaire spécifié n\'existe pas dans la table des utilisateurs.');
  }

  const [result] = await db.query(`
    INSERT INTO tasksala (etat,titre,description,proprietaire,date_fin,username)
    VALUES (?,?,?,?,?,?)
    `, [etat,titre,description,proprietaire,date_fin,username])
    return result
}

  export async function getCollabs(username) {
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
  
    if (rows.length === 0) {
      // Aucun utilisateur trouvé avec le nom d'utilisateur spécifié
      throw new Error("Utilisateur non trouvé");
    }
  
    return rows;
  }
  // const res= await getCollabs('sarrourty');
  // console.log(res)
 
  export async function addcollab(username, collaborator) { 
    const [userResult] = await db.query('SELECT * FROM users WHERE username = ?', [collaborator]);
    if (userResult.length === 0) {
      throw new Error('Le collaborator spécifié n\'existe pas.');
    }
    const [collabResult] = await  db.query('SELECT collaborators FROM users WHERE username = ?', [username]);
    const existingCollaborators = collabResult[0]?.collaborators || '';
    if (existingCollaborators.split(',').includes(collaborator)) {
      throw new Error('Collaborator already exists for the user');
      
    }

    const [result] = await db.query(
      'UPDATE users SET collaborators = CONCAT_WS(",", collaborators, ?) WHERE username = ?',
      [collaborator, username]
    );
  
    return result;
  }
  
  
  // const res= await addcollab('bhim','tahfouna');
  // console.log(res)
  
  // const res= await createcollab('mac','aloulou');
  // console.log(res)
  // const res=createtask("done","rthty","erh","ala",new Date("11-01-2002"));
  // console.log(res)