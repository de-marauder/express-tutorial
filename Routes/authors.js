const express = require('express')

const router = express.Router()

router.get('/', (req, res)=>{
    console.log("authout route hit")
    res.render('Authors/authors')
})
router.get('/new', (req, res)=>{
    console.log("authout route hit")
    res.render('Authors/new')
})
router.post('/', (req, res)=>{
    console.log("author route hit")
    res.send('Create')
})

module.exports = router