const Joi = require("joi");

module.exports = {
    validateRegister: function (obj) {
        const schema = Joi.object({
            userName: Joi.string()
                .min(3)
                .max(30)
                .required()
                .label("User Name")
                .messages({
                    "string.base": `"User Name" should be a type of text`,
                    "string.empty": `"User Name" cannot be empty`,
                    "string.min": `"User Name" should have at least {#limit} characters`,
                    "string.max": `"User Name" should have at most {#limit} characters`,
                    "any.required": `"User Name" is required`,
                }),

            email: Joi.string()
                .email()
                .required()
                .label("Email")
                .messages({
                    "string.email": `"Email" must be a valid email`,
                    "string.empty": `"Email" cannot be empty`,
                    "any.required": `"Email" is required`,
                }),

            password: Joi.string()
                .min(6)
                .required()
                .label("Password")
                .messages({
                    "string.min": `"Password" should have at least {#limit} characters`,
                    "string.empty": `"Password" cannot be empty`,
                    "any.required": `"Password" is required`,
                }),

            confirmPassword: Joi.any()
                .valid(Joi.ref('password'))
                .required()
                .label("Confirm Password")
                .messages({
                    "any.only": `"Confirm Password" does not match`,
                    "any.required": `"Confirm Password" is required`,
                })
        });
        return schema.validate(obj, { allowUnknown: false });
    },
    validateLogin: function (obj) {
        const schema = Joi.object({
            email: Joi.string()
                .email()
                .required()
                .label("Email")
                .messages({
                    "string.email": `"Email" must be a valid email`,
                    "string.empty": `"Email" cannot be empty`,
                    "any.required": `"Email" is required`,
                }),
            password: Joi.string()
                .min(6)
                .required()
                .label("Password")
                .messages({
                    "string.min": `"Password" should have at least {#limit} characters`,
                    "string.empty": `"Password" cannot be empty`,
                    "any.required": `"Password" is required`,
                }),
        });
        return schema.validate(obj, { allowUnknown: true });
    },
};
