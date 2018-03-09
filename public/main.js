$(function () {
  const socket = io()
  let loginPage = $('.login.page')
  let usernameInput = $('.usernameInput')
  let messages = $('.messages')
  let inputMessage = $('.inputMessage')
  let room_list = $('.room_list')
  let header = $('header')
  if (sessionStorage.getItem('username')) {
    loginPage.hide()
    room_list.show()
  }
  usernameInput.on('keydown', function (e) {
    const keyNum = e.keyCode
    if (keyNum === 13) {
      loginPage.fadeOut()
      room_list.show()

      socket.emit('user login', $(this).val())
      sessionStorage.setItem('username', $(this).val())
      $(this).html()
    }
  })

  inputMessage.on('keydown', function (e) {
    const keyNum = e.keyCode
    if (keyNum === 13) {
      socket.emit('new message', $(this).val())
      $(this).val('')
    }
  })

})