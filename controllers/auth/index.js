const { validateRegister, validateLogin } = require('../../validations/auth');
const authService = require('../../services/auth');

module.exports = {
    register: async (req, res) => {
        try {
            const { error } = validateRegister(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            const response = await authService.register(req);
            if (!response.success) {
                return res.status(response.statusCode).json({ message: response.message })
            }
            return res.status(201).json({ message: 'User registered successfully', data: response.data });
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    login: async (req, res) => {
        try {
            const { error } = validateLogin(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            const response = await authService.login(req);
            if (!response.success) {
                return res.status(response.statusCode).json({ message: response.message })
            }
            return res.status(200).json({ message: 'User logged in successfully', data: response.data });
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}