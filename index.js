const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://SeungHyunLee:Dltmdgus7372@boilerplate.puhoi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    //userNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFineAndModify: false
}).then(() => console.log('MongoDb Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})