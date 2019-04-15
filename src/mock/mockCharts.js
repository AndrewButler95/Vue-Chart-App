const express = require('express');

let mockchart = require('./mockchart.json');
let mockall = require('./mockall.json');

const app = express()
const port = 5000

app.get('/all', (req, res) => res.send(mockall))

app.get('/:endpoint', (req, res) => res.send(mockchart))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


