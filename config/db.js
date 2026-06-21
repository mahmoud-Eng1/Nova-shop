
const mongoose = require('mongoose');

mongoose
  .connect(process.env.URL_CONNECT_DB)
  .then(() => console.log("db worked"))
  .catch((err) => console.log(err));
