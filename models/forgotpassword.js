const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const passwordSchema = new Schema({
  id:{
    type: mongoose.Schema.Types.UUID,
    required: true
  },
  active: {
    type: Boolean
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('ForgotPassword', passwordSchema);
