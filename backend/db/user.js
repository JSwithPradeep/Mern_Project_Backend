const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

mongoose.set('strictQuery', false);
const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String
});

module.exports = mongoose.model("products",userSchema);