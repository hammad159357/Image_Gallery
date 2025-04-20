const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    register: async (req) => {
        const { userName, email, password } = req.body;
        try {
            const normalizedUserName = userName.toLowerCase().replace(/\s+/g, '')
            const existing = await User.findOne({
                $or: [{ email }, { userName: normalizedUserName }]
            });
            if (existing) {
                const message = (existing.email == email)
                    ? 'User already exists'
                    : 'Username already taken';
                return { success: false, message, statusCode: 400 };
            }

            const hashed = await bcrypt.hash(password, 10);
            const user = new User({ userName: normalizedUserName, email, password: hashed });
            await user.save();

            return {
                success: true
            };
        } catch (err) {
            console.error(err);
            return {
                success: false,
                message: "Internal server error",
                statusCode: err.status
            };
        }
    },
    login: async (req) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return { success: false, statusCode: 400, message: 'Invalid credentials' };
            }
            const isMatch = bcrypt.compare(password, user.password);
            if (!isMatch) {
                return { success: false, statusCode: 400, message: 'Invalid credentials' };
            }

            const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            return {
                success: true,
                data: {
                    authToken, user: {
                        id: user._id,
                        userName: user.userName,
                        email: user.email
                    }
                }
            };
        } catch (err) {
            console.error(err);
            return {
                success: false,
                message: "Internal server error",
                statusCode: err.status
            };
        }
    }
}