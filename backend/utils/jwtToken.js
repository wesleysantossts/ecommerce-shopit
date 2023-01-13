// Criando e envio do token e salvamento dele em cookie
const sendToken = async (usuario, status, res) => {
  const token = await usuario.getJwtToken()

  // Opções do cookie
  const options ={
    // expires - usado para definir o tempo que o cookie ficará válido
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
    // httpOnly - quando true, impede que os cookies fiquem acessiveis para a API Javascript, somente para o servidor. Evita que scripts maliciosos retirem a identidade de sessão do usuário.
    httpOnly: true
  }

  const data = JSON.stringify({
    token
  })

  // res.cookie(nomeDesejado, token, opções) - usado para armazenar informações do usuário no cookie
  // return res.status(200).cookie('token', token, options).json({
  return res.status(status).cookie('token', data, options).json({
    success: true,
    token,
    usuario
  })
}

export default sendToken