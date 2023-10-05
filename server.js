const express = require("express"),
	app = express(),
	dir  = 'public/',
	port = 3000

app.use(express.urlencoded({extended:true}))
app.use( express.static( 'public' ) )
app.use( express.json() )

app.listen( process.env.PORT || port )