const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator")

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


const config = require('../config')

const db = require("../db/sqlDB_manager")

// const bodyParser = require("body-parser")
// const auth = require("../../middleware/auth")
// const { exists } = require("../../models/User")

// creation de la BD local en SQLite3 qui contient les tables users et friends
// const db = creatLocalSQLDB()

// ------- PUBLIC no auth mmiddleware
// enregistrer un nouvel utilisateur
router.post(
  "/register",
  [
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
    check("email", "Email is required").notEmpty(),
  ],
   (req, res) => {
    // callback
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log(errors.array())
      return res.status(400).json({ errors: errors.array() })
    }

    // const user = req.body
    const { email, password } = req.body

    // check if already exists
    var selectUser = `SELECT * FROM Users u WHERE u.email = '${email}'`
    db.get(selectUser, [],  (error, candidate) => {
      if (error)
        return res
          .status(500)
          .send(
            "PROBLEME SQL login lors de verification si user existe " +
              error.message
          )

      if (candidate) {
        return res.status(409).send("User already exists, change the email")
      }
      console.log("ok il s agit d un nouvel user")

      //Ecrypt and hash the password
      // password = await bcrypt.hash(req.body.password, 10)
      bcrypt.hash(password, 10, (err, hash) => {
        // Store hash in your password DB.
        var insert = "INSERT INTO users (email, password) VALUES (?,?)"
        var params = [email, hash]
        db.run(insert, params,  (error) => {
          if (error) {
            return res
              .status(500)
              .send(
                "probleme ssqlite insertion de nouvel user " + error.message
              )
          }
          console.log("ok user ajouter au local sqlite database")

          const payload = { user : {
            email,
            hash
          } }
          //Sign the token
          jwt.sign(
            payload,
            config.mySecretKey,
            { expiresIn: 360000 },
            (err, token) => {
              if (err) throw err
              res.json({ token })
            }
          )
        })
      })
    })
  }
)

// se connecter un nouvel utilisateur
router.post(
  "/login",
  [
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
    check("email", "Email is required").notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() })

    const { email, password } = req.body
    var selectUser = `SELECT * FROM Users u WHERE u.email = '${email}'`

    db.get(selectUser, [],  (error, user) => {
      if (error)
        return res.status(500).json("PROBLEME SQL login", error.message)

      if (!user) return res.status(404).send("no matching account")

      // var goodPass = await bcrypt.compare(password, user.password)
      bcrypt.compare(password, user.password, (err, goodPass) => {
        if (!goodPass) return res.status(401).send("Bad password")
        const payload = {
          user: {
            email,
            password,
          },
        }
        //Sign the token
        jwt.sign(
          payload,
          config.mySecretKey,
          { expiresIn: 360000 },
          (err, token) => {
            if (err) throw err
            res.json({ token })
          }
        )
      })
    })
  }
)

router.delete("/logout", (req, res) => {
  db.all("DROP * FROM Users", [], (err, results) => {
    if (err) {
      res.status(500)
    } else {
      res.status(200)
      console.log("success")
    }
  })
})

module.exports = router