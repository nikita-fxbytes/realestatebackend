const connectToMongo = require('./db');
const express = require('express');

connectToMongo();
const app = express()
const port = 5000

app.use(express.json());
//Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/property', require('./routes/property'));
//end

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})