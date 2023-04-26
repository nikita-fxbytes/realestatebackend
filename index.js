require('dotenv').config()
const connectToMongo = require('./db');
const express = require('express');
connectToMongo();
var cors = require('cors')
const app = express()
const port = process.env.PORT;
app.use(express.json());
app.use(cors())
app.use(express.json());
//Routes
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/property'));
app.use('/api', require('./routes/role'));
app.use('/api', require('./routes/dashboard'));
//end

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});