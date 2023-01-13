import { Schema, model } from 'mongoose'

const PedidoSchema = new Schema({
  envioInfo: {
    endereco: { type: String, required: true },
    cidade: { type: String, required: true },
    cep: { type: String, required: true },
    pais: { type: String, required: true },
    telefone: { type: String, required: true }
  },
  usuario: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Usuario'
  },
  pedidoItens: [
    {
      nome: { type: String, required: true },
      quantidade: { type: Number, required: true },
      imagem: { type: String, required: true },
      preco: { type: Number, required: true },
      produto: { type: String, required: true }
    }
  ],
  pagamentoInfo: {
    id: { type: String },
    status: { type: String }
  },
  pagoEm: { type: Date },
  precoItens: { type: Number, required: true, default: 0.0 },
  precoTaxa: { type: Number, required: true, default: 0.0 },
  precoEnvio: { type: Number, required: true, default: 0.0 },
  precoTotal: { type: Number, required: true, default: 0.0 },
  pedidoStatus: { type: String, required: true, default: 'Processando' },
  entregueEm: { type: Date },
  criadoEm: { type: Date, default: Date.now }
})

export default model('Pedido', PedidoSchema)