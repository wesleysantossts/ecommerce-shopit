import { Router } from 'express';
import ProdutoController from './controllers/produto';
import AutenticacaoController from './controllers/autenticacao';
import AutenticacaoMiddleware from './middlewares/autenticacao';
import UsuarioController from './controllers/usuario';
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
routes.post('/senha/recuperar-senha', AutenticacaoController.forgotPassword)
routes.put('/senha/reset/:token', AutenticacaoController.resetPassword)

// Usuário
routes.get('/me', AutenticacaoMiddleware.autenticar, UsuarioController.getUserProfile)
routes.put('/senha/atualizar', AutenticacaoMiddleware.autenticar, UsuarioController.updatePassword)
routes.put('/me/atualizar', AutenticacaoMiddleware.autenticar, UsuarioController.updateProfile)
// Admin
routes.get('/admin/usuarios', AutenticacaoMiddleware.autenticar, AutenticacaoMiddleware.role('admin'), UsuarioController.allUsers)
routes.get('/admin/usuario/:id', AutenticacaoMiddleware.autenticar, AutenticacaoMiddleware.role('admin'), UsuarioController.getUserDetails)
routes.put('/admin/usuario/:id', AutenticacaoMiddleware.autenticar, AutenticacaoMiddleware.role('admin'), UsuarioController.updateUserProfile)
routes.delete('/admin/usuario/:id', AutenticacaoMiddleware.autenticar, AutenticacaoMiddleware.role('admin'), UsuarioController.deleteUser)

export default routes;