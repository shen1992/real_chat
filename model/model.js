const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/CartoonLive')

const db = mongoose.connection

db.on('error', function (error) {
  console.log(`error: ${error}`)
})
db.once('open', function () {
  console.log('连接成功！')
})

const CartoonLive = mongoose.Schema({
  userName: String,
  time: Number,
  content: String,
  roomId: Number
})

const Cartoon = mongoose.model('Cartoon', CartoonLive)

module.exports = Cartoon




