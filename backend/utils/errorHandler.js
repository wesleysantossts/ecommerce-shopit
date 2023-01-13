// Para funcionar, quando instanciar deve-se colocar ele dentro do "next()" do Express
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor)
  }
}

export default ErrorHandler;