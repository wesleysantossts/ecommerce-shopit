import mongoose from 'mongoose';

const connectDatabase = () => {
  mongoose.connect(process.env.DB_LOCAL_URI, {
    useNewUrlParser: true,
    UseUnifiedTopology: true
  }).then((con) => {
    console.log(`Mongo conectado com o HOST: ${con.connection.host}`)
  })
}

export default connectDatabase;