import Usuario from '../models/usuario'
import sendToken from '../utils/jwtToken'

class UsuarioController {
  // Listar o usuário logado atual
  async getUserProfile (req, res, next) {
    const usuario = await Usuario.findById(req.user._id)

    return res.json({
      success: true,
      usuario
    })
  }

  // Atualizar senha do usuário logado
  async updatePassword (req, res, next) {
    const usuario = await Usuario.findById(req.user._id).select('+senha') // deve-se colocar o "select('+senha')" para adicionar o atributo da senha na resposta da consulta
    
    const isMatched = await usuario.comparePassword(req.body.senhaAntiga)

    if (!isMatched) return res.status(400).json({ success: false, message: 'Senha antiga incorreta' })

    usuario.senha = req.body.novaSenha

    await usuario.save()

    sendToken(usuario, 200, res)
  }

  // Atualizar perfil do usuário logado
  async updateProfile (req, res, next) {
    const novosDados = {
      nome: req.body.nome,
      email: req.body.email
    }

    // Updata avatar - a fazer nas próximas aulas

    const usuario = await Usuario.findByIdAndUpdate(req.user._id, novosDados, {
      new: true,
      // rodar os validadores
      runValidators: true,
      // usado para desabilitar uma função depreciada do mongo que é a "findAndModify()"
      useFindAndModify: false
    })

    if (!usuario) return res.status(404).json({ success: false, message: 'Usuário não encontrado' })

    return res.json({ success: true, user: usuario })
  }

  // Admin
  // Listar todos os usuários
  async allUsers (req, res, next) {
    // .find() - usado para encontrar todos os dados do banco, sem where
    const users = await Usuario.find()

    return res.json({
      success: true,
      users
    })
  }

  // Listar um usuário pelo id
  async getUserDetails (req, res, next) {
    const { id } = req.params

    const user = await Usuario.findById(id)

    if (!user) return res.status(404).json({ success: false, message: 'Usuário não encontrado' })

    return res.json({
      success: true,
      user
    })
  }

  // Atualizar um usuario
  async updateUserProfile (req, res, next) {
    const novosDados = {
      nome: req.body.nome,
      email: req.body.email,
      role: req.body.role
    }

    // Updata avatar - a fazer nas próximas aulas

    const usuario = await Usuario.findByIdAndUpdate(req.params.id, novosDados, {
      new: true,
      // rodar os validadores
      runValidators: true,
      // usado para desabilitar uma função depreciada do mongo que é a "findAndModify()"
      useFindAndModify: false
    })

    if (!usuario) return res.status(404).json({ success: false, message: 'Usuário não encontrado' })

    return res.json({ success: true, user: usuario })
  }

  // Deletar um usuário
  async deleteUser (req, res, next) {
    const usuario = await Usuario.findById(req.params.id)

    if (!usuario) return res.status(404).json({ success: false, message: 'Usuário não encontrado' })

    // Criar a lógica para remover as imagens do banco nas próximas aulas

    await usuario.remove()

    return res.json({
      success: true,
      message: "Usuário removido com sucesso"
    })
  }
}

export default new UsuarioController()