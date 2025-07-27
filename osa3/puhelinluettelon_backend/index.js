const express = require('express')
const morgan = require('morgan')
const app = express()


app.use(express.json())
app.use(express.static('dist'))
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  { 
      "name": "Arto Hellas", 
      "number": "040-123456",
      "id": "1"
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": "2"
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": "3"
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": "4"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.put('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const body = request.body

  const personIndex = persons.findIndex(p => p.id === id)

  if (personIndex === -1) {
    return response.status(404).json({ error: 'person not found' })
  }

  const updatedPerson = {
    ...persons[personIndex],
    name: body.name,
    number: body.number
  }

  persons[personIndex] = updatedPerson
  response.json(updatedPerson)
})

const generateId = () => {
  let id
  do {
    id = Math.floor(Math.random() * 1000000)
  } while (persons.some(p => p.id === String(id)))
  return String(id)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  console.log(request.body)

  if (!body.name || !body.number) {
    console.error('Error: name or number missing')
    return response.status(400).json({ error: 'name or number is missing'})
  }

  const nameExists = persons.some(person => person.name === body.name)
  if (nameExists) {
    console.error(`Error: name "${body.name} already exists`)
    return response.status(400).json({ error: 'name must be unique' })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)
  console.log(`Added new person: ${person.name} (${person.number}), ID: ${person.id}`)
  response.json(person)
})


app.get('/info', (request, response) => {
  const numberOfPersons = persons.length
  const currentTime = new Date()

  response.send(`
    <p>Phonebook has info for ${numberOfPersons} people</p>
    <p>${currentTime}</p>
  `)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})