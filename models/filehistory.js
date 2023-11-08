const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const fileSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('File', fileSchema);
