// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create a schema
var logSchema = new Schema({
  user: {type: Schema.ObjectId, ref: 'User'},
  date: { type: Date, default: Date.now },
  action: String,
  target: String
});

// the schema is useless so far
// we need to create a model using it
module.exports = mongoose.model('logs', logSchema);