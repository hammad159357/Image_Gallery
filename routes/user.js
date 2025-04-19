const router = require("express").Router();
const userController = require("../controllers/user");
const fileUpload = require("../middlewares/multer");


router.get("/", userController.getProfile);
router.patch("/", userController.updateProfile);
router.post("/image-upload", fileUpload.uploadMedia.array('image', 10), userController.uploadImage);
router.delete("/:id", userController.deleteImage);


module.exports = router;
