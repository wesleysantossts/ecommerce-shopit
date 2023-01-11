import mongoose, { Schema, model } from 'mongoose';

const Produto = new Schema({
  nome: {
    type: String,
    required: [true, 'Insira um nome para o produto'],
    trim: true,
    maxLength: [100, 'Nome do produto não pode ser maior do que 100 caracteres']
  },
  preco: {
    type: Number,
    required: [true, 'Insira um preço para o produto'],
    maxLength: [5, 'Preço do produto não pode ser maior do que 5 caracteres'],
    default: 0.0,
  },
  descricao: {
    type: String,
    required: [true, 'Insira uma descrição para o produto'],
  },
  avaliacaoNota: {
    type: Number,
    default: 0,
  },
  imagens: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    }
  ],
  categoria: {
    type: String,
    required: [true, 'Selecione uma categoria'],
    enum: {
      values: [
        'Eletrônicos',
        'Câmeras',
        'Laptop',
        'Fones de ouvido',
        'Comida',
        'Livros',
        'Roupas/Sapatos',
        'Beleza/Saúde',
        'Esportes',
        'Outdoor',
        'Casa',
      ],
      mensagem: 'Selecione a categoria do produto'
    }
  },
  vendedor: {
    type: String,
    required: [true, 'Insira o vendedor do produto']
  },
  estoque: {
    type: Number,
    required: [true, 'Insira o estoque do produto'],
    maxLength: [5, 'O valor do estoque não pode ser superior a 5 dígitos'],
    default: 0
  },
  quantidadeReviews: {
    type: Number,
    dafault: 0
  },
  avaliacao: [
    {
      nome: {
        type: String,
        required: true,
      },
      nota: {
        type: Number,
        required: true,
      },
      comentario: {
        type: String,
        required: true,
      },
    }
  ],
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  criadoEm: {
    type: Date,
    default: Date.now
  }
})

export default model('Produto', Produto)