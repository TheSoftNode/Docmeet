import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const dbConnect = async (db) => {
  try {
    const con = await mongoose.connect(db);
    console.log(`Database connected with ${con.connection.host}`);
  } catch (err) {
    console.log(err);
    setTimeout(dbConnect, 5000);
  }
};

export default dbConnect;
