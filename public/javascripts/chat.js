document.addEventListener("DOMContentLoaded", () => {

  var max_record
  var status = document.getElementById("status")
  var online = document.getElementById("online")
  var sendForm = document.getElementById("send-form")
  var content = document.getElementById("content")
  const sender = document.getElementById('name')
  const msg = document.getElementById('msg')

  socket.on("connect", function () {
    status.innerText = "Connected."
  })

  socket.on("disconnect", function () {
    status.innerText = "Disconnected."
  })

  socket.on("online", function (amount) {
    online.innerText = amount
  })

  socket.on("user-online", function (user) {
    document.getElementById('user-box').innerHTML = `A User is online.`
  })

  socket.on("user-offline", function (user) {
    document.getElementById('user-box').innerHTML = `A User is offline.`
  })

  socket.on("msg", addMsgToBox)

  socket.on("chatRecord", function (msgs) {
    for (i = 0; i < msgs.length; i++) {
      (function () {
        addMsgToBox(msgs[i])
      })()
    }
  })

  socket.on("maxRecord", function (amount) {
    max_record = amount
  })

  socket.on("sender_typing", function (sender) {
    document.getElementById('typing_on').innerHTML = `${sender} is typing...`

    setTimeout(notTyping, 500)

    function notTyping() {
      socket.emit("not_typing")
    }
  })

  socket.on("nobody_typing", function () {
    document.getElementById('typing_on').innerHTML = ''
  })

  // 輸入監聽
  msg.addEventListener('keypress', () => {
    socket.emit('typing', sender.value)
  })

  // 送出監聽
  sendForm.addEventListener("submit", function (e) {
    e.preventDefault()

    var ok = true
    var formData = {}
    var formChild = sendForm.children

    for (var i = 0; i < sendForm.childElementCount; i++) {
      var child = formChild[i]
      if (child.name !== "") {
        var val = child.value
        if (val === "" || !val) {    // 如果值為空或不存在
          ok = false
          child.classList.add("error")
        } else {
          child.classList.remove("error")
          formData[child.name] = val
        }
      }
    }

    // ok 為真才能送出
    if (ok) {
      socket.emit("send", formData)
      msg.value = ''
    }
  })

  var scrolled = false

  setInterval(updateScroll, 5000)

  content.on('scroll', function () {
    scrolled = true
  })

  // 新增訊息到方框中
  function addMsgToBox(d) {
    var msgBox = document.createElement("div")
    msgBox.className = "msg"
    var nameBox = document.createElement("span")
    nameBox.className = "name"
    var avatarBox = document.createElement("img")
    var name = document.createTextNode(d.name)
    avatarBox.src = d.avatar
    var msg = document.createTextNode(d.msg)

    nameBox.appendChild(name)
    msgBox.appendChild(avatarBox)
    msgBox.appendChild(nameBox)
    msgBox.appendChild(msg)
    content.appendChild(msgBox)

    if (content.children.length > max_record) {
      rmMsgFromBox()
    }
  }

  // 移除多餘的訊息
  function rmMsgFromBox() {
    var childs = content.children
    childs[0].remove()
  }

  // 讓捲軸維持在最下方，顯示最新訊息
  function updateScroll() {
    if (!scrolled) {
      var element = document.getElementById("content")
      element.scrollTop = element.scrollHeight
    }
  }

})