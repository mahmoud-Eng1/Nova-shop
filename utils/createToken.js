const jwt = require("jsonwebtoken")

const createToken  = (payload, secret, expiresIn )=> {
    return jwt.sign(
        {userInfo:{id: payload._id}},
         secret,
          {expiresIn }
        )
}

module.exports = createToken