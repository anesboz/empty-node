const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator")
const auth = require("../middlewares/authentification")
// const config = require("config")

const db = require("../db/sqlDB_manager")
// const bodyParser = require("body-parser")
// const auth = require("../../middleware/auth")
// const { exists } = require("../../models/User")

// creation de la BD local en SQLite3 qui contient les tables users et friends
// const db = creatLocalSQLDB()

router.get("/", auth, (req, res) => {
  let q = "select * from Todos"
  db.all(q, [], (error, todos) => {
    if (error)
      return res.status(500).send("PROBLEME SQL getting todos " + error.message)
    res.status(200).send(todos)
  })
})

router.post("/add", auth, (req, res) => {
  const { title, body } = req.body
  let q = "INSERT INTO todos(title, body) VALUES (?,?)"
  db.run(q, [title, body], (error) => {
    if (error)
      return res
        .status(500)
        .send("PROBLEME SQL insering new todo" + error.message)
    res.status(201).send("todo added")
  })
})

// requete : .../delete?id=1
router.post("/delete", auth, (req, res) => {
  const id = req.query.id
  db.run(`DELETE FROM todos WHERE id=?`, id, (err) => {
    if (err) {
      return console.error(err.message)
    }
    res.send(`successfully deleted`)
  })
})


// UPDATE : .../delete?id=1
router.post("/update", auth, (req, res) => {
  const id = req.query.id
  const { title, body } = req.body
  let q = `UPDATE todos 
  SET title = '${title}',body = '${body}'
  WHERE ID = ${id};`
  db.run(q, [], (error) => {
    if (error)
      return res
        .status(500)
        .send("PROBLEME SQL updating todo" + error.message)
    res.status(200).send("updated")
  })
})



module.exports = router
