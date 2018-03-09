const express = require('express')
const path = require('path')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const Cartoon = require('./model/model')


const port = process.env.PORT || 9527

let roomInfo = {}

server.listen(port, function () {
  console.log('Server listening at port %d', port)
})

app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', function (socket) {
  let roomId = ''
  let user = ''

  socket.on('join room', function ({room, username}) {
    user = username
    roomId = room
    if (!roomInfo[room]) {
      roomInfo[room] = []
    }
    roomInfo[room].push(user)
    socket.join(room)
    Cartoon.find({roomId: roomId}, 'userName time content roomId', {sort: {time: 1}}, function (err, docs) {
      if (err) return console.log(err)
      io.to(roomId).emit('room info',
        {
          mes: `${user}加入了房间`,
          roomNum: roomInfo[room].length,
          content: docs
        })
    })
  })

  socket.on('new message', function (data) {
    io.to(roomId).emit('new message', {
      username: user,
      message: data
    })
    console.log('user', user)
    let doc = {
      userName: user,
      time: new Date().getTime(),
      content: data,
      roomId
    }
    Cartoon.create(doc, (err, doc) => {
      if (err) return console.log(err)

      if (doc) {
        console.log('成功插入数据库')
      }
    })
  })

  socket.on('disconnect', function () {
    if (roomInfo[roomId]) {
      let index = roomInfo[roomId].indexOf(user)
      roomInfo[roomId].splice(index, 1)
      socket.leave(roomId)
      io.to(roomId).emit('user left', {
        mes: `${user}离开了房间`,
        roomNum: roomInfo[roomId].length
      })
    }
  })
})