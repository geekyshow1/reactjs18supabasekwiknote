import { useState, useEffect } from 'react'
import KwikNote from './components/KwikNote'
import { supabase } from './supbaseClient'

function App() {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      let { data, error } = await supabase.from('notes').select('*');
      if (error) {
        throw error;
      }
      setNotes(data || [])
    } catch (error) {
      console.error('Error fetching notes:', error.message);
    }
  }
  const addNote = async () => {
    try {
      const { data, error } = await supabase.from('notes').insert([{ text: 'Click Edit to write your note...' }]).select()
      if (error) {
        throw error
      }
      setNotes([...notes, ...data])
    } catch (error) {
      console.error('Error adding note:', error.message);
    }
  }
  const updateNote = async (id, newText) => {
    try {
      const { data, error } = await supabase.from('notes').update({ text: newText }).eq('id', id).select()
      if (error) {
        throw error
      }
      setNotes((preNote) => preNote.map((note) => (note.id === id ? { ...note, text: newText } : note)))

    } catch (error) {
      console.error('Error updating note:', error.message);
    }

  }
  const deleteNote = async (id) => {
    try {
      const { error } = await supabase.from('notes').delete().eq('id', id)
      if (error) {
        throw error
      }
      setNotes(notes.filter((note) => note.id !== id))
    } catch (error) {
      console.error('Error deleting note:', error.message);
    }
  }
  return (
    <>
      <h1 className='m-3 ml-5 text-white font-bold text-5xl italic'>Kwik Note</h1>
      <div className='text-center'>
        <button onClick={addNote} className="text-white bg-green-700 hover:bg-green-800 px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
      <div className='flex flex-wrap'>
        {
          notes.map((note) => (
            <KwikNote
              key={note.id}
              id={note.id}
              text={note.text}
              onUpdate={updateNote}
              onDelete={() => deleteNote(note.id)}
            />
          ))
        }
      </div>
    </>
  )
}

export default App
