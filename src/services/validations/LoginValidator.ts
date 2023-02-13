import { Request } from "express";
import Joi from "joi";
import { ApiError } from "../../middlewares/errorHandler/ApiErrors";

function loginValidator(req: Request) {
  const schema = Joi.object({
    email: Joi.string().email().min(2).max(254).trim().required().messages({
      "string.email": "Email is required and needs to be in the correct format",
      "string.empty": "Email is required",
    }),
    password: Joi.string().min(8).max(32).trim().required().messages({
      "string.min": "Password must be at least 8 characters long",
      "string.empty": "Password is required",
    }),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    throw new ApiError(validation.error.message, 400);
  }
}

export { loginValidator };
