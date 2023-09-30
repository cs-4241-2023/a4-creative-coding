const express = require('express'),
      app = express(),
      cors = require('cors')

app.use(cors())
app.use(express.static('./'))
app.use(express.static(__dirname + '/public/js'))
app.use(express.static(__dirname + '/views/html'))
app.listen(3000, () => {console.log('Server is running on port 3000')})