const allowedCors = require("./allowedCorse");

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedCors.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed by CORS"));
    }
  },
  credentials: true,
  optionSuccessStatus: 200,
};

module.exports = corsOptions