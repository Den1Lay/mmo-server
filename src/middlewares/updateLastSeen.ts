import { Response, NextFunction } from 'express'
import { User } from '../models';

export default (req: any, res: Response, next: NextFunction) => {
  if(!req.user) {
    next()
  } else {
    User.findOneAndUpdate({_id: req.user.id}, 
      {$set: {last_seen: new Date()}})
      .then(() => {})
      next()
  }
}