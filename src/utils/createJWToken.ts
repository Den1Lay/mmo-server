import jwt from 'jsonwebtoken'

interface ILoginData {
  _id: string,
  email: string
}

export default (user: ILoginData) => jwt.sign(
  {user},
  process.env.JWT_SECRET || 'TERCE$', 
  {
    //expiresIn: process.env.JWT_MAX_AGE, liveControl
    algorithm: 'HS256',
  }
)
