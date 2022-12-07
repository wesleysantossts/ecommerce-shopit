import app from './app'
const PORT = process.env.PORT 
const NODE_ENV = process.env.NODE_ENV 

// Deve ficar no topo do arquivo. Tratamento do erro "uncaught exception". Gerado quando tem alguma variável chamada não foi criada (exemplo: dar console.log em uma variavel que não existe).
process.on('uncaughtException', err => {
  console.log(`MENSAGEM DE ERRO: ${err.message}`)
  console.log(`ERRO: ${err.stack}`)
  process.exit(1)
})

const server = app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT} em modo ${NODE_ENV}`))

// Tratamento do erro de conexão "unhandledRejection". Caso o link no dotenv de conexão com o banco esteja incorreto.
process.on('unhandledRejection', err => {
  console.log(`ERRO: ${err.message}`)
  console.log(`Erro ao conectar ao servidor. Corrija e tente novamente.`)
  server.close(() => process.exit(1))
})