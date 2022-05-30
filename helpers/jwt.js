const { expressjwt: jwt } = require('express-jwt')
// var jwt = require('express-jwt')

const isRevoked = async (req, payload, done) => {
  console.log(payload.payload.isAdmin == true ? 'Admin' : 'Not Admin')
  if (!payload.payload.isAdmin) {
    done(null, yes)
  }

  // done()
}

function authjwt() {
  const secret = process.env.secret
  const api = process.env.API_URL
  return jwt({
    secret,
    algorithms: ['HS256'],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/api\/v1\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/users(.*)/, methods: ['GET', 'OPTIONS'] },
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  })
}

module.exports = authjwt
