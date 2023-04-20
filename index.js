require('dotenv').config()
const connectToMongo = require('./db');
const express = require('express');
connectToMongo();
const app = express()
const port = process.env.PORT;

app.use(express.json());
//Routes
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/property'));
app.use('/api', require('./routes/role'));
//end

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});