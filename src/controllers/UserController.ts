import { Request, Response, NextFunction } from 'express';
import { Server } from 'socket.io';
import { createJWToken } from '../utils'
import { User } from '../models';

class UserController {
  io: Server

  constructor(io: Server) {
    this.io = io
  }

  register = (req: Request, res: Response, next: NextFunction) => {
    const postData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    }
    const newUser = new User(postData)
    newUser
      .save()
      .then((user: any) => {
        const token = createJWToken({
          _id: user._id,
          email: user.email
        })
        res.json({status: 'success', user, token})
      })
      .catch((e: any) => {
        if(e.code === 11000) {
          res.json({status: 'duplicate', user: e.keyValue.email})
        } else {
          res.status(500).json({e})
        }
      })
  }

  login = (req: Request, res: Response, next: NextFunction) => {
    User.findOne({email: req.body.email})
      .exec((error: object, user: any) => {
        if(user && user.password === req.body.password) {
          const token = createJWToken({
            _id: user._id,
            email: req.body.email
          })
          res.json({status: 'success', user, token})
        } else {
          res.json({status: 'error', msg: 'Bad password or email.'})
        }
      })
  }

  setCards = (req: any, res: Response, next: NextFunction) => {
    User.findOneAndUpdate({_id: req.user._id}, {$set: {cards: req.body.newCards}})
      .then((upUser: any) => {
        res.json({status: 'success', upUser})
      })
      .catch((er: any) => res.status(500).json({er}))
  }
}

export default UserController