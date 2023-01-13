import Pedido from '../models/pedido';
import Produto from '../models/Produto';
import ErrorHandler from '../utils/errorHandler';

class PedidoController {
  // Criar um novo pedido
  async novoPedido (req, res, next) {
    const { 
      pedidoItens,
      envioInfo,
      precoItens,
      precoTaxa,
      precoEnvio,
      precoTotal,
      pagamentoInfo
    } = req.body

    const pedido = await Pedido.create({
      pedidoItens,
      envioInfo,
      precoItens,
      precoTaxa,
      precoEnvio,
      precoTotal,
      pagamentoInfo,
      pagoEm: new Date(Date.now()),
      usuario: req.user._id
    })
    
    // ErroHandler(mensagem, statusCode) - para funcionar tem que colocar ele dentro do "next()" do Express 
    if (!pedido) return next(new ErrorHandler('Erro ao criar o pedido', 400))
    
    return res.json({ success: true, message: 'Pedido criado com sucesso', pedido })
  }
  
  // Listar um pedido pelo ID
  async meuPedido (req, res, next) {
    // populate(caminho, select, model) - usado para preencher essa propriedade (caminho) passada no 1º parametro com os dados contidos nas propriedas informadas no "select" do 2º parametro, que pertencem ao model do 3º parametro
      // isso não altera o documento no banco, só retorna a consulta com mais dados retirados de outro model
    const pedido = await Pedido.findById(req.params.id).populate('usuario', 'nome email', 'usuario')
    
    if (!pedido) return next(new ErrorHandler('Nenhum pedido foi encontrado com esse ID', 404))
    
    return res.json({ success: true, pedido })
  }
  
  // ADMIN - Listar todos os pedido
  async pedidos (req, res, next) {
    const pedidos = await Pedido.find()
    
    let valorTotal = 0
    pedidos.forEach(pedido => valorTotal += pedido.precoTotal)
    
    if (!pedidos) return next(new ErrorHandler('Nenhum pedido foi encontrado com esse ID', 404))
    
    return res.json({ success: true, valorTotal: Number(valorTotal.toFixed(2)), pedidos: pedidos.sort((a, b) => a.criadoEm < b.criadoEm ? 1 : -1) })
  }

  // ADMIN - Atualizar pedido
  async atualizarPedido (req, res, next) {
    const pedido = await Pedido.findById(req.params.id)

    if (!pedido) return next(new ErrorHandler('Pedido não encontrado pelo ID', 404))
    if (pedido.pedidoStatus === 'Entregue') return next(new ErrorHandler('O pedido já foi entregue', 400))
    
    pedido.pedidoItens.forEach(async item => await atualizarEstoque(item.produto, item.quantidade, res))

    pedido.pedidoStatus = req.body.status
    pedido.entregueEm = new Date(Date.now())

    await pedido.save()
    return res.json({ success: true, message: 'Status do pedido atualizado com sucesso' })
  }

  // ADMIN - Deletar pedido
  async deletarPedido (req, res, next) {
    const pedido = await Pedido.findById(req.params.id)
    
    if (!pedido) return next(new ErrorHandler('Nenhum pedido foi encontrado com esse ID', 404))

    await pedido.remove()
    
    return res.json({ success: true, message: 'Pedido removido com sucesso' })
  } 
}

async function atualizarEstoque (id, quantidade, res) {
  const produto = await Produto.findById(id)
  
  if (!produto) return res.status(404).json({ success: false, message: 'Produto não encontrado no estoque' })

  produto.estoque = produto.estoque - quantidade

  await produto.save()
}

export default new PedidoController()