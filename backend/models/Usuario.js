import { Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// usado para criptografar o token de reset da senha
import crypto from 'crypto'

const usuarioSchema = new Schema({
  nome: { type: String, required: [true, 'Insira um nome'], maxlength: [30, 'Seu nome não pode exceder 30 caracteres'] },
  // validator.isEmail - utilizado para verificar se é do tipo "email"
  email: { type: String, required: [true, 'Insira um e-mail'], unique: true, validate: [validator.isEmail, 'Insira um e-mail válido'] },
  // select: false - usado para não mostrar a chave na consulta (quando false). O padrão é true. 
    // Para retornar/mostrar na consulta deve-se usar o método ".select('+chave')" 
  senha: { type: String, required: [true, 'Insira uma senha'], minlength: [6, 'A senha não pode ter menos de 6 dígitos'], select: false },
  avatar: {
    public_id: { type: String, required: true },
    url: { type: String, required: true }
  },
  role: { type: String, default: 'usuario' },
  createdAt: { type: Date, default: Date.now },
  resetSenhaToken: { type: String },
  resetSenhaExpirada: { type: Date }
});

// Encriptando a senha antes de salvar no banco
  // pre - usado para realizar alguma ação antes de um evento. A função do segundo parâmentro não pode ser em forma de arrow function, se for não funciona.
usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) next();

  this.senha = await bcrypt.hash(this.senha, 10);
});

// Retornar o token JWT
  // methods - permite criar um método personalizado (instanciar um método). Posso usar esse método depois em qualquer lugar da aplicação quando eu puxar o model "Usuario" No caso abaixo, foi criado o "getJwtToken" para pegar o token do usuário após o usuário ser criado.  
usuarioSchema.methods.getJwtToken = () => {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_TIME })
};

// Comparar a senha inserida no login com a senha criptografada
  // bcrypt - usado para comparar a senha digitada com a criptografada. É uma solicitação assincrona.
    // Primeiro parametro é a senha digitada, segundo parametro é o hash (que codifiquei ao criar o usuario).
    // A função por ser assíncrona não pode ser em forma de arrow function, se for não funciona.
usuarioSchema.methods.comparePassword = async function (senha) {
  return await bcrypt.compare(senha, this.senha)
}

// Criando o token de reset da senha
usuarioSchema.methods.getResetPasswordToken = function () {
  // Gerar o token
    // randomBytes - gera uma criptografia de bytes com a largura do valor passado no argumento
    // toString(encode) - transforma em string de acordo com o encode passado no argumento
  const resetToken = crypto.randomBytes(20).toString('hex')

  // Hash e armazenar o resetPasswordToken
    // createHash(algoritmo) - cria um hash no formato do algoritmo que é passado no parametro
    // digest(encode) - calcula a "digestão" do hash no formato do encode que é passado no parametro
  this.resetSenhaToken = crypto.createHash('sha256').update(resetToken).digest('hex')

  // Setar o tempo limite para resetar a senha
  this.resetSenhaExpirada = Date.now() + 30 * 60 * 1000 // 30 minutos para atualizar a senha

  return resetToken
}

export default model('usuario', usuarioSchema);
