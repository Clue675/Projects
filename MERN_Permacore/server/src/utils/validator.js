const Joi = require('joi');

/**
 * Validates user data.
 * @param {Object} userData - The user data to validate.
 * @returns {Object} - The result of the validation.
 */
const validateUser = (userData) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        role: Joi.string().required(),
    });

    return schema.validate(userData);
};

/**
 * Validates vendor data.
 * @param {Object} vendorData - The vendor data to validate.
 * @returns {Object} - The result of the validation.
 */
const validateVendor = (vendorData) => {
    const schema = Joi.object({
        vendorName: Joi.string().min(3).max(50).required(),
        contactInfo: Joi.object({
            email: Joi.string().email(),
            phone: Joi.string().pattern(new RegExp('^[0-9]+$')),
            // Add more fields as necessary
        }),
        // Add more fields as necessary
    });

    return schema.validate(vendorData);
};

// Add more validation functions as needed

module.exports = { validateUser, validateVendor };
