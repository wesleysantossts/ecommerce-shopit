// Criando e envio do token e salvamento dele em cookie
const sendToken = async (usuario, res) => {
  const token = await usuario.getJwtToken()

  // Opções do cookie
  const options ={
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
    // ? para que serve o httpOnly
    httpOnly: true
  }

  return res.status(200).cookie('token', token, options).json({
    success: true,
    token,
    usuario
  })
}

export default sendToken