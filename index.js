const { request, response } = require('express')
require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/persons')


let persons = [
    {
      name: "Arto Hellas",
      number: "040-123456",
      id: 1
    },
    {
      name: "Ada Lovelace",
      number: "39-44-5323523",
      id: 2
    },
    {
      name: "Dan Abramov",
      number: "12-43-234345",
      id: 3
    },
    {
      name: "Mary Poppendieck",
      number: "39-23-6423122",
      id: 4
    }
  ]
 

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})


app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if(person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(eroor => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      console.log(`${result.name} deleted`)
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(body.name === undefined) {
      return response.status(400).json({error: 'name missing'})
    }

    /* tarkastetaan onko nimi tyhjä tai löytyykö nimeä jo valmiiksi
        sen jälkeen tarkastetaan numerolle samat 
     */
    /*
    if (!body.name) {
        return response.status(400).json({ 
          error: 'name missing' 
        })
    } else if (persons.some(p => p.name === body.name)){
        return response.status(400).json({ 
            error: 'name already in the phonebook' 
          })
          
    } else if(!body.number) {
        return response.status(400).json({ 
            error: 'number missing' 
          })
    } else if (persons.some(p => p.number === body.number)){
        return response.status(400).json({ 
            error: 'number already in the phonebook' 
          })
    
    }
    */

    const person = new Person({
        name: body.name,
        number: body.number,
        id: generateId(),
    })
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
    
})



const generateId = () => {
    return Math.floor(Math.random() * (1000- 5) + 5)
}

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
console.log(morgan)