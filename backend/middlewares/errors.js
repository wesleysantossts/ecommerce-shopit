import ErrorHandler from '../utils/errorHandler';

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Erro interno no servidor.";

  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
      error: err
    })
  }

  if (process.env.NODE_ENV === 'PRODUCTION') {
    let error = { ...err };

    error.message = err.message;

    // Erro de busca por ID do Mongoose.
    if (err.name == 'CastError') {
      const message = `Busca não encontrada. Inválido: ${err.path}`;
      error = new ErrorHandler(message, 400);
    }

    // Erro de validação do Mongoose.
    if (err.name == 'ValidationError') {
      const message = Object.values(err.errors).map(value => value.message);
      error = new ErrorHandler(message, 400);
    }

    // Erro de chaves duplicadas do Mongoose - quando a chave não pode ter mais de 1 valor igual
    if (err.name == 11000) {
      const message = `O valor da chave ${Object.keys(err.keyValue)} já existe no banco de dados`
      error = new ErrorHandler(message, 400)
    }

    // Erro do JWT errado
    if (err.name === 'JsonWebTokenError') {
      const message = 'O Json Web Token está inválido. Tente novamente!'
      error = new ErrorHandler(message, 400)
    }
    
    // Erro do token JWT expirado
    if (err.name === 'TokenExpiredError') {
      const message = 'O Json Web Token está expirado. Tente novamente!'
      error = new ErrorHandler(message, 400)
    }

    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    })
  }
}