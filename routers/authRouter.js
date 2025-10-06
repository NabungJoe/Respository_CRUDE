
import express from "express";
import authController from "../controllers/authController.js";

// Auth middleware to check JWT in cookie or header
function requireAuth(req, res, next) {
	let token;
	if (req.cookies && req.cookies.Authorization && req.cookies.Authorization.startsWith('Bearer ')) {
		token = req.cookies.Authorization.replace('Bearer ', '');
	} else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
		token = req.headers.authorization.replace('Bearer ', '');
	}
	if (!token) {
		return res.status(401).json({ success: false, message: 'Not authenticated' });
	}
	req.token = token;
	next();
}

const router = express.Router();

//post
router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/signout", authController.signout);

//patch
router.patch("/send-verification-code", authController.sendVerificationEmail);
router.patch("/verifyCode", authController.verifyCode);

//get
router.get("/getSignedInUser", requireAuth, authController.getSignedInUser);
router.get("/getUser/:id", requireAuth, authController.getUser);
router.delete("/deleteUser/:id", requireAuth, authController.deleteUser);


router.post("/adminLogin", authController.adminLogin);
router.post("/adminSignup", authController.adminSignup);
router.post("/adminSignout", authController.adminSignout);

export default router;
