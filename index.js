const express = require('express')
const app = express()
// Middleware pour inclure le format json 
app.use(express.json({ extended: false }))


app.get("/", (req, res) => res.send("This is welcome Page of the API"))

app.use("/api/todos", require("./routes/todos.js"))
app.use("/api/users", require("./routes/users.js"))


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`))