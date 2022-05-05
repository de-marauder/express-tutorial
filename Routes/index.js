const express = require('express')

const router = express.Router()

router.get('/', (req, res)=>{
    console.log("root route hit")
    res.render('index')
})

module.exports = router