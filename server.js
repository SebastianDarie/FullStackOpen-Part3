const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(express.json())
app.use(cors())
app.use(
	morgan(
		':method :url :status :res[content-length] - :response-time ms :body'
	)
)
app.use(express.static('build'))

let persons = [
	{
		name: 'Arto Hellas',
		number: '040-123456',
		id: 1,
	},
	{
		name: 'Ada Lovelace',
		number: '39-44-5323523',
		id: 2,
	},
	{
		name: 'Dan Abramov',
		number: '12-43-234345',
		id: 3,
	},
	{
		name: 'Mary Poppendieck',
		number: '39-23-6423122',
		id: 4,
	},
]

app.get('/', (req, res) => {
	res.send('<h1>Phonebook app</h1>')
})

app.get('/info', (req, res) => {
	const date = new Date()
	res.send(`<p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
    `)
})

app.get('/api/persons', (req, res) => {
	res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
	const id = parseInt(req.params.id)
	const person = persons.find((el) => el.id === id)

	person ? res.json(person) : res.status(404).send('Person not found')
})

app.post('/api/persons', (req, res) => {
	const body = req.body

	if (!body.name || !body.number) {
		res.status(400).json({ error: 'content missing' })
	} else if (persons.find((el) => el.name === body.name)) {
		res.status(409).json({ error: 'person already exists' })
	} else {
		const person = {
			name: body.name,
			number: body.number,
			id: body.id,
		}

		persons = persons.concat(person)

		res.send(persons)
	}
})

app.delete('/api/persons/:id', (req, res) => {
	const id = parseInt(req.params.id)
	persons = persons.filter((el) => el.id !== id)

	res.status(204).end()
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
