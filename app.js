const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('短網址')
})

app.listen(port, () => {
  console.log(`the web is running on http://localhost${port}`)
})