import { InferSchemaType, model, Schema } from "mongoose"

const noteSchema = new Schema(
  {
    title: { type: String, required: true },
    text: { type: String },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" }
  },
  { timestamps: true }
)

type Note = InferSchemaType<typeof noteSchema>
export default model<Note>("Note", noteSchema)
