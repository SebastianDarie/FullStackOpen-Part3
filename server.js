const dotenv = require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(
	morgan(
		':method :url :status :res[content-length] - :response-time ms :body'
	)
)

app.get('/info', async (req, res) => {
	const length = await Person.collection.count()
	const date = new Date()

	res.send(`<p>Phonebook has info for ${length} people</p>
        <p>${date}</p>
    `)
})

app.get('/api/persons', async (req, res) => {
	const persons = await Person.find({})

	res.json(persons)
})

app.get('/api/persons/:id', async (req, res, next) => {
	try {
		const person = await Person.findById(req.params.id)

		person ? res.json(person) : res.status(404).send('Person not found')
	} catch (error) {
		next(error)
	}
})

app.post('/api/persons', async (req, res, next) => {
	try {
		const body = req.body
		console.log(body)

		if (!body.name || !body.number) {
			return res.status(400).json({ error: 'content missing' })
		}

		const person = new Person({
			name: body.name,
			number: body.number,
		})

		const savedPerson = await person.save()

		res.json(savedPerson)
	} catch (error) {
		next(error)
	}
})

app.put('/api/persons/:id', async (req, res, next) => {
	try {
		const body = req.body

		const person = {
			name: body.name,
			number: body.number,
		}

		const updatedPerson = await Person.findByIdAndUpdate(
			req.params.id,
			person,
			{ new: true }
		)

		res.json(updatedPerson)
	} catch (error) {
		next(error)
	}
})

app.delete('/api/persons/:id', async (req, res, next) => {
	try {
		await Person.findByIdAndDelete(req.params.id)

		res.status(204).end()
	} catch (error) {
		next(error)
	}
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformed id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}

	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
