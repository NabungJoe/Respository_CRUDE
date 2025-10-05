import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

//post
router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/signout", authController.signout);

//patch
router.patch("/send-verification-code", authController.sendVerificationEmail);
router.patch("/verifyCode", authController.verifyCode);

//get
router.get("/getSignedInUser", authController.getSignedInUser);
router.get("/getUser/:id", authController.getUser);
router.delete("/deleteUser/:id", authController.deleteUser);


router.post("/adminLogin", authController.adminLogin);
router.post("/adminSignup", authController.adminSignup);
router.post("/adminSignout", authController.adminSignout);

export default router;
