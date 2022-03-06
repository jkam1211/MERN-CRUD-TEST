const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BusinessSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: '',
      unique: true
    },
    pictures: [
      {
        type: String
      }
    ],
    logo: {
      type: String,
      default: ''
    },
    openTime: {
      type: String,
      default: ''
    },
    closeTime: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('businesses', BusinessSchema);
