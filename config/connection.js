const mongoose = require("mongoose");

const connectDb = async () => {
  mongoose
    .connect(process.env.MONOGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then((res) => console.log(`Db connected on ${res.connection.user}`));
};
module.exports = connectDb;



// const mongoose = require("mongoose");

// const connectDb = async () => {
//   mongoose
//     .connect(
//       "mongodb+srv://serverBoiler:BrxyutmzqiCM4U6c@cluster0.t30x6.mongodb.net/RagdollCatServer?retryWrites=true&w=majority",
//       {
//         useNewUrlParser: true,
//         useCreateIndex: true,
//         useUnifiedTopology: true,
//         useFindAndModify: false,
//       }
//     )
//     .then((res) => console.log(`Db connected on ${res.connection.user}`))
//     .catch((err) => console.log(err));

// };
// module.exports = connectDb;