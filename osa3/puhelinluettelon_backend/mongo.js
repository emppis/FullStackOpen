const mongoose = require('mongoose')

const args = process.argv

if (args.length < 3) {
    console.log('Anna salasana parametrina: node mongo.js <password> [name] [number]')
  process.exit(1)
}

const password = args[2]

const url = `mongodb+srv://emppis1:${password}@cluster0.ya7pr4e.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (args.length === 5) {
  const person = new Person({
    name: args[3],
    number: args[4],
  })

  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })

  } else {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(p => {
      console.log(`${p.name} ${p.number}`)
    })
    mongoose.connection.close()
  })
}