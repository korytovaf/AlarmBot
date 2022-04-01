const { Schema, model } = require('mongoose');

const schema = new Schema({
  userId: {type: Number, required: true},
  utc: {type: String, required: true},
  utcString: {type: String, required: true},
});

module.exports = model('Users', schema, 'Users');
