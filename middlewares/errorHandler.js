import Joi from "joi";
import CustomErrorHandler from "../service/customErrorHandler.js";
const ValidationError = Joi.ValidationError;

const errorHandler = async (err, req, res, next) => {
  let statusCode = 500;
  let data = {
    message: "Internal server error",
    originalError: err.message,
  };

  if (err instanceof ValidationError) {
    (statusCode = 422),
      (data = {
        message: err.message,
      });
  }

  if (err instanceof CustomErrorHandler) {
    (statusCode = err.statusCode),
      (data = {
        message: err.message,
      });
  }

  return res.status(statusCode).json(data);
};

export default errorHandler;
