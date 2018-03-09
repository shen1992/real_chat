const socket = io()

let onlineNum = $('#onlineNum')
let roomNo = $('#room')
let messageInput = $('#messageInput')
let msglog = $('#msglog')
let nickname = $('#nickname')

socket.emit('join room', {'room': getUrlParam('room'), 'username': sessionStorage.getItem('username')})

socket.on('room info', function ({mes, roomNum, content}) {
  onlineNum.html(`当前在线人数:${roomNum}`)
  msglog.append(`<li>${mes}</li>`)
  nickname.html(`昵称: ${sessionStorage.getItem('username')}`)
  roomNo.html(`房间:${getUrlParam('room')}`)
  console.log('content', content)
  content.forEach(item => {
    msglog.append(`<li>${item.userName}: ${item.content}</li>`)
  })
})

messageInput.on('keydown', function (e) {
  const keyNum = e.keyCode
  if (keyNum === 13) {
    socket.emit('new message', $(this).val())
    $(this).val('')
  }
})

socket.on('new message', function ({message, username}) {
  msglog.append(`<li>${username}:${message}</li>`)
})

socket.on('user left', function ({mes, roomNum}) {
  msglog.append(`<li>${mes}</li>`)
  onlineNum.html(`当前在线人数:${roomNum}`)
})

function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg);  //匹配目标参数
  if (r != null) return unescape(r[2]); return null; //返回参数值
}