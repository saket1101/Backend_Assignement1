const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const dbResponse = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `Database connected successfully: ${dbResponse.connection.host}`
    );
  } catch (error) {
    console.error("Couldn't connect to MongoDb", error.message);
  }
};

module.exports = { connectDb };
