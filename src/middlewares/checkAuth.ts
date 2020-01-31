import { Response, NextFunction} from 'express';
import { verifyJWToken } from '../utils'

export default (req: any, res: Response, next: NextFunction) => {
  const pass = req.headers.token || '';
  verifyJWToken(pass)
    .then((data: any) => {
      req.user = data.user;
      next()
    })
    .catch(er => res.status(403).json({msg: 'Forbidden', er,}))
}