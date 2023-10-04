const express = require('express');
const http = require('http');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

const port = process.env.PORT || 3000;

const Save = require('./save');

app.use(express.static(__dirname + '/../dist/graphs'));
app.use(morgan('dev')); // 'dev' is one of the predefined formats provided by Morgan

app.use(express.json());

// Connect to mongodb
require('dotenv').config();
const uri = "mongodb+srv://" + process.env.MONGODB_USERNAME + ":" + process.env.MONGODB_PASSWORD + "@cluster0.em4cd9r.mongodb.net/?retryWrites=true&w=majority";
console.log(uri);
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(
  (result) => {
    console.log("connected to db");

    // start listening to requests only after we've successfully connected to the database
    const server = http.createServer(app);
    server.listen(port, () => console.log(`App running on: http://localhost:${port}`));

  }
).catch(
  (err) => console.log(err)
);


app.get('/', (req, res) => {
    const pathname = path.join(__dirname);
    console.log(pathname);


    res.sendFile(pathname);
});

app.post('/api/save', async (req, res) => {
    const {saveID, data} = req.body;

    // save or overwrite data for this saveID
    try {
      const doc = await Save.findOneAndUpdate(
        { saveID: saveID },
        {data : data},
        { upsert: true, new: true } // means "create this doc if it doesn't exist"
      );
      console.log('Successfully saved:', doc);
    } catch (err) {
      console.error('Error during the save:', err);
    }

    res.status(200).json({message: 'success'});
});

app.get('/api/load', async (req, res) => {
    const saveID = req.query.saveID;
    console.log(saveID);

    // load data for this saveID
    try {
      const doc = await Save.findOne({ saveID: saveID });
      console.log('Successfully loaded:', doc);
      res.status(200).json(doc.data);
    } catch (err) {
      console.error('Error during the load:', err);
      res.status(500).json({message: 'error'});
    }
});