import ProdutoModel from '../models/Produto'
import ErrorHandler from '../utils/errorHandler'
import ApiFeatures from '../utils/apiFeatures'

class ProdutoController {
  // Listar produtos
  async index(req, res, next) {
    const resPerPage = 4;

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

  // Listar um produto específico
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
}

export default new ProdutoController()