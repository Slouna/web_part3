const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}
const password = process.argv[2]

const url = `mongodb+srv://santerilouna:${password}@cluster0.yo610up.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)



if(process.argv[3]===null || process.argv[3] === undefined){
    console.log("phonebook:")
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name + " " +  person.number)
        })
        mongoose.connection.close()
    })
} else{
    console.log(`${process.argv[3]}`)
    const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
    })
    person.save().then(result => {
        console.log(`added: ${person.name}, number: ${person.number} to the phonebook`)
        mongoose.connection.close()
    })
}
