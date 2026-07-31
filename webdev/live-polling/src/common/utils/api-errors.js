class ApiError extends Error {
  constructor(statusCode, message, data = null) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    this.success = false;
    Error.captureStackTrace(this, this.constructor);
  }

  static badReq(data, msg = 'MISSING- user required details') {
    return new ApiError(401, msg, data);
  }

  static notFound(data, msg = 'NOT FOUND') {
    return new ApiError(404, msg, data);
  }
}

export default ApiError;