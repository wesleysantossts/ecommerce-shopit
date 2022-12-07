import ProdutoModel from '../models/Produto'
import ErrorHandler from '../utils/errorHandler'
import ApiFeatures from '../utils/apiFeatures'

class ProdutoController {
  async index(req, res, next) {
    const apiFeatures = new ApiFeatures(ProdutoModel, req.query)
      .search();

    // find() - listar todos os produtos
    // const produtos = await ProdutoModel.find()
    const produtos = await apiFeatures.query;
    console.log("🚀 ~ file: Produto.js:13 ~ ProdutoController ~ index ~ produtos", produtos)

    if (produtos.length === 0) return res.status(404).json("Produtos não encontrados.")
    
    return res.json({
      success: true,
      quantidade: produtos.length,
      produtos 
    })
  }

  async show(req, res, next) {
    const { id } = req.params;

    if (!id) return res.status(400).json({ success: false, message: "Insira um ID" });
    
    // findById() - busca do produto pelo ID
    const produto = await ProdutoModel.findById(id)
    
    if (!produto) return next(new ErrorHandler("Produto não encontrado pelo ID", 400))

    return res.json({ success: true, produto })
  }

  async store(req, res) {
    const produto = await ProdutoModel.create(req.body)
      .catch(err => res.status(404).json({ success: false, message: err.message }));

    return res.status(200).json({
      message: 'Produto criado com sucesso',
      produto
    })
  }

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