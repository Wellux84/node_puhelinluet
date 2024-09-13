require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
app.use(express.json())
app.use(express.static('dist'))
const cors = require('cors')
const Person = require('./models/person')
app.use(cors())



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
      
  app.post('/api/persons', (request, response) => {
    const body = request.body
      
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      });
    }

    if (!body.number) {
      return response.status(400).json({ 
        error: 'number missing' 
      });
    }

    const existingPerson = persons.find(person => person.name === body.name)
    if (existingPerson) {
      app.put('/api/persons/:id', (request, response, next) => {
        const body = request.body
      
        const person = {
          name: body.name,
          number: body.number,
        }
      
        Person.findByIdAndUpdate(request.params.id, person, { new: true })
          .then(updatedPerson => {
            response.json(updatedPerson)
          })
          .catch(error => next(error))
      })
    }


    const person = new Person({
      name: body.name,
      number: body.number,
      id: generateId(),
    })
      
  person.save().then(savedPerson => {    
    response.json(savedPerson)
  })
})
  

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})