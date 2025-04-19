const userService = require('../../services/user');
const { validateProfile, validateUploadImage } = require('../../validations/profile');

module.exports = {
    getProfile: async (req, res) => {
        try {
            const response = await userService.getProfile(req);
            if (!response.success) {
                return res.status(response.statusCode).json({ message: response.message })
            }
            return res.status(200).json({ message: 'Profile fetched successfully', data: response.data });
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    updateProfile: async (req, res) => {
        try {
            const { error } = validateProfile(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            const response = await userService.updateProfile(req);
            if (!response.success) {
                return res.status(response.statusCode).json({ message: response.message })
            }
            return res.status(200).json({ message: 'Profile updated successfully', data: response.data });
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    uploadImage: async (req, res) => {
        try {
            const { error } = validateUploadImage(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            const response = await userService.uploadImage(req);
            if (!response.success) {
                return res.status(response.statusCode).json({ message: response.message })
            }
            return res.status(200).json({ message: 'Image uploaded successfully', data: response.data });
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    deleteImage: async (req, res) => {
        try {
            const response = await userService.deleteImage(req);
            if (!response.success) {
                return res.status(response.statusCode).json({ message: response.message })
            }
            return res.status(200).json({ message: 'Image deleted successfully', data: response.data });
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    getUserProfile: async (req, res) => {
        try {
            const response = await userService.getUserProfile(req);
            if (!response.success) {
                return res.status(response.statusCode).json({ message: response.message })
            }
            return res.status(200).json({ message: 'User profile fetched successfully', data: response.data });
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

}