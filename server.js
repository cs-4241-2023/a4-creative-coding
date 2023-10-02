const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

const listener = app.listen(process.env.PORT, () => {
  console.log(`App is listening on port ${listener.address().port}`);
});
