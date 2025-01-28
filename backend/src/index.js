const express = require('express')
const cors = require('cors');

app = express()
app.use(express.json({
    origin: 'http://localhost:3000'
}))
app.use(cors());

app.use('/superhero', require('./routers/superhero'))

app.listen(4000, () => {
    console.log(`stream service running on port 4000`)
})
