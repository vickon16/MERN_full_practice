import "dotenv/config"
import express, { NextFunction, Request, Response } from "express"
import mongoose from "mongoose"
import env from "@/utils/validateEnv"
import notesRouter from "@/routes/notes"
import usersRouter from "@/routes/users"
import morgan from "morgan"
import createHttpError, { isHttpError } from "http-errors"
import session from "express-session"
import MongoStore from "connect-mongo"
import { requiresAuth } from "./middleware/auth"

const app = express()
const port = env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))

app.use(
  session({
    name: "notes-app-session",
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 1 // 1hour
    },
    rolling: true, // as long as user is using the website, the cookie would be refreshed automatically,
    store: MongoStore.create({ mongoUrl: env.MONGO_CONNECTION_STRING })
  })
)

app.use("/api/notes", requiresAuth, notesRouter)
app.use("/api/users", usersRouter)

// not found endpoint
app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"))
})

// error handler
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  let errorMessage = "An unknown error occurred"
  let statusCode = 500
  if (isHttpError(err)) {
    statusCode = err.status
    errorMessage = err.message
  }

  res.status(statusCode).json({ error: errorMessage })
})

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING!)
  .then(() => {
    console.log("Connected to MongoDB")
    // start our server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  })
  .catch((err) => {
    console.error(err)
  })
