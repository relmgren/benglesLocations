const express = require('express')
const fs = require('fs')
const https = require('https')
const path = require('path')
const bodyParser = require('body-parser');


const app = express()
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const port = 3443// change port for production

const httpsOptions = {
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'localhost_3443.cert')),
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'localhost_3443.key'))
}

app.get('/', function (req, res) {
  res.send('replace with index.html')
})

app.get('/destinations', function (req, res) {
  res.type('text/plain');
  res.send(fs.readFileSync(path.join(__dirname, 'destinations', 'destinations.json')))
})

app.get('/admin', function (req, res) {
  res.send('admin-page should be here')
})

app.post('/admin/post', function (req, res) {
  // need to hash this
  console.log(req.body)
  if (true) {
    console.log("updating destinations")

    // UPDATE FILE
    let content = fs.readFileSync(path.join(__dirname, 'destinations', 'destinations.json'))
    let parsedJson = JSON.parse(content)
    parsedJson.locationData.push(req.body)
    console.log(parsedJson)
    res.send('succesfully inserted')
  } else {
    res.send('wrong password')
  }
})

// replace 3000 with 80 for production.
// use environment variables for easy setup.
https.createServer(httpsOptions, app)
  .listen(port, function() {
    console.log('Server is running')
  })
