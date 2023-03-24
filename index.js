const { request, response } = require('express')
const express = require('express')
const app = express()

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
    },
    {
        name: "Marrrrrry Poppendieck",
        number: "39-23-642312332",
        id: 6
      }
  ]
 

app.use(express.json())

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

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    console.log(request.headers)
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




const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)