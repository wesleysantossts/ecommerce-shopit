import Produto from '../models/Produto';
import produtos from '../data/produtos.json';
import connectDatabase from '../config/database';

connectDatabase();

const seederProdutos = async () => {
  await Produto.deleteMany()
    .catch(error => {
      console.log("Erro ao tentar deletar vários produtos.")
      process.exit()
    })
  console.log('Produtos deletados com sucesso')
    
  // inserir vários produtos ao mesmo tempo no banco
  await Produto.insertMany(produtos)
    .catch(error => {
      console.log("Erro ao tentar inserir os produtos padrão")
      process.exit()
    })
  console.log('Produtos inseridos com sucesso')
  process.exit()
};

seederProdutos();