import { TSignInBody, TSignUpBody } from "@/types"
import { RequestHandler } from "express"
import UserModel from "@/models/user"
import createHttpError from "http-errors"
import bcrypt from "bcrypt"

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.session.userId).select("+email").exec()
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

export const signUp: RequestHandler<unknown, unknown, TSignUpBody, unknown> = async (req, res, next) => {
  const { username, email, password } = req.body

  try {
    if (!username || !email || !password) {
      throw createHttpError(400, "Missing username, email or password")
    }

    const existingUserName = await UserModel.findOne({ username }).exec()
    if (existingUserName) {
      throw createHttpError(400, "Username already exists")
    }

    const existingEmail = await UserModel.findOne({ email }).exec()
    if (existingEmail) {
      throw createHttpError(400, "Email already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await UserModel.create({ username, email, password: hashedPassword })

    req.session.userId = newUser._id

    res.status(201).json(newUser)
  } catch (error) {
    next(error)
  }
}

export const signIn: RequestHandler<unknown, unknown, TSignInBody, unknown> = async (req, res, next) => {
  const { email, password } = req.body

  try {
    if (!email || !password) {
      throw createHttpError(400, "Missing email or password")
    }

    const user = await UserModel.findOne({ email }).select("+email +password").exec()

    if (!user) {
      throw createHttpError(400, "Invalid email or password")
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw createHttpError(400, "Invalid email or password")
    }

    req.session.userId = user._id
    res.status(200).json({ user })
  } catch (error) {
    next(error)
  }
}

export const logOut: RequestHandler = async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err)
    else res.sendStatus(204)
  })
}
