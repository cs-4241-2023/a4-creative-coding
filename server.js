const express = require('express'),
      app = express(),
      cors = require('cors')

app.use(cors())
app.use(express.static('./'))
app.listen(3000, () => {console.log('Server is running on port 3000')})