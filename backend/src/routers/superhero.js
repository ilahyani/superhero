const router = require('express').Router({ mergeParams: true })
const { randomUUID } = require("crypto");

// In-memory array of superhero objects
let superheroes = []

router.post('/', async (req, res) => {
    const { name, superpower, humility_score } = req.body

    // Validate name
    if (!name || name === "") {
        return res.status(400).json({ error: 'Invalid or missing superhero name' })
    }

    // Validate superpower
    if (!superpower || superpower === "") {
        return res.status(400).json({ error: 'Invalid or missing superhero superpower' })
    }

    // Validate humility score
    const score = Number(humility_score)
    if (isNaN(score) || score < 0 || score > 10) {
        return res.status(400).json({ error: 'Invalid or missing superhero humility_score' })
    }

    // Create unique ID for each hero
    const id = randomUUID()
    
    // Generate a random avatar for the hero
    const avatar = `https://api.dicebear.com/6.x/adventurer/jpg?seed=${name + Math.random().toString().substring(2)}`;

    // Add superhero to array
    const hero = { id, name, superpower, avatar, humility_score: score }
    superheroes.push(hero)

    // send response back to client
    return res.status(200).json({ hero })
})

router.get('/', async (req, res) => {

    sortedHeroes = [...superheroes].sort((a, b) => b.humility_score - a.humility_score)
    res.status(200).json({ data: sortedHeroes })
})

module.exports = router