const express = require('express')
const fs = require('fs')
const https = require('https')
const path = require('path')
const bodyParser = require('body-parser');

const app = express()
const port = 3443 // change port for production
const destinationsFile = path.join(__dirname, 'destinations', 'destinations.json')
const httpsOptions = {
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'localhost_3443.cert')),
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'localhost_3443.key'))
}

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


// GETS
app.get('/', function (req, res) {
  res.send('replace with index.html')
})

app.get('/destinations', function (req, res) {
  res.type('text/plain');
  res.send(fs.readFileSync(destinationsFile, 'utf-8'))
})

app.get('/admin', function (req, res) {
  res.send('admin-page should be here')
})

// POSTS
app.post('/admin/post', function (req, res) {
  // should check password
  // if (req.body.password == this.password)
  if (true) {

    // UPDATE FILE
    let content = fs.readFileSync(destinationsFile, 'utf-8')
    let parsedJson = JSON.parse(content)
    parsedJson.locationData.push(req.body)
    fs.writeFileSync(destinationsFile, JSON.stringify(parsedJson, null, 2), 'utf-8')

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
