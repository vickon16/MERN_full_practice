export type TCreateNoteBody = {
  title: string
  text?: string
}

export type TUpdateNoteBody = {
  title?: string
  text?: string
}

export type TSignUpBody = {
  username: string
  email: string
  password: string
}

export type TSignInBody = {
  email: string
  password: string
}
