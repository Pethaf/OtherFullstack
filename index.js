const http = require("http");
const express = require("express");
const morgan = require("morgan");

let people = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]
const getNewId = () => {
    const bigScalingFactor = 10000000000
    return Math.round(bigScalingFactor * Math.random());
}
const app = express();
app.use(express.json())
morgan.token('type', function (req, res) { return req.body? JSON.stringify(res.body): "" })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))
app.get("/api/persons", (request, response) => {
    response.json(people)
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = people.find(person => person.id == id)
    if (person) {
        response.json(person)
    }
    response.status(404).end()

})
app.get("/info", (request, response) => {
    const requestDate = new Date();
    response.send(
        `<p>Phonebook has info for ${people.length} people</p>
         <p>${new Date()}</p>
        `)
})
app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = people.find(person => person.id == id)
    console.log(person)
    if (person) {
        people = people.filter(person => person.id != id)
        return response.status(200).end()
    }
    return response.status(404).end()

})

app.post("/api/persons", (request, response) => {
    const requestPerson = request.body;
    const colidingPerson = people.find(person => person.name == requestPerson.name)
    if (!requestPerson.name || !requestPerson.number) {
        response.json({ error: 'Must provide name and number for new person' })
        response.status(400).end()
    }
    else if (colidingPerson) {
        response.json({ error: 'name must be unique' })
        response.status(400).end()
    }
    else {
        const newPerson = { id: getNewId(), ...requestPerson, }
        people = [...people, newPerson]
        response.json(newPerson);
        response.status(201).end()
    }
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`)
