import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost:27017/mmo', 
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true
})