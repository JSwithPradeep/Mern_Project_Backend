const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://0.0.0.0:27017/E-product");