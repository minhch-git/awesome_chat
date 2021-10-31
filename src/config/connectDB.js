import "colors";
import Bluebird from "bluebird";
import mongoose from "mongoose";

// const URI = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const connectDB = () => {
  mongoose.Promise = Bluebird;
  const URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zdzm0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  // const URI = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  mongoose
    .connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(db => console.log("Connect mongodb successfully!".green.bold))
    .catch(err => console.error("Connect mongodb failure!".red, err));
};
export default connectDB;
