const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use(require('./api/task'));
app.use(require('./api/intern'));
app.use(require('./api/event'));
app.use(require('./api/team'));
app.use(require('./api/announce'));

// app.use(express.static(path.join(__dirname, '../client/build')));

const port = process.env.PORT || 5000;
const connection = process.env.MONGO_URI || 'mongodb://localhost:27017/cpmha';

mongoose.connect(connection, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(error => {
    console.log(error)
});

mongoose.set('useFindAndModify', false);
const db = mongoose.connection;


db.once('open', _ => {
  console.log('Connected to CPMHA database.');
});

// GET route
app.get('/', (req, res) => {
  res.send('Server running on port 5000!');
});

app.use(express.static(path.join(__dirname, 'client/build')));

app.listen(port, () => {
  console.log("listening on port 5000!");
})