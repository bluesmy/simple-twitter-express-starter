const express = require('express')
const helpers = require('./_helpers')

const app = express()
const port = 3000
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const server = require('http').Server(app)
const io = require('socket.io')(server)
const records = require('./public/javascripts/records.js')

const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const methodOverride = require('method-override')

app.engine('handlebars', exphbs({ defaultLayout: 'main', helpers: require('./config/handlebars-helpers') }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const sessionMiddleware = session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
})

app.use(sessionMiddleware)

io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res, next)
})

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))

app.use((req, res, next) => {
  res.locals.user = helpers.getUser(req)
  res.locals.isAuthenticated = helpers.ensureAuthenticated(req)
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

app.use('/', require('./routes/index'))

// 線上人數計數
let onlineCount = 0

io.on('connection', socket => {
  console.log('io connected!')
  // 有連線發生時增加人數
  onlineCount++
  // 發送人數給網頁
  io.emit('online', onlineCount)
  // 有人進入聊天室時發送通知
  socket.on('login', () => {
    console.log('A User is connected')
    io.emit('user-online')
  })

  // 新增記錄最大值，用來讓前端網頁知道要放多少筆
  socket.emit('maxRecord', records.getMax())

  socket.on('send', msg => {
    console.log(`send ${msg}`)
    // 如果 msg 內容鍵值小於 2 等於是訊息傳送不完全
    // 因此我們直接 return ，終止函式執行。
    if (Object.keys(msg).length < 2) return
    records.push(msg)
  })

  // 有人正在打字
  socket.on('typing', sender => {
    console.log(`${sender} is typing`)
    // let others know who is typing
    socket.broadcast.emit('sender_typing', sender)
  })

  // 沒有人在打字
  socket.on('not_typing', () => {
    console.log(`nobody is typing`)
    socket.emit('nobody_typing')
  })

  socket.on('disconnect', () => {
    console.log('io disconnected!')
    // 有人離線了，扣人
    onlineCount = (onlineCount < 0) ? 0 : onlineCount -= 1
    io.emit('online', onlineCount)
    // 有人離開聊天室時發送通知
    console.log('A user is disconnected')
    io.emit('user-offline')
  })
})

// 新增 Records 的事件監聽器
records.on('new_message', msg => {
  console.log(`new message ${msg}`)
  // 廣播訊息到聊天室
  io.emit("msg", msg)
})

server.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
