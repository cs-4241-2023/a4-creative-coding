const express = require("express");
const app = express();

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded( {extended: false} ));

app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/start.html");
});

app.get("/chooseDifficulty", function(request, response) {
  response.sendFile(__dirname + "/views/chooseDifficulty.html");
});

app.get("/gameover", function(request, response) {
  response.sendFile(__dirname + "/views/gameOver.html");
});

app.get("/easy", function(request, response) {
  response.sendFile(__dirname + "/views/easy.html");
});

app.get("/medium", function(request, response) {
  response.sendFile(__dirname + "/views/medium.html");
});

app.get("/hard", function(request, response) {
  response.sendFile(__dirname + "/views/hard.html");
});

const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
