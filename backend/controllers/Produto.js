import ProdutoModel from '../models/Produto'
import ErrorHandler from '../utils/errorHandler'
import ApiFeatures from '../utils/apiFeatures'

class ProdutoController {
  // Listar produtos
  async index(req, res, next) {
    const resPerPage = 8;

    const apiFeatures = new ApiFeatures(ProdutoModel, req.query)
      .search()
      .filter()
      .pagination(resPerPage);

    // find() - listar todos os produtos
    // const produtos = await ProdutoModel.find()
    const produtos = await apiFeatures.query;

    if (produtos.length === 0) return res.status(404).json("Produtos não encontrados.")
    
    return res.json({
      success: true,
      quantidade: produtos.length,
      produtos 
    })
  }

  // Listar um produto pelo id
  async show(req, res, next) {
    const { id } = req.params;

    if (!id) return res.status(400).json({ success: false, message: "Insira um ID" });
    
    // findById() - busca do produto pelo ID
    const produto = await ProdutoModel.findById(id)
    
    if (!produto) return next(new ErrorHandler("Produto não encontrado pelo ID", 400))

    return res.json({ success: true, produto })
  }

  // Criar um produto
  async store(req, res) {
    const body = req.body.map(item => ({
      ...item,
      usuario: req.user._id
    }))

    const produto = await ProdutoModel.create(body)
      .catch(err => res.status(404).json({ success: false, message: err.message }));

    return res.status(200).json({
      message: 'Produto criado com sucesso',
      produto
    })
  }

  // Atualizar um produto pelo id
  async update(req, res) {
    const { id } = req.body;
    
    if (!id) return res.status(400).json({ message: "Insira um ID" });
    
    const update = req.body;
    delete update.id;
    
    // findOneAndUpdate(conditions, update, options) - encontrar pela condição e atualizar
      // new: true - retorna na chamada o doc atualizado (padrão é false - que retorna o doc sem atualização)
    const produto = await ProdutoModel.findOneAndUpdate({ id: id }, update, { new: true })
      .catch(err => res.status(500).json({ success: false, message: err.message }));
      
    return res.json({ message: "Produto atualizado com sucesso.", produto })
  }
  
  // Deletar um produto
  async delete(req, res) {
    const { id } = req.body;
    
    if (!id) return res.status(500).json({ message: "Envie um ID" });
    
    const produto = await ProdutoModel.findById(id)
      .catch(err => res.status(500).json({ success: false, message: err.message }));

    await produto.remove()

    return res.json({ message: "Produto removido com sucesso." })
  }

  // Criar um review
  async createReviewProduct (req, res, next) {
    const { nota, comentario, idProduto } = req.body

    const avaliacao = {
      usuario: req.user._id,
      nome: req.user.nome,
      nota: Number(nota),
      comentario
    }

    const produto = await ProdutoModel.findById(idProduto)

    // toString() - precisa colocar o toString() para poder transformar o formato "ObjectId()" do objeto em uma string para fazer a comparação
    const isReviewed = produto.avaliacao.find(item => item.usuario ? item.usuario.toString() === req.user._id.toString() : undefined)

    if (isReviewed) {
      produto.avaliacao.forEach(r => {
        if (r.usuario && r.usuario.toString() === req.user._id.toString()) {
          r.comentario = comentario
          r.nota = nota
        }
      })
    } else {
      produto.avaliacao.push(avaliacao)
      produto.quantidadeReviews = produto.avaliacao.length
    }

    produto.avaliacaoNota = produto.avaliacao.reduce((acc, item) => item.nota + acc, 0) / produto.avaliacao.length
  
    // validateBeforeSave - usado para validar ou não o campo antes de salvar no banco
    await produto.save({ validateBeforeSave: false })
    return res.json({ success: true })
  }

  // Pegar todos os reviews => /produto/avaliacoes/:id
  async getProductReview (req, res, next) {
    const { id } = req.params

    const produto = await ProdutoModel.findById(id)

    if (!produto) return next(new ErrorHandler('Produto não encontrado pelo ID', 404))

    return res.json({
      success: true,
      avaliacoes: produto.avaliacao
    })
  }

  // Deletar review => /produto/avaliacao?id=2134564313
  async deleteReview (req, res, next) {
    const { produtoId, id } = req.query

    let produto = await ProdutoModel.findById(produtoId)

    if (!produto) return next(new ErrorHandler('Produto não encontrado pelo ID', 404))

    const avaliacao = produto.avaliacao.filter(item => item._id.toString() !== id.toString())

    const quantidadeReviews = avaliacao.length

    const nota = produto.avaliacao.reduce((acc, item) => item.nota + acc, 0) / quantidadeReviews

    produto = await ProdutoModel.findByIdAndUpdate(produtoId, {
      avaliacao,
      nota,
      quantidadeReviews
    }, {
      // new - retorna o registro criado/atualizado. Por padrão, este método retorna o registro antes da atualização
      new: true,
      // runValidators - usado para realizar a operação desativando a validação das propriedades. Por exemplo, se tiver alguma propriedade que não foi inserida depois de uma atualização do Model, ele não vai gerar um erro, vai realizar a operação se aqui estiver "false". Se "true", vai travar a aplicação porque vai gerar um erro que tem uma propriedade faltando OU se tiver uma de um tipo diferente 
      runValidators: false,
      useFindAndModify: false
    })

    return res.json({
      success: true,
      avaliacoes: produto.avaliacao
    })
  }
}

export default new ProdutoController()