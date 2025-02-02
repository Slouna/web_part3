const { request, response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

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
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    console.log(`poistettu: ${id}`)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    /* tarkastetaan onko nimi tyhjä tai löytyykö nimeä jo valmiiksi
        sen jälkeen tarkastetaan numerolle samat 
     */
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

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }
    persons = persons.concat(person)
    response.json(person)
})



const generateId = () => {
    return Math.floor(Math.random() * (1000- 5) + 5)
}




const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
console.log(morgan)