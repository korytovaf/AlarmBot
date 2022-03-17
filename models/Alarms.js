const { Schema, model } = require('mongoose')

const schema = new Schema({
  userId: {type: Number, required: true},
  text: {type: String, required: true},
  time: {type: String, required: true},
  date: {type: String, required: true},
  expiryTime: {type: Date, required: true},
})

module.exports = model('Alarms', schema, 'Alarms')
