import ApiError from "../utils/ApiError.js";

export const error = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.message = error.message || "Internal server Error";

  //Some field validation is missing
  if (error.name === "ValidationError") {
    error = new ApiError(error.message, 400, error.stack); // can give cutomize message
  }

  // wrong mongodb id error
  if (error.name === "CastError") {
    const message = `Resources not found with this id.. Invalid ${error.path}`;
    error = new ApiError(message, 400);
  }

  // Duplicate key error
  if (error.code === 11000) {
    const message = `Duplicate key '${Object.keys(error.keyValue)}' Entered`;
    error = new ApiError(message, 400);
  }

  // wrong jwt error
  if (error.name === "JsonWebTokenError") {
    const message = `Your url is invalid please try again letter`;
    error = new ApiError(message, 400);
  }

  // jwt expired
  if (error.name === "TokenExpiredError") {
    const message = `Your Url is expired please try again letter!`;
    error = new ApiError(message, 400);
  }
  
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
};
