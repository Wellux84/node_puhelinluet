const express = require('express')
const app = express()
const morgan = require('morgan')
app.use(express.json())
app.use(express.static('dist'))
const cors = require('cors')

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
      return response.status(400).json({ 
        error: 'name is allready added' 
      });
    }


    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
      
    persons = persons.concat(person)
      
    response.json(person)
  })
  
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})