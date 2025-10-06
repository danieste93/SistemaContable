const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const CONNECTION_Test = "mongodb+srv://Johnnywm:iloveme54@cluster0.hiqb2.mongodb.net/testingdb?retryWrites=true&w=majority"

mongoose.connect(CONNECTION_Test, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const conn = mongoose.connection;

conn.on('error', () => console.error.bind(console, 'connection error'));

conn.once('open', () => console.info('Connection to Database is successful'));

module.exports = conn;