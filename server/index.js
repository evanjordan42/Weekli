const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 8000;
const db = require('../database')

const controllers = require('./controllers.js');

const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'PUT', 'POST'] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, '../client/dist')));

app.get('/users', controllers.getAll);
app.get('/prefs', controllers.getPrefs)
app.post('/prefs', controllers.postPrefs);



app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));