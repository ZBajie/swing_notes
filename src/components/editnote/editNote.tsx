import { useState } from "react"

export default function EditNote() {
  // Get id from url
  const urlId = new URLSearchParams(window.location.search)
  const noteId = urlId.get("noteId")
  const noteText = urlId.get("note") || ""
  const username = urlId.get("username")
  const [note, setNote] = useState(noteText)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (note.length < 5) {
      alert("Notisen måste vara minst 5 bokstäver lång.")
    }
    try {
      const response = await fetch(
        `https://o6wl0z7avc.execute-api.eu-north-1.amazonaws.com/api/notes/${noteId}`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            note,
          }),
        }
      )
      if (response.ok) {
        const homeUrl: string = `/?username=${username}`
        window.location.href = homeUrl
      }
    } catch (e) {
      console.error(e)
    }
  }
  return (
    <main id="edit-note">
      <h1>Editera note</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="note">Text</label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div>
          <button onClick={onSubmit}>Edit</button>
        </div>
      </form>
    </main>
  )
}
