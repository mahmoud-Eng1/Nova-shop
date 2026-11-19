const mongoose = require('mongoose');

const connectDB = () => {
  mongoose.set('sanitizeFilter', true);
  return mongoose.connect(process.env.URL_CONNECT_DB);
};

module.exports = connectDB;
