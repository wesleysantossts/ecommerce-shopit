import Usuario from '../models/usuario'

class UsuarioController {
  // Pegar o usuário logado atual
  async getUserProfile (req, res, next) {
    const { token } = req.cookies
    const { user } = JSON.parse(token)
    
    const usuario = await Usuario.findById(user._id)

    return res.json({
      success: true,
      usuario
    })
  }
}

export default new UsuarioController()