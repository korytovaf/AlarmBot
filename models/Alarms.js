const { Schema, model } = require('mongoose')

const schema = new Schema({
  userId: {type: Number, required: true},
  text: {type: String, required: true},
  time: {type: String, required: false},
  date: {type: String, required: false},
  expiryTime: {type: Date, required: true},
  utc: {type: Number, required: true}
})

module.exports = model('Alarms', schema, 'Alarms')
