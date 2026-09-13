class ServerError extends Error {
  constructor(message, about, status) {
    super(message);
    this.status = status;
    this.about = about;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ServerError;
