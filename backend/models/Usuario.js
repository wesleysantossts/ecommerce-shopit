import { Schema, model } from 'mongoose';
import validator from 'validator';

const usuarioSchema = new Schema({
  nome: { type: String, required: [true, 'Insira um nome'], maxlength: [30, 'Seu nome não pode exceder 30 caracteres'] },
  // validator.isEmail - utilizado para verificar se é do tipo "email"
  email: { type: String, required: [true, 'Insira um e-mail'], unique: true, validate: [validator.isEmail, 'Insira um e-mail válido'] },
  senha: { type: String, required: [true, 'Insira uma senha'], minlength: [6, 'A senha não pode ter menos de 6 dígitos'], select: false },
  avatar: {
    public_id: { type: String, required: true },
    url: { type: String, required: true }
  },
  role: { type: String, default: 'usuario' },
  createdAt: { type: Date, default: Date.now },
  resetSenhaToken: String,
  resetSenhaExpirada: Date
})

export default model('usuario', usuarioSchema); 