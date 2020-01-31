import jwt from 'jsonwebtoken'

export default (token: string) => 
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET || 'TERCE$', (err, decode) => {
      err || !decode
      ? reject(err)
      : resolve(decode)
    })
  })