import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import NewNote from "./components/newnote/newNote"
import Notes from "./components/notes/notes"
import EditNote from "./components/editnote/editNote"
import Header from "./components/header/header"

function App() {
  return (
    <>
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<Notes />} />
          <Route path="/newnote" element={<NewNote />} />
          <Route path="/editnote" element={<EditNote />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
