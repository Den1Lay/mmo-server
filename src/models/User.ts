import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  email: string, 
  username: string,
  password: string
}

const UserSchema = new Schema({
  email: {
    type: String,
    unique: 'Use another words',
    required: 'Email is requred' //delete this in future
  },
  avatar: {
    type: String,
    default: '' //href to cdn server
  },
  username: {
    type: String,
    unique: 'Not this nick',
    //required: 'Nic'
  },
  password: {
    type: String
  },
  cards: {
    type: Array,
    default: [0, 1, 2, 3, 4, 5] // main data on client
  },
  progress: {
    type: Number,
    default: 0
  },
  games: [
    {
      type: Schema.Types.ObjectId, ref: 'Game'
    }
  ], // index of games models in future
  confirmed: {
    type: Boolean,
    default: false,
  },
  confirm_hash: {
    type: String
  },
  last_seen: {
    type: Date,
    default: new Date()
  }
},
{
  timestamps: true,
})

const UserModel = mongoose.model<IUser>('User', UserSchema)

export default UserModel