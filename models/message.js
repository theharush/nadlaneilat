// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create a schema
var messageSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: Number,
  subject: String,
  message: String
});

// the schema is useless so far
// we need to create a model using it
var message = mongoose.model('Message', messageSchema);

module.exports = message;