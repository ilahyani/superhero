const request = require('supertest')
const express = require('express')
let router = require('../src/routers/superhero')

// Express app for testing
const app = express()
app.use(express.json())
app.use('/superhero', router)

describe('Superhero API', () => {

  describe('POST /superhero', () => {
    it('should return 400 for missing name', async () => {
      const heroData = {
        superpower: 'Flight',
        humility_score: 7
      }

      const response = await request(app)
        .post('/superhero')
        .send(heroData)
        .expect(400)

      expect(response.body.error).toBe('Invalid or missing superhero name')
    })

    it('should return 400 for empty name', async () => {
      const heroData = {
        name: '',
        superpower: 'Flight',
        humility_score: 7
      }

      const response = await request(app)
        .post('/superhero')
        .send(heroData)
        .expect(400)

      expect(response.body.error).toBe('Invalid or missing superhero name')
    })

    it('should return 400 for missing superpower', async () => {
      const heroData = {
        name: 'Superman',
        humility_score: 7
      }

      const response = await request(app)
        .post('/superhero')
        .send(heroData)
        .expect(400)

      expect(response.body.error).toBe('Invalid or missing superhero superpower')
    })

    it('should return 400 for empty superpower', async () => {
      const heroData = {
        name: 'Superman',
        superpower: '',
        humility_score: 7
      }

      const response = await request(app)
        .post('/superhero')
        .send(heroData)
        .expect(400)

      expect(response.body.error).toBe('Invalid or missing superhero superpower')
    })

    it('should return 400 for invalid humility score (string)', async () => {
      const heroData = {
        name: 'Superman',
        superpower: 'Flight',
        humility_score: 'invalid'
      }

      const response = await request(app)
        .post('/superhero')
        .send(heroData)
        .expect(400)

      expect(response.body.error).toBe('Invalid or missing superhero humility_score')
    })

    it('should return 400 for humility score out of range (> 10)', async () => {
      const heroData = {
        name: 'Superman',
        superpower: 'Flight',
        humility_score: 11
      }

      const response = await request(app)
        .post('/superhero')
        .send(heroData)
        .expect(400)

      expect(response.body.error).toBe('Invalid or missing superhero humility_score')
    })

    it('should return 400 for humility score out of range (< 0)', async () => {
      const heroData = {
        name: 'Superman',
        superpower: 'Flight',
        humility_score: -1
      }

      const response = await request(app)
        .post('/superhero')
        .send(heroData)
        .expect(400)

      expect(response.body.error).toBe('Invalid or missing superhero humility_score')
    })
  })

  describe('GET /superhero', () => {
    it('should return sorted heroes by humility score in descending order', async () => {
      const heroes = [
        { name: 'Superman', superpower: 'Flight', humility_score: 5 },
        { name: 'Batman', superpower: 'Rich', humility_score: 8 },
        { name: 'Spider-Man', superpower: 'Web-slinging', humility_score: 9 }
      ]

      for (const hero of heroes) {
        await request(app)
          .post('/superhero')
          .send(hero)
      }

      const response = await request(app)
        .get('/superhero')
        .expect(200)

      expect(response.body.data).toHaveLength(3)
      expect(response.body.data[0].humility_score).toBe(9)
      expect(response.body.data[1].humility_score).toBe(8)
      expect(response.body.data[2].humility_score).toBe(5)
    })
  })
})
