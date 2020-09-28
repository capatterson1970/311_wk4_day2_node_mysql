const mysql = require('mysql')
const pool = require('../sql/connection')
const { handleSQLError } = require('../sql/error')

const getAllUsers = (req, res) => {
  // SELECT ALL USERS
  pool.query("SELECT * FROM users JOIN usersContact ON users.id = usersContact.user_id JOIN usersAddress ON users.id = usersAddress.user_id", (err, rows) => {
    if (err) return handleSQLError(res, err)
    return res.json(rows);
  })
}

const getUserById = (req, res) => {
  // SELECT USERS WHERE ID = <REQ PARAMS ID>
  let sql = "SELECT * FROM users WHERE id = ?"
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, req.params['id'])

  pool.query(sql, (err, rows) => {
    if (err) return handleSQLError(res, err)
    return res.json(rows);
  })
}

const createUser = (req, res) => {
  // INSERT INTO USERS FIRST AND LAST NAME 
  // INSERT INTO user (name)
  //  VALUES ('John Smith');
  // INSERT INTO user_details (id, weight, height)
  //   VALUES ((SELECT id FROM user WHERE name='John Smith'), 83, 185);
  let sql = "INSERT INTO users (first_name, last_name) VALUES (?, ?)"
  let sql2 = "INSERT INTO usersContact (user_id, phone1, phone2, email) VALUES ((SELECT id FROM user WHERE first_name= ?), ?, ?, ?) "
  let sql3 = "INSERT INTO usersAddress (user_id, address, city, county, state, zip) VALUES ((SELECT id FROM user WHERE first_name= ?), ?, ?, ?, ?, ?) "
  // let sql = "INSERT INTO users SET ?"
  // let newUser = req.body;
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, [req.body.first_name, req.body.last_name])
  sql2 = mysql.format(sql2, [req.body.first_name, req.body.phone1, req.body.phone2, req.body.email])
  sql3 = mysql.format(sql3, [req.body.first_name, req.body.address, req.body.city, req.body.county, req.body.state, req.body.zip])
  // sql = mysql.format(sql, newUser)

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.json({ newId: results.insertId });
  })
  pool.query(sql2, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.json({ newId: results.insertId });
  })
  pool.query(sql3, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.json({ newId: results.insertId });
  })
}

const updateUserById = (req, res) => {
  // UPDATE USERS AND SET FIRST AND LAST NAME WHERE ID = <REQ PARAMS ID>
  let sql = "UPDATE users SET first_name = ?, last_name = ? WHERE id = ?"
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, [req.body.first_name, req.body.last_name, req.params.id])

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.status(204).json();
  })
}

const deleteUserByFirstName = (req, res) => {
  // DELETE FROM USERS WHERE FIRST NAME = <REQ PARAMS FIRST_NAME>
  let sql = "DELETE FROM users WHERE first_name = ?"
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, [req.params.first_name])

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.json({ message: `Deleted ${results.affectedRows} user(s)` });
  })
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserByFirstName
}