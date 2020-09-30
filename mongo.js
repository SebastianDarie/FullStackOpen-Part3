const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('enter password and/or object as arguments')
	process.exit()
}

const password = process.argv[2]

const url = `mongodb+srv://dbUser:${password}@cluster0.vm6xt.mongodb.net/phonebook?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model('Person', personSchema)

const getPersons = async () => {
	try {
		const persons = await Person.find({})

		console.log('phonebok:')
		persons.forEach((person) => console.log(person.name, person.number))

		mongoose.connection.close()
	} catch (error) {
		console.error(error)
	}
}

const savePerson = async () => {
	try {
		const name = process.argv[3]
		const number = process.argv[4]

		const person = new Person({
			name,
			number,
		})

		await person.save()

		console.log(`added ${person.name} number ${person.number} to phonebook`)

		mongoose.connection.close()
	} catch (error) {
		console.error(error)
	}
}

if (process.argv.length === 3) {
	getPersons()
}

if (process.argv.length === 5) {
	savePerson()
}

//wYUkXk9I3gtQgtTC
//node mongo.js wYUkXk9I3gtQgtTC
