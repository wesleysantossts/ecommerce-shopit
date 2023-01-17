import { Router } from 'express';
import ProdutoController from './controllers/produto';
import AutenticacaoController from './controllers/autenticacao';
import AutenticacaoMiddleware from './middlewares/autenticacao';
import UsuarioController from './controllers/usuario';
import PedidoController from './controllers/pedido';
const routes = new Router();

// Produto
routes.get('/produtos', AutenticacaoMiddleware.autenticar, AutenticacaoMiddleware.role('admin'), ProdutoController.index);
routes.get('/produto/:id', AutenticacaoMiddleware.autenticar, ProdutoController.show);
routes.post('/produto/novo', AutenticacaoMiddleware.autenticar, AutenticacaoMiddleware.role('admin'), ProdutoController.store);
routes.put('/produto/atualizar', AutenticacaoMiddleware.autenticar, ProdutoController.update);
routes.delete('/produto', AutenticacaoMiddleware.autenticar, ProdutoController.delete);
// Reviews
routes.get('/produto/avaliacoes/:id', AutenticacaoMiddleware.autenticar, ProdutoController.getProductReview);
routes.put('/produto/avaliacao', AutenticacaoMiddleware.autenticar, ProdutoController.createReviewProduct);
routes.delete('/produto/avaliacao', AutenticacaoMiddleware.autenticar, ProdutoController.deleteReview);

// Autenticação
routes.post('/register', AutenticacaoController.registerUser);
routes.post('/login', AutenticacaoController.login);
routes.get('/logout', AutenticacaoMiddleware.autenticar, AutenticacaoController.logout);
routes.post('/senha/recuperar-senha', AutenticacaoController.forgotPassword);
routes.put('/senha/reset/:token', AutenticacaoController.resetPassword);

// Usuário
routes.get('/me', AutenticacaoMiddleware.autenticar, UsuarioController.getUserProfile);
routes.put('/senha/atualizar', AutenticacaoMiddleware.autenticar, UsuarioController.updatePassword);
routes.put('/me/atualizar', AutenticacaoMiddleware.autenticar, UsuarioController.updateProfile);
// Admin
routes.get('/admin/usuarios', AutenticacaoMiddleware.autenticar, AutenticacaoMiddleware.role('admin'), UsuarioController.allUsers);
routes.get('/admin/usuario/:id', AutenticacaoMiddleware.autenticar, AutenticacaoMiddleware.role('admin'), UsuarioController.getUserDetails);
routes.put('/admin/usuario/:id', AutenticacaoMiddleware.autenticar, AutenticacaoMiddleware.role('admin'), UsuarioController.updateUserProfile);
routes.delete('/admin/usuario/:id', AutenticacaoMiddleware.autenticar, AutenticacaoMiddleware.role('admin'), UsuarioController.deleteUser);

// Pedido
routes.post('/pedido/novo', AutenticacaoMiddleware.autenticar, PedidoController.novoPedido);
routes.get('/pedido/me/:id', AutenticacaoMiddleware.autenticar, PedidoController.meuPedido);
routes.get('/admin/pedidos', AutenticacaoMiddleware.autenticar, AutenticacaoMiddleware.role('admin'), PedidoController.pedidos);
routes.put('/admin/pedido/:id', AutenticacaoMiddleware.autenticar, AutenticacaoMiddleware.role('admin'), PedidoController.atualizarPedido);
routes.delete('/admin/pedido/deletar/:id', AutenticacaoMiddleware.autenticar, AutenticacaoMiddleware.role('admin'), PedidoController.deletarPedido);

export default routes;