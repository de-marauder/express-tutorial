const express = require('express');

const app = express()

const port = process.env.PORT || 5000

app.get('/', (reqq,res)=>{
    res.send("Hello")
})


app.listen(port, ()=>{
    console.log(`listening on port ${port}`)
})