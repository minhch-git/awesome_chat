// import controller
import siteController from "../app/controllers/SiteController";
import isLogin from "./../validation/isLogin";

import { Router } from "express";
const router = new Router();

router.get("/find-conversations/:keyword", siteController.findConversation);

router.get(
  "/login-register",
  isLogin.isLoggedOut,
  siteController.getLoginRegister
);
router.get("/", isLogin.isLoggedIn, siteController.getHome);

export default router;
