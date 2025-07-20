import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] =useState('')

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
        })
        .catch(error => {
          alert(`Failed to update ${newName}. The person may have been removed from the server`)
        })
      }
    return
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
      })
    }
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
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