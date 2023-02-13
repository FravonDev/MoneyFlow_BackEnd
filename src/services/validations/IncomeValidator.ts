import { Request } from "express";
import Joi from "joi";
import { ApiError } from "../../middlewares/errorHandler/ApiErrors";

function incomeValidator(req: Request) {
  const userSchema = Joi.object({
    id: Joi.number().required(),
    iat: Joi.number().required(),
    exp: Joi.number().required(),
  });

  const schema = Joi.object({
    value: Joi.number().required(),
    description: Joi.string().allow(""),
    user:userSchema
  })

  const validation = schema.validate(req.body);

  if (validation.error) {
    throw new ApiError(validation.error.message, 400);
  }
}
export { incomeValidator };
