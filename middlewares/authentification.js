const jwt = require("jsonwebtoken")
const config = require("../config")

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token")
  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" })
  }
  //Verify token
  jwt.verify(token, config.mySecretKey, function (err, decoded) {
    if (err) {
      res.status(403).json({ msg: "Token is not valid" })
    }
    req.user = decoded.user
    next()
  })
}
