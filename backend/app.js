import express from 'express';
 // Devido ao cookie parser ter parado de funcionar para salvar dados como "req.variavel", foi criado o express-session para suprir essa necessidade e salvar na sessão informação desejadas. Ele é usado para salvar no lado do servidor e somente um id no cookie. Para salvar basta colocar "req.session.nomeVariavel = valor"
// import session from 'express-session';
import routes from './routes';
import errorHandler from './middlewares/errors';
import connectDatabase from './config/database';
// Usado para analisar a solicitação de cookies feita pelo cliente ao servidor. Permite assinar ou não assinar um cookie (colocando um SECRET)
import cookieParser from 'cookie-parser'; 
const app = express();

class App {
  constructor() {
    this.app = app;
    this.connectdb = connectDatabase()
    this.middlewares();
    this.routes();
  }

  middlewares() {
    // cookieParser(secret | null) - o secret (opcional) permite colocar uma chave secreta para assinar o cookie, isto é, mais uma camada de segurança para a informação. 
    this.app.use(
      express.json(), 
      express.urlencoded({ extended: true }), 
      cookieParser(), 
      // resave - forçar a salvar os dados também na session storage.
      // saveUninitialized - forçar uma sessão não inicializada a ser salva no session storage. Obs.: uma sessao é não inicializada quando ela é nova, mas não modificada
      // cookie: { maxAge: number } - salva o período (em milissegundos) que o cookie com o id fica armazenado
      // session({ 
      //   secret: process.env.SESSION_SECRET, 
      //   resave: true, 
      //   saveUninitialized: true, 
      //   cookie: {
      //     maxAge: Number(process.env.SESSION_COOKIE_EXPIRES_TIME) 
      //   }})
    )
  }
  
  routes() {
    this.app.use("/api/v1", routes)
    // errorHandler - tem que ficar depois das rotas para funcionar corretamente
    this.app.use(errorHandler)
  }
}

export default new App().app