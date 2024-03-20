require('dotenv').config();
const express = require('express');
const app = express();
const { Client } = require('pg')

const client = new Client({
	user: process.env.PGUSER,
	host: process.env.PGHOST,
	database: process.env.PGDATABASE,
	password: process.env.PGPASSWORD,
	port: process.env.PORT,
	ssl: {
		rejectUnauthorized: false,
	}
})

client.connect()
	.then(() => console.log('Connected to the database'))
	.catch(err => console.error('Error connecting to the database', err))
module.exports = client 

app.use(express.json());
express.urlencoded({ extended: true })

const router = express.Router();
// INDEX
router.get('/', async (req, res) => {
    try {
        const result = await client.query('SELECT name, total FROM grand_totals');
        console.log(result); 
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// GET
router.get('/:name', async (req, res) => {
    try {
        console.log(req.params.name)
        const result = await client.query('SELECT * FROM ' + req.params.name);
        console.log(result.rows); 
        res.status(200).json(result.rows)

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

app.use('/api/corporations', router)