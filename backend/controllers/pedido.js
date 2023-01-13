import Pedido from '../models/pedido';
import ErrorHandler from '../utils/errorHandler';

class PedidoController {
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

    // if (!pedido) return res.status(400).json({ success: false, message: 'Erro ao criar o pedido' })
    if (!pedido) return new ErrorHandler('Erro ao criar o pedido', 400)
  
    return res.json({ success: true, message: 'Pedido criado com sucesso', pedido })
  }
}

export default new PedidoController()