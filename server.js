if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const indexRoute = require('./Routes')
const authorRoute = require('./Routes/authors.js')

const app = express()

const mongoose = require('mongoose')
console.log('start connecting to database...')
mongoose.connect(process.env.DATABASE_URL)
console.log('connected to database...')

const db = mongoose.connection
db.on('error', error=>console.error(error))
db.once('open', ()=> console.log('Connected to Mongoose'))

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')

app.use(expressLayouts)
app.use(express.static('public'))

const port = process.env.PORT || 5000

app.use('/', indexRoute)
app.use('/authors', authorRoute)

app.get('/*', (req, res)=>{
    res.send("Not Found")
})

app.listen(port, ()=>{
    console.log(`listening on port ${port}`)
})