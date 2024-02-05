import { useState } from "react"

export default function NewNotes() {
  const [note, setNote] = useState(``)
  const [username, setUsername] = useState(``)
  const [title, setTitle] = useState(``)
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (title.length < 5) {
      alert("Titeln måste vara minst 5 bokstäver lång.")
    }
    if (note.length < 5) {
      alert("Notisen måste vara minst 5 bokstäver lång.")
    }

    try {
      const response = await fetch(
        `https://o6wl0z7avc.execute-api.eu-north-1.amazonaws.com/api/notes`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            note,
            username,
            title,
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
    <main id="new-note">
      <section>
        <article>
          <h2>Skapa en ny notis</h2>

          <form onSubmit={onSubmit}>
            <div>
              <label htmlFor="title">Titel</label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="note">Notis</label>
              <textarea
                id="note"
                rows={6}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="name">Namn</label>
              <input
                id="name"
                size={10}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <button onClick={onSubmit}>Posta</button>
            </div>
          </form>
        </article>
      </section>
    </main>
  )
}
