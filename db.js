const mongoose = require('mongoose');
const mongoURI = process.env.DB_URL;
const connectToMongo =  () => {
    mongoose.connect(mongoURI)
    .then( ()=>
       console.log("Connected to mongo Successful")
   )
}

module.exports = connectToMongo;