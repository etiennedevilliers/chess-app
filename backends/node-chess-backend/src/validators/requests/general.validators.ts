import Joi from "joi";

export const objectId = Joi.string().hex().min(12);

export const idRequest = Joi.object({
    id: objectId.required()
});