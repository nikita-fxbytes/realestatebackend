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
//Admin Routes
app.use('/api/admin', require('./routes/admin/auth'));
app.use('/api/admin', require('./routes/admin/property'));
app.use('/api/admin', require('./routes/admin/role'));
app.use('/api/admin', require('./routes/admin/dashboard'));
app.use('/api/admin', require('./routes/admin/inquiry'));
//end

//Customer Routes
app.use('/api', require('./routes/customer/property'));
app.use('/api', require('./routes/customer/inquiry'));
app.use('/api', require('./routes/customer/auth'))
// End

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});