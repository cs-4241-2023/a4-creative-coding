const express = require('express'),
      app = express(),
      http = require('http'),
      server = http.createServer(app);

app.use( express.urlencoded({ extended:true }) );
app.use(express.static(__dirname));

app.use((req, res, next) => {
    console.log('Time: ', Date.now());
    next();
});

app.get('/', (req, res) => {
    console.log('get main')
    res.sendFile(__dirname+'/public/index.html')
})

app.get('/style.css', function(req, res) {
    res.sendFile(__dirname + "/public/style.css");
});

app.get('/index.js', function(req, res) {
    res.sendFile(__dirname + "/public/index.js");
});

app.listen(process.env.PORT || 3000, () => console.log('Example app is listening on port 3000.'));
