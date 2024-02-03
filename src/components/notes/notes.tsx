import { useState } from "react"
import { NotesProps } from "../../interfaces"

function editLink(noteId: string, note: string, username: string) {
  const editUrl: string = `/editnote?noteId=${noteId}&note=${note}&username=${username}`
  window.location.href = editUrl
}

async function deleteNote(noteId: string, userName: string) {
  const confirmation: boolean = window.confirm(
    "Are you sure you want to delete this?"
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
  const [response, setResponse] = useState<NotesProps[]>([])
  const getNotes = async (name: string) => {
    try {
      const response = await fetch(
        `https://o6wl0z7avc.execute-api.eu-north-1.amazonaws.com/api/notes/${name}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
        }
      )
      if (response.ok) {
        const notesData = await response.json()
        const notes: NotesProps[] = notesData.notes
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
      <h1>Notiser</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="name">Namn</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <button onClick={onSubmit}>Sök notiser</button>
        </div>
      </form>
      <section>
        {response.map((item) => (
          <div key={item.id}>
            <h2>{item.title}</h2>
            <p>{item.note}</p>
            <p>Created by: {item.username}</p>
            <p>Created at: {item.createdAt}</p>
            <button onClick={() => editLink(item.id, item.note, item.username)}>
              Editera
            </button>
            <button onClick={() => deleteNote(item.id, item.username)}>
              Radera notis
            </button>
          </div>
        ))}
      </section>
    </main>
  )
}
export default Notes
