const { Schema, model } = require('mongoose')

const schema = new Schema({
  userId: {type: Number, required: true},
  alarmText: {type: String, required: true},
  utcExpiryTime: {type: Date, required: true},
})

module.exports = model('Alarms', schema, 'Alarms')
