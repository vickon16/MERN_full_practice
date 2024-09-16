import { RequestHandler } from "express"
import NoteModel from "@/models/note"
import { TCreateNoteBody, TUpdateNoteBody } from "@/types"
import createHttpError from "http-errors"
import mongoose from "mongoose"
import { assertIsDefined } from "@/utils/assertIsDefined"

export const getAllNotes: RequestHandler = async (req, res, next) => {
  const userId = req.session?.userId
  try {
    assertIsDefined(userId)
    const notes = await NoteModel.find({ userId }).exec()
    const newNotes = notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    res.status(200).json(newNotes)
  } catch (error) {
    next(error)
  }
}

export const createNote: RequestHandler<unknown, unknown, TCreateNoteBody, unknown> = async (req, res, next) => {
  const userId = req.session?.userId
  const { title, text } = req.body

  try {
    assertIsDefined(userId)
    if (!title || !text) {
      throw createHttpError(400, "Missing title or text")
    }
    const note = await NoteModel.create({ title, text, userId })
    res.status(201).json(note)
  } catch (error) {
    next(error)
  }
}

export const getNote: RequestHandler = async (req, res, next) => {
  const userId = req.session?.userId
  const { noteId } = req.params

  try {
    assertIsDefined(userId)
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid noteId")
    }
    const note = await NoteModel.findOne({ _id: noteId, userId }).exec()
    if (!note) {
      throw createHttpError(404, "Note not found")
    }

    if (!note.userId.equals(userId)) {
      throw createHttpError(401, "You are not authorized to view this note")
    }

    res.status(200).json(note)
  } catch (error) {
    next(error)
  }
}

export const updateNote: RequestHandler<{ noteId: string }, unknown, TUpdateNoteBody, unknown> = async (
  req,
  res,
  next
) => {
  const userId = req.session?.userId
  const { noteId } = req.params
  const { title, text } = req.body

  try {
    assertIsDefined(userId)
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid noteId")
    }
    const note = await NoteModel.findOne({ _id: noteId, userId }).exec()
    if (!note) {
      throw createHttpError(404, "Note not found")
    }

    if (!!title) note.title = title
    if (!!text) note.text = text

    await note.save()
    res.status(200).json(note)
  } catch (error) {
    next(error)
  }
}

export const deleteNote: RequestHandler = async (req, res, next) => {
  const userId = req.session?.userId
  const { noteId } = req.params

  try {
    assertIsDefined(userId)
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid noteId")
    }
    const note = await NoteModel.findOne({ _id: noteId, userId }).exec()
    if (!note) {
      throw createHttpError(404, "Note not found")
    }
    await note.deleteOne()
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}
