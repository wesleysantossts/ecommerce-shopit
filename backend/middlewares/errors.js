import ErrorHandler from '../utils/errorHandler';

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Erro interno no servidor.";

  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    return res.status(err.statusCode).json({
      success: false,
      error: err,
      message: err.message,
      stack: err.stack
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

    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    })
  }
}