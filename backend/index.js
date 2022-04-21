const express = require('express');
const routes = require('./routes');
const connectToDatabase = require('./src/database/connect');

const app = express();

app.use(express.json());
app.use(routes);

connectToDatabase();
app.listen(3333);



