import { Application} from 'express'
import { Server } from 'socket.io'
import { UserController } from '../controllers'
import { updateLastSeen, checkAuth } from '../middlewares'

export default (app: Application, io: Server ) => {
  const User = new UserController(io)

  app.post('/user/register', User.register);
  app.post('/user/login', User.login);

  app.use(checkAuth)
  app.use(updateLastSeen)

  app.post('/user/cardUp', User.setCards)
}