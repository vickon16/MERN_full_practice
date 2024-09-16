import express from "express"
import * as UsersController from "@/controllers/users"
import { requiresAuth } from "@/middleware/auth"

const router = express.Router()

router.get("/me", requiresAuth, UsersController.getAuthenticatedUser)
router.post("/signup", UsersController.signUp)
router.post("/signin", UsersController.signIn)
router.post("/logout", UsersController.logOut)

export default router
