const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

const connectToDB = (async () => {
	try {
		await mongoose.connect(url, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
		})

		console.log('connected to mongoDB')
	} catch (error) {
		console.error('error connecting to mongoDB', error.message)
	}
})()

const personSchema = new mongoose.Schema({
	name: { type: String, unique: true, minlength: 3 },
	number: { type: String, minlength: 8 },
})

personSchema.plugin(uniqueValidator, { type: 'mongoose-unique-validator' })

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	},
})

module.exports = mongoose.model('Person', personSchema)
