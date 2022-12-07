import express from 'express';
import routes from './routes';
import errorHandler from './middlewares/errors';
import connectDatabase from './config/database';
const app = express();


class App {
  constructor() {
    this.app = app;
    this.connectdb = connectDatabase()
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json(), express.urlencoded({ extended: false }))
  }
  
  routes() {
    this.app.use("/api/v1", routes)
    // errorHandler - tem que ficar depois das rotas para funcionar corretamente
    this.app.use(errorHandler)
  }
}

export default new App().app