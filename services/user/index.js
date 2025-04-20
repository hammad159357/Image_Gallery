const mongoose = require('mongoose');
const User = require('../../models/User');
const Image = require('../../models/Image');
const fs = require('fs');
const path = require('path');

module.exports = {
    getProfile: async (req) => {
        const { user } = req;
        const { id } = user;
        try {
            const [data] = await User.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id),
                    }
                },
                {
                    $lookup: {
                        from: 'images',
                        let: { userId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$userId', '$$userId'] },
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'userImages'
                    }
                },
                {
                    $project: {
                        userName: 1,
                        email: 1,
                        userImages: {
                            _id: 1,
                            imageUrl: 1,
                            title: 1,
                            description: 1,
                            isPublic: 1,
                            createdAt: 1,
                            updatedAt: 1,
                        }
                    }
                }
            ])
            if (!data) {
                return {
                    success: false,
                    message: 'User not found',
                    statusCode: 404
                };
            }
            const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
            data.userImages = data.userImages.map(img => ({
                ...img,
                imageUrl: `${BASE_URL}${img.imageUrl}`
            }));
            return {
                success: true,
                data,
                statusCode: 200
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
    updateProfile: async (req) => {
        const { user, body } = req;
        const { userName, imageId, isPublic, title, description } = body;
        const { id } = user;
        try {
            const user = await User.findById(id);
            if (!user) {
                return { success: false, message: 'User not found', statusCode: 404 };
            }
            if (userName && userName !== user.userName) {
                const normalizedUserName = userName.toLowerCase().replace(/\s+/g, '')
                const existingUser = await User.findOne({
                    userName: normalizedUserName
                });

                if (existingUser && existingUser._id.toString() !== id) {
                    return {
                        success: false,
                        message: 'Username already taken',
                        statusCode: 409
                    };
                }
                user.userName = normalizedUserName;
                await user.save();
            }
            if (imageId) {
                const image = await Image.findByIdAndUpdate(imageId, {
                    isPublic: isPublic === true || isPublic === 'true',
                    title,
                    description
                })
                if (!image) {
                    return { success: false, message: 'Image not found', statusCode: 404 };
                }
            }
            return {
                success: true,
                data: {
                    id: user._id,
                    userName: user.userName,
                    email: user.email
                },
                statusCode: 200
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
    uploadImage: async (req) => {
        const { files, body, user } = req;
        const { title, description, isPublic, } = body;

        try {
            if (!files || !files.length) {
                return {
                    success: false,
                    message: 'At least one image file is required.',
                    statusCode: 400
                };
            }
            const savedImages = await Promise.all(
                files.map((file) => {
                    const imageUrl = `/uploads/${file.filename}`;
                    const image = new Image({
                        userId: user.id,
                        imageUrl,
                        title,
                        description,
                        isPublic: isPublic === true || isPublic === 'true',
                    });
                    return image.save();
                })
            );
            return {
                success: true,
                data: savedImages,
                statusCode: 200
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
    deleteImage: async (req) => {
        const { params, user } = req;
        const { id } = params;

        try {
            const image = await Image.findById(id);
            if (!image) {
                return {
                    success: false,
                    message: 'Image not found',
                    statusCode: 404
                };
            }
            if (image.userId.toString() != user?.id) {
                return {
                    success: false,
                    message: 'Not authorized to delete this image',
                    statusCode: 403
                };
            }
            const imagePath = path.join('public', image.imageUrl);
            fs.unlink(imagePath, (err) => {
                if (err) console.warn('Failed to delete file:', err.message);
            });
            await image.deleteOne();
            return {
                success: true,
                message: 'Image deleted successfully',
                data: image,
                statusCode: 200
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
    getUserProfile: async (req) => {
        const { params } = req;
        const { userName } = params;

        try {
            const [data] = await User.aggregate([
                {
                    $match: {
                        userName: userName.toLowerCase()
                    }
                },
                {
                    $lookup: {
                        from: 'images',
                        let: { userId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$userId', '$$userId'] },
                                            { $eq: ['$isPublic', true] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'userImages'
                    }
                },
                {
                    $project: {
                        userName: 1,
                        email: 1,
                        userImages: {
                            _id: 1,
                            imageUrl: 1,
                            title: 1,
                            description: 1,
                            isPublic: 1,
                            createdAt: 1,
                            updatedAt: 1,
                        }
                    }
                }
            ])
            if (!data) {
                return {
                    success: false,
                    message: 'User not found',
                    statusCode: 404
                };
            }
            const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
            data.userImages = data.userImages.map(img => ({
                ...img,
                imageUrl: `${BASE_URL}${img.imageUrl}`
            }));
            return {
                success: true,
                data,
                statusCode: 200
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

}