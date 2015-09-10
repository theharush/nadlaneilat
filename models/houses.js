// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create a schema
var housesSchema = new Schema({
  adress: { type: String, required: true, unique: false },
  price: { type: Number, required: true },
  roomnum: Number,
  action: Boolean,
  view: { type: String, required: false, default: 'לא צויין'},
  size: Number,
  floor: Number,
  housetype: String,
  comments: String,
  subcomments: String,
  images: [String],
  IsRec: Boolean
});

// the schema is useless so far
// we need to create a model using it
var houses = mongoose.model('houses', housesSchema);

module.exports = houses;