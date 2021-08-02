const sqlite3 = require("sqlite3")//.verbose()

const creatLocalSQLDB = () => {
  const db = new sqlite3.Database("db/myDataBase.db", (error) => {
    if (error) {
      return console.error(error.message)
    }
    console.log("Local sqlite DB connected:")

    let q1 = `CREATE TABLE IF NOT EXISTS Users(
        email VARCHAR(255) NOT NULL PRIMARY KEY,
        password VARCHAR(255) NOT NULL,
        CONSTRAINT email_unique UNIQUE (email))`

    db.run(q1, (error) => {
      if (error) {
        return console.error(error.message)
      }
      console.log("-- Users table : ok")
    })

    let q2 = `CREATE TABLE IF NOT EXISTS Todos(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(255) NOT NULL,
        body VARCHAR(255),
        CONSTRAINT id_unique UNIQUE (id))`

    db.run(q2, (error) => {
      if (error) {
        return console.error(error.message)
      }
      console.log("-- Todos table : ok")
    })

  })
  return db
}

module.exports = creatLocalSQLDB()
