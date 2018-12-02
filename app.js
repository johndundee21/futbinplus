const express = require('express')
const app = express()
const cors = require('cors')
const unirest = require('unirest')

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/api/players/:id', (req, res) => {
    // Avant-Hier
    let d1 = new Promise(function(resolve, reject) { 
        let result = []
        unirest.get('https://www.futbin.com/19/playerGraph?type=da_yesterday&year=19&player='+req.params.id)
        .end(function(data) {
            new Promise(function(resolve, reject) {
                data.body.ps.forEach(e => {
                    result.push(e[1])
                })
            })
            .then(resolve(result))
        })
    })
    // Hier
    let d2 = new Promise(function(resolve, reject) { 
        let result = []
        unirest.get('https://www.futbin.com/19/playerGraph?type=yesterday&year=19&player='+req.params.id)
        .end(function(data) {
            new Promise(function(resolve, reject) {
                data.body.ps.forEach(e => {
                    result.push(e[1])
                })
            })
            .then(resolve(result))
        })
    })
    // Aujourd'hui
    let d3 = new Promise(function(resolve, reject) { 
        let result = []
        unirest.get('https://www.futbin.com/19/playerGraph?type=today&year=19&player='+req.params.id)
        .end(function(data) {
            new Promise(function(resolve, reject) {
                if (data.body.ps) {
                    data.body.ps.forEach(e => {
                        result.push(e[1])
                    })
                }
            })
            .then(resolve(result))
        })
    })
    
    let prices = []
    d1.then(function(price) {
        prices.push(...price)
        return d2
    })
    .then(function(price) {
        prices.push(...price)
        return d3
    })
    .then(function(price) {
        prices.push(...price)
        return new Promise(function(resolve, rejct) {
            resolve(prices)
        })
    })
    .then(function(result) {
        res.json(result.sort(function(a,b) {return a-b}))
    })
})

const port = process.env.PORT
app.listen(port, () => console.log('Server started on port '+port))