const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to database!");
  } catch (error) {
    console.log("DB Error: " + error);
  }
};
module.exports = dbConnection;