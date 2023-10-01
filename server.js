const express = require('express');
const app = express();
const fs = require('fs');
const mime = require('mime');


app.get('/', (req, res) => {
    sendFile(res, "index.html");
})

app.get('/client.js', (req, res) => {
    sendFile(res, "client.js");
})

app.get('/main.css', (req, res) => {
    sendFile(res, "main.css");
})

app.get('/background.jpg', (req, res) => {
    sendFile(res, "background.jpg");
})

app.get('/popup.html', (req, res) => {
  sendFile(res, "popup.html");
})

app.get('/popup.css', (req, res) => {
  sendFile(res, "popup.css");
})

const sendFile = function( response, filename ) {
    const type = mime.getType( filename )
 
    fs.readFile( filename, function( err, content ) {
 
      // if the error = null, then we've loaded the file successfully
      if( err === null ) {
 
        // status code: https://httpstatuses.com
        response.writeHeader( 200, { 'Content-Type': type })
        response.end( content )
 
      }else{
 
        // file not found, error code 404
        response.writeHeader( 404 )
        response.end( '404 Error: File Not Found' + err )
 
      }
    })
 }

 const listener = app.listen(3000);