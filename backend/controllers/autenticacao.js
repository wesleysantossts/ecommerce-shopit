import Usuario from '../models/usuario';
import ErrorHandler from '../utils/errorHandler';
import sendToken from '../utils/jwtToken';
import Email from '../utils/sendEmail';
import crypto from 'crypto';

class Autenticacao {
  async registerUser (req, res, next) {
    const { nome, email, senha } = req.body;

    const user = await Usuario.create({
      nome,
      email,
      senha,
      avatar: {
        public_id: 'avatar/id1',
        url: 'https://avatars.githubusercontent.com/u/56703526?v=4'
      }
    })
      .catch(error => {
        if (error.code == 11000) return res.status(400).json({ erro: 'Este e-mail já está em uso', message: error.message, error }) 
        return res.status(400).json({ erro: 'Erro ao criar o usuário', message: error.message, error })
      });

    // getJwtToken - metódo personalizado que criei no model "Usuario" usando o método "methods" (do Mongoose)
    // const token = user.getJwtToken();
    // return res.json({ success: true, user: usuario, token });

    // Criação do token e salvando ele no cookie
    if (user?.outputSize !== 0) sendToken(user, 200, res)
  }

  async login (req, res, next) {
    const { email, senha } = req.body;

    if (!email || !senha) return res.status(400).json({ success: false, erro: 'Insira o e-mail e a senha' });

    // Encontrando o usuário no banco
      // select - indica quais campos devem ser incluídos ou excluidos na consulta. Obs: sinal (-) antes do campo indica para excluir, sem sinal indica para adicionar, com sinal (+) força a incluir mesmo quando no model tem a chave "select: false"
    const user = await Usuario.findOne({ email }).select('+senha')
      .catch(error => res.status(404).json({ success: false, mensagem: 'Usuário não encontrado', erro: error.message }))    

    if (!user) return res.json({ success: false, message: 'Usuário não encontrado' })

    // Checando a senha criptografada
    const senhaConfirmada = await user.comparePassword(senha)
      .catch(error => res.status(400).json({ sucess: false, mensagem: "Senha inválida", erro: error.message }));
      
    if (!senhaConfirmada) return res.status(400).json({ success: false, message: "Senha incorreta" });

    // const token = await user.getJwtToken();
    // return res.json({ success: true, usuario: user, token })

    // req.session.variavel - usado para salvar uma variável na sessão e tem acesso a ela em todas as solicitações
    // req.session.user = user;

    // Criação do token e salvando ele no cookie
    sendToken(user, 200, res)
  }

  async logout (req, res, next) {
    // Para deslogar basta passar um valor zerado ao cookie e expirando na mesma hora
    res.cookie('token', null, {
      expires: new Date(Date.now()),
      httpOnly: true
    })

    // usado para excluir todos os elementos que foram salvos na sessão
    // req.session.destroy()
    
    return res.json({ success: true, message: 'Usuário deslogado com sucesso.' })
  }

  // Recuperação de senha
  async forgotPassword (req, res, next) {
    const user = await Usuario.findOne({ where: { email: req.body.email }})

    if (!user) return res.status(404).json({ erro: 'Usuário não cadastrado' })

    // pegando o token da função que criei diretamente no model
    const resetToken = user.getResetPasswordToken()

    // tirando a opção de validar antes de salvar
    await user.save({ validateBeforeSave: false })

    // Criando a url de recuperação de senha
      // req.protocol - pega o protocolo http do site
      // req.get('host') - pega o dominio do site
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/senha/reset/${resetToken}`

    const message = `Seu token de recuperação de senha é o seguinte:\n\n${resetUrl}\n\nSe você não solicitou esse e-mail, ignore ele.`
    
    await Email.sendEmail({
      email: user.email,
      subject: `ShopIt - Recuperação de Senha`,
      message
    })
    .catch(error => {
      console.log('Erro no envio do email pelo método "Send Email"', error)
      user.resetSenhaToken = undefined
      user.resetSenhaExpirada = undefined

      user.save({ validateBeforeSave: false })
    })

    return res.json({ success: true, message: `Email enviado a: ${user.email}`})
  }

  async resetPassword (req, res, next) {
    const { token } = req.params
    const { senha, confirmarSenha } = req.body

    // Hash URL token
    const resetSenhaToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await Usuario.findOne({ resetSenhaToken, resetSenhaExpirada: { $gt: Date.now() } })
      .catch(error => res.status(404).json({ success: false, message: 'Token de recuperação inválido ou expirado', error: error.message }))

    if (senha && confirmarSenha && senha !== confirmarSenha) return res.status(400).json({ success: false, message: 'Senha não corresponde a confirmação de senha' })

    user.senha = senha
    // quando coloca "undefined" como valor de um campo do banco no mongoose, lá no banco esse campo não aparece. Se colocar "null", esse campo vai aparecer no banco com o valor "null" 
    user.resetSenhaToken = undefined
    user.resetSenhaExpirada = undefined

    await user.save()
      .catch(error => res.status(400).json({ success: false, message: 'Erro ao salvar a senha', error: error.message }))

    sendToken(user, 200, res)
  }
}

export default new Autenticacao();