import jwt from 'jsonwebtoken'
import Usuario from '../models/usuario'

class Autenticacao { 
  // Autenticação para conferir se o usuário tem o token armazenado no cookie antes de logar
  async autenticar (req, res, next) {
    // req.cookies - Usado para pegar os cookies 
    const { token } = req.cookies;

    const tokenFormat = token ? JSON.parse(token).token : null

    if (!tokenFormat) return res.status(401).json({ message: 'Usuário não logado. Faça o login e tente novamente' })

    // .verify(token, secret, opções) - usado para verificar se o token é válido.
      // 2º parametro deve-se passar o secret que tenho armazenado no .env.
    const decode = jwt.verify(JSON.parse(token).token, process.env.JWT_SECRET)
    
    if (decode) {
      // req.nomePropriedadeDesejada - só funciona criar uma propriedade no objeto "requisição" se for feito em algum MIDDLEWARE
      req.user = await Usuario.findById(decode.id)
      next()
    }
  }

  role (...roles) {
    // quando o método precisa ter parametro, deve-se retornar o "(req, res, next)" como uma arrow function e fazer tratamento da requisição dentro dessa arrow function 
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) return res.status(403).json({success: false , message: `Usuário não tem permissão de acesso.`});
      next()
    }
  }
}

export default new Autenticacao()