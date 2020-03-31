const express = require('express')
const helpers = require('./_helpers')

const app = express()
const port = 3000

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

// 加入線上人數計數
let onlineCount = 0

// 修改 connection 事件
io.on('connection', (socket) => {
  console.log('io connected!')
  // 有連線發生時增加人數
  onlineCount++
  // 發送人數給網頁
  io.emit('online', onlineCount)
  socket.emit("maxRecord", records.getMax())   // 新增記錄最大值，用來讓前端網頁知道要放多少筆
  socket.emit("chatRecord", records.get())     // 新增發送紀錄

  socket.on('greet', () => {
    socket.emit('greet', onlineCount)
  })

  socket.on('send', (msg) => {
    // 如果 msg 內容鍵值小於 2 等於是訊息傳送不完全
    // 因此我們直接 return ，終止函式執行。
    if (Object.keys(msg).length < 2) return
    records.push(msg)
  })

  socket.on('disconnect', () => {
    console.log('io disconnected!')
    // 有人離線了，扣人
    onlineCount = (onlineCount < 0) ? 0 : onlineCount -= 1
    io.emit('online', onlineCount)
  })
})

// 新增 Records 的事件監聽器
records.on("new_message", (msg) => {
  // 廣播訊息到聊天室
  io.emit("msg", msg)
})

app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use(methodOverride('_method'))

app.use((req, res, next) => {
  res.locals.user = helpers.getUser(req)
  res.locals.isAuthenticated = helpers.ensureAuthenticated(req)
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.use('/', require('./routes/index'))

server.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
