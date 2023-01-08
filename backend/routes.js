import { Router } from 'express';
import ProdutoController from './controllers/produto';
import AutenticacaoController from './controllers/autenticacao';
import AutenticacaoMiddleware from './middlewares/autenticacao';
const routes = new Router();

// Produto
routes.get('/produtos', AutenticacaoMiddleware.autenticar, AutenticacaoMiddleware.role('admin'), ProdutoController.index);
routes.get('/produto/:id', AutenticacaoMiddleware.autenticar, ProdutoController.show);
routes.post('/produto/novo', AutenticacaoMiddleware.autenticar, AutenticacaoMiddleware.role('admin'), ProdutoController.store);
routes.put('/produto/atualizar', AutenticacaoMiddleware.autenticar, ProdutoController.update);
routes.delete('/produto', AutenticacaoMiddleware.autenticar, ProdutoController.delete);

// Autenticação
// Criar um usuário
routes.post('/register', AutenticacaoController.registerUser);
routes.post('/login', AutenticacaoController.login);
routes.get('/logout', AutenticacaoMiddleware.autenticar, AutenticacaoController.logout);

export default routes;