import { useState } from "react"
import { NotesDataProps, NotesProps } from "../../interfaces"

function editLink(noteId: string, note: string, username: string) {
  const editUrl: string = `/editnote?noteId=${noteId}&note=${note}&username=${username}`
  window.location.href = editUrl
}

async function deleteNote(noteId: string, userName: string) {
  const confirmation: boolean = window.confirm(
    "Är du säker på att du vill radera notisen?"
  )
  if (confirmation) {
    const deleteUrl: string = `https://o6wl0z7avc.execute-api.eu-north-1.amazonaws.com/api/notes/${noteId}`

    try {
      const result = await fetch(deleteUrl, { method: "DELETE" })
      if (result.ok) {
        const homeUrl: string = `/?username=${userName}`
        window.location.href = homeUrl
      }
    } catch (error) {
      console.error(error)
    }
  }
}

const Notes: React.FC = () => {
  // Get id from url
  const urlUserName: URLSearchParams = new URLSearchParams(
    window.location.search
  )
  const userName: string = urlUserName.get("username") || ""

  const [name, setName] = useState(userName)
  const [notes, setResponse] = useState<NotesProps[]>([])

  const getNotes = async (name: string) => {
    try {
      const response: Response = await fetch(
        `https://o6wl0z7avc.execute-api.eu-north-1.amazonaws.com/api/notes/${name}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
        }
      )
      if (response.ok) {
        const notesData: NotesDataProps = await response.json()
        const notes: NotesProps[] = notesData.notes
        notes.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )

        setResponse(notes)
      }
    } catch (error) {
      console.error(error)
    }
  }
  // Get notes if user name is passed in url.
  const [runOnce, setRunOnce] = useState("")
  if (userName && !runOnce) {
    getNotes(userName)
    setRunOnce("stop")
  }
  // Get notes if form field is filled and button pressed.
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    getNotes(name)
  }

  return (
    <main id="notes">
      <header>
        <h2>Notiser</h2>
        <form onSubmit={onSubmit}>
          <div>
            <label htmlFor="name"></label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Namn"
            />
          </div>
          <div>
            <button onClick={onSubmit}>Sök notiser</button>
          </div>
        </form>
      </header>
      <section>
        {notes.map((item: NotesProps) => (
          <article key={item.id}>
            <h3>{item.title}</h3>
            <div>
              <button
                onClick={() => editLink(item.id, item.note, item.username)}
              >
                Editera
              </button>
              <p>{item.note}</p>
              <button onClick={() => deleteNote(item.id, item.username)}>
                Radera
              </button>
            </div>
            <footer>
              <p>{item.username}</p>
              <p>{item.createdAt}</p>
            </footer>
          </article>
        ))}
      </section>
    </main>
  )
}
export default Notes
