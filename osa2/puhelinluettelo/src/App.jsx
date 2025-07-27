import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'
import './index.css'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] =useState('')
  const [notification, setNotification] = useState({ message: null, type: null })


  useEffect(() => {
    personService
    .getAll()
    .then(response => {
      setPersons(response.data)
    })
  }, [])

  const addName = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(p => p.name === newName)

    if (existingPerson) {
  const confirmUpdate = window.confirm(
    `${newName} is already added to phonebook, replace the old number with a new one?`
  )

  if (confirmUpdate) {
    const updatedPerson = { ...existingPerson, number: newNumber }

    personService
      .update(existingPerson.id, updatedPerson)
      .then(response => {
        setPersons(persons.map(p => p.id !== existingPerson.id ? p : response.data))
        setNewName('')
        setNewNumber('')
        setNotification({ message: `Updated ${response.data.name}'s number`, type: 'success' })
        setTimeout(() => setNotification({ message: null, type: null }), 5000)
      })
      .catch(error => {
        setNotification({ message: `Information of ${newName} has already been removed from server`, type: 'error' })
        setTimeout(() => setNotification({ message: null, type: null }), 5000)
        setPersons(persons.filter(p => p.id !== existingPerson.id))
        setNewName('')
        setNewNumber('')
      })

    return 
  } else {
    return 
  }
}


    const nameObject = {
      name: newName,
      number: newNumber
    }


    personService
      .create(nameObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
        setNotification({ message: `Added ${response.data.name}`, type: 'success' })
        setTimeout(() => {
          setNotification({ message: null, type: null })
        }, 5000)
      })


  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
        setNotification({ message: `Deleted ${name}`, type: 'success' })
        setTimeout(() => {
          setNotification({ message: null, type: null })
        }, 5000)
      })
      .catch(error => {
        setNotification({ message: `Failed to delete ${name}`, type: 'error' })
      setTimeout(() => setNotification({ message: null, type: null }), 5000)
})
    }
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <Filter value={filter} onChange={handleFilterChange}/>
      <h2>Add a new </h2>
      <PersonForm 
      onSubmit={addName}
      newName={newName}
      handleNameChange={handleNameChange}
      newNumber={newNumber}
      handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} onDelete={handleDelete} />

    </div>
  )

}

export default App