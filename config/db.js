const mongoose = require("mongoose");
const concetDB = async () => {
 const conn = await mongoose.connect(
  process.env.NEW_MONGO_URL,
    { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
  }
  );
  console.log(`mongoDb Connected:连接${conn.connection.host}`)
}
module.exports = concetDB