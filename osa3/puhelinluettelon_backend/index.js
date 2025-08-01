require ('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const morgan = require('morgan')



const app = express()


app.use(express.json())
app.use(express.static('dist'))
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  const validPhone = /^\d{2,3}-\d{5,}$/
  if (!validPhone.test(number)) {
    return response.status(400).json({ error: 'Invalid phone number format' })
  }

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))

})


app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  if (!name || !number) {
    return response.status(400).json({ error: 'name or number is missing' })
  }

  Person.findOne({ name }).then(existingPerson => {
    if (existingPerson) {
      const validPhone = /^\d{2,3}-\d{5,}$/
      if (!validPhone.test(number)) {
        return response.status(400).json({ error: 'Invalid phone number format' })
      }

      existingPerson.number = number
      existingPerson.save()
        .then(updated => {
          response.json(updated)
        })
        .catch(error => next(error))

    } else {
      const person = new Person({ name, number })
      person.save()
        .then(savedPerson => {
          response.json(savedPerson)
        })
        .catch(error => next(error))
    }
  })
})


app.get('/info', (request, response) => {
  Person.countDocuments({}).then(count => {
    const currentTime = new Date()
    response.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${currentTime}</p>
  `)
  })
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}


app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})