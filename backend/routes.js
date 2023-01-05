import { Router } from 'express';
import ProdutoController from './controllers/produto';
import AutenticacaoController from './controllers/autenticacao';
const routes = new Router();

// Produto
routes.get('/produtos', ProdutoController.index);
routes.get('/produto/:id', ProdutoController.show);
routes.post('/produto/novo', ProdutoController.store);
routes.put('/produto/atualizar', ProdutoController.update);
routes.delete('/produto', ProdutoController.delete);

// Autenticação
routes.post('/register', AutenticacaoController.registerUser)
routes.post('/login', AutenticacaoController.login)

export default routes;