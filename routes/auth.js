const router = require("express").Router();
const authController = require("../controllers/auth");

router.get("/health-check", (req, res) => {
    return res
        .status(200)
        .send({ status: 200, success: true, message: "Working" });
});

router.post("/signup", authController.register);
router.post("/login", authController.login);

module.exports = router;
