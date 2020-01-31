import mongoose, {Schema, Document} from 'mongoose'

export interface IGame extends Document {
  light: {
    type: Schema.Types.ObjectId,
    ref: string,
    require: true
  },
  dark: {
    type: Schema.Types.ObjectId,
    ref: string,
    require: true
  },
}

const GameSchema = new Schema({
  light: { type: mongoose.Types.ObjectId, ref: 'User' },
  dark: { type: mongoose.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    default: 'live'
  },
  winner: {
    type: String,
    default: 'none'
  }
},
{
  timestamps: true,
})

const GameModel = mongoose.model<IGame>('Game', GameSchema)

export default GameModel