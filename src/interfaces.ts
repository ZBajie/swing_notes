export interface NotesDataProps {
  notes: NotesProps[]
}

export interface NotesProps {
  note: string
  username: string
  title: string
  id: string
  createdAt: string
}
