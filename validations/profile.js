const Joi = require('joi');
const mongoose = require('mongoose');

module.exports = {
    validateUploadImage: function (obj) {
        const schema = Joi.object({
            title: Joi.string().min(2).max(100).required(),
            description: Joi.string().allow('', null).optional(),
            isPublic: Joi.alternatives()
                .try(Joi.boolean(), Joi.string().valid('true', 'false'))
                .default(true)
        });
        return schema.validate(obj, { allowUnknown: false });
    },
    validateProfile: function (obj) {
        const schema = Joi.object({
            userName: Joi.string()
                .trim()
                .lowercase()
                .pattern(/^\S+$/)
                .min(3)
                .max(30)
                .optional()
                .label("User Name")
                .messages({
                    'string.pattern.base': 'Username cannot contain spaces',
                    "string.base": `"User Name" should be a type of text`,
                    "string.empty": `"User Name" cannot be empty`,
                    "string.min": `"User Name" should have at least {#limit} characters`,
                    "string.max": `"User Name" should have at most {#limit} characters`,
                    "any.required": `"User Name" is required`,
                }),
            imageId: Joi.string()
                .optional()
                .custom((value, helpers) => {
                    if (!mongoose.Types.ObjectId.isValid(value)) {
                        return helpers.error('any.invalid');
                    }
                    return value;
                })
                .messages({
                    'any.invalid': 'Invalid imageId format'
                }),
            isPublic: Joi.alternatives()
                .try(Joi.boolean(), Joi.string().valid('true', 'false'))
                .optional(),
            title: Joi.string().min(3).max(100).optional(),
            description: Joi.string().allow('', null).optional(),
        });
        return schema.validate(obj, { allowUnknown: false });
    },
};