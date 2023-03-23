var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect(process.env.DB);

// Movie schema
var ReviewSchema = new Schema({

    movieID: String,
    username: { type: String, required: true, index: { unique: true }},
    review: String,
    rating: int 

});

// return the model
module.exports = mongoose.model('Review', ReviewSchema);