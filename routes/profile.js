const router = require("express").Router();
const userController = require("../controllers/user");


//  public profile route
router.get("/:id", userController.getUserProfile);

module.exports = router;
