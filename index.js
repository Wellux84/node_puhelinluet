
const express = require('express')
const app = express()
require('dotenv').config()

const Person = require('./models/person')

app.use(express.static('dist'))




const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

const cors = require('cors')

app.use(cors())
app.use(express.json())


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const morgan = require('morgan')

morgan.token('body', req => {
  return JSON.stringify(req.body)
})
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

let text = `Phonebook has info for ${persons.length} people`
let dates =  new Date()

app.get('/info', (request, response) => {
  response.send(`<h1> ${text} </h1><h2>${dates}</h2>`)
})
  

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
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
  .then(result => {
  response.status(204).end()
  })
  .catch(error => next(error))
})

const generateId = () => {
const Id = Math.floor(Math.random() * 9000000)
  return String(Id)
}
      
app.post('/api/persons', (request, response, next) => {
  const body = request.body
    
  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }
    
  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }
})

  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }
    
    if (!body.number) {
      return response.status(400).json({ 
        error: 'number missing' 
      })
    }
  
    const updatedPerson = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(request.params.id, updatedPerson, { new: true })
      .then(result => {
        if (result) {
          response.json(result)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
  })
  



app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})