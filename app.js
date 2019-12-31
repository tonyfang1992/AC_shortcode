const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const Url = require('./model/url')
const session = require('express-session')


function getRandomCode(n, m) {

  const data = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
  let nums = ""
  for (let i = 0; i < 5; i++) {
    var c = m - n + 1
    r = Math.floor(Math.random() * c + n)

    nums += data[`${r}`]
  }
  return nums;
}

app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: true,
}))
app.use(flash())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/url', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
const db = mongoose.connection
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})
app.get('/', (req, res) => {

  res.render('index')
})

app.get('/:shortCode', (req, res) => {
  Url.findOne({
    shortCode: req.params.shortCode
  }, (err, shortCode) => {
    return res.render('url', { shortCode: shortCode })
  })
})

app.post('/', (req, res) => {
  let errors = []
  let a = req.body.Url
  if (a === '') {   //if input is null

    errors.push({ message: '請輸入網址' })
    res.render('index', {
      errors
    })

  } else {
    let code = ''
    code += getRandomCode(0, 61)
    Url.findOne({
      shortCode: code
    }).then(shortCode => {
      if (shortCode) {   //confirm shortCode exist or not
        console.log('shortCode already exists')
        res.render('index')
      } else {

        const url = new Url({
          url: req.body.Url,
          shortCode: code
        })
        url.save(err => {
          if (err) return console.error(err)

        })
        res.render('index2', { code: code })
      }
    })
  }
})

app.listen(process.env.PORT || port, () => {
  console.log(`the web is running on http://localhost${port}`)
})