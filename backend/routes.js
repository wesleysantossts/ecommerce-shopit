import { Router } from 'express';
import ProdutoController from './controllers/Produto';
const routes = new Router();

// Produto
routes.get('/produtos', ProdutoController.index);
routes.get('/produto/:id', ProdutoController.show);
routes.post('/produto/novo', ProdutoController.store);
routes.put('/produto/atualizar', ProdutoController.update);
routes.delete('/produto', ProdutoController.delete);

export default routes;