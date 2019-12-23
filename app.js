const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const crypto = require('crypto')

app.use(bodyParser.urlencoded({ extended: true }))
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/record', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})
app.get('/', (req, res) => {

  let randomString = crypto.randomBytes(32).toString('base64').substr(0, 5)
  console.log(randomString)
  res.render('index')
  console.log(req.body.Url)
})
app.post('/', (req, res) => {
  res.render('index')
  console.log(req.body.Url)
})

app.listen(port, () => {
  console.log(`the web is running on http://localhost${port}`)
})