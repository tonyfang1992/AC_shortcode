const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')

const Url = require('./model/url')

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

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/url', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
const db = mongoose.connection
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


  const url = new Url({
    url: req.body.Url,
    shortCode: getRandomCode(0, 61)
  })
  url.save(err => {
    if (err) return console.error(err)

  })
  res.render('index')
  console.log(req.body.Url)
})

app.listen(port, () => {
  console.log(`the web is running on http://localhost${port}`)
})