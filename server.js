const express = require('express')
const app = express()

app.use(express.json())

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
			id: Math.floor(Math.random() * 1000),
		}

		persons = persons.concat(person)

		res.json(person)
	}
})

app.delete('/api/persons/:id', (req, res) => {
	const id = parseInt(req.params.id)
	persons = persons.filter((el) => el.id !== id)

	res.status(204).end()
})

app.get('/info', (req, res) => {
	const date = new Date()
	res.send(`<p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
    `)
})

const PORT = 3001

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
