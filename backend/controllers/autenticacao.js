import Usuario from '../models/usuario';
import ErrorHandler from '../utils/errorHandler';
import sendToken from '../utils/jwtToken';

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
    .catch(error => res.status(500).json({ erro: 'Erro ao criar o usuário', message: error.message }));

    // getJwtToken - metódo personalizado que criei no model "Usuario" usando o método "methods" (do Mongoose)
    // const token = user.getJwtToken();
    // return res.json({ success: true, user: usuario, token });

    // Criação do token e salvando ele no cookie
    sendToken(user, res)
    
  }

  async login (req, res, next) {
    const { email, senha } = req.body;

    if (!email || !senha) return res.status(400).json({ success: false, erro: 'Insira o e-mail e a senha' });

    // Encontrando o usuário no banco
      // select - indica quais campos devem ser incluídos ou excluidos na consulta. Obs: sinal (-) antes do campo indica para excluir, sem sinal indica para adicionar, com sinal (+) força a incluir mesmo quando no model tem a chave "select: false"
    const user = await Usuario.findOne({ email }).select('+senha')
      .catch(error => res.status(404).json({ success: false, mensagem: 'Usuário não encontrado', erro: error.message }))    

    // Checando a senha criptografada
    const senhaConfirmada = await user.comparePassword(senha)
      .catch(error => res.status(400).json({ sucess: false, mensagem: "Senha inválida", erro: error.message }));

    if (!senhaConfirmada) return res.status(400).json({ erro: "Senha incorreta" });

    // const token = await user.getJwtToken();
    // return res.json({ success: true, usuario: user, token })

    // req.session.variavel - usado para salvar uma variável na sessão e tem acesso a ela em todas as solicitações
    // req.session.user = user;

    // Criação do token e salvando ele no cookie
    sendToken(user, res)
  }

  async logout (req, res, next) {
    // Para deslogar basta passar um valor zerado ao cookie e expirando na mesma hora
    res.cookie('token', null, {
      expires: new Date(Date.now()),
      httpOnly: true
    })

    // usado para excluir todos os elementos que foram salvos na sessão
    // req.session.destroy()
    
    res.json({ success: true, message: 'Usuário deslogado com sucesso.' })
  }
}

export default new Autenticacao();