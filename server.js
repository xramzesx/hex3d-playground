const express = require('express')
const app = express()
const PORT = 3000

const Database = require('./src/database.js')
const levels = new Database('levels')

const fs = require('fs')
const path = require('path')

const bodyParser = require('body-parser')

app.use( bodyParser.urlencoded( { extended : true } ) )
app.use( express.static( 'static' ) )

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'))
})

app.get('/hex', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'pages' , 'hex.html'))
})
app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'pages' , 'game.html'))
})

app.get('/movement', (req , res) =>{
    res.sendFile(path.join(__dirname, 'static', 'pages' , 'movement.html'))
})

app.get('/ally', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'pages', 'ally.html'))
})

app.get('/allies', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'pages', 'allies.html'))
})

app.get('/allymodel', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'pages', 'allymodel.html'))
})

app.get('/particles', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'pages', 'particles.html'))
})

app.get('/fireplace', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'pages', 'fireplace.html'))
})

app.post('/saveLevel', (req, res) => {
    if (req.body.level != undefined){
        const level = {
            level : req.body.level || {},
            index : levelCounter,
            size : req.body.size || 1,
            name : req.body.name || `level_${Date.now()}`,
            date : Date.now(),
        }
        levels.insert(level, (err, newDoc) => {
            console.log(level)
            fetch( output => {
                const response = {
                    status : "SUCCESS",
                    data : output
                }

                res.send(response)
            })
            
            // levels.count((error, count) => {
            //     levelCounter = count
            //     res.send('udało siesie')
            // })
        })
    }else{
        res.send({
            status : "ERROR",
            message :'Please do not send null map'
        })
    }
})

let levelCounter = 0
levels.count((err,number) => {levelCounter = number < 0 ? 0 : number})
// console.log(levels.count())

app.post('/fetch', (req, res) => {
    fetch( data => res.send( data ))
})

app.post('/countLevels', (req, res) =>{
    res.send(`${levelCounter - 1}`)
})

let selectedLevel = undefined

app.post('/select', (req, res) => {
    selectedLevel = req.body.level
    try{
        if (selectedLevel.level.lenght == 0)
            res.send( `NULL_MAP` )
        else
            res.send( `SUCCESS` )
    }catch{
        res.send( `NULL_MAP` )
    }
})

app.post('/loadLevel', (req, res) => {
    const { action } = req.body
    console.log(action)
    let index = 0;
    let id = ""
    switch (action){
        case "LAST_SAVE":
            index = levelCounter - 1
            break
        // case "INDEXED_SAVE":
        //     index = +req.body.index
        //     break
        case "ID_SAVE" : 
            id = req.body.index
            break

        case "SELECTED_SAVE":
            break
        default:
            res.send(`${levelCounter}`)
             
            break
    }
    if (action != "LAST_SAVE" && action != "SELECTED_SAVE")
        levels.get( { _id : id }, (err, doc) => {
            console.log(doc, index)
            if (!err && doc != null){
                const sendDoc = {
                    level : doc.level,
                    size : doc.size,
                }
                console.log(doc)
                res.send(JSON.stringify(sendDoc))
            } else {
                res.send({ err: err})
            }
        })
    else 
        if (selectedLevel == undefined && action == "SELECTED_SAVE" || action == "LAST_SAVE")
            levels.getAll({}, (err, doc) => {
                if (!err ){
                    doc = doc.sort( (a, b) => b.date - a.date )
                    console.log("000001",doc[0])

                    const sendDoc = {
                        level : doc[0].level,
                        size : doc[0].size,
                    }
                    console.log(doc)
                    res.send(JSON.stringify(sendDoc))
                } else {
                    res.send(err)
                }
            })
        else 
            res.send(selectedLevel)

})

//// USEFULL FUNCTIONS ////

function fetch ( callback ) {
    levels.getAll({}, (err, doc) => {
        console.log(doc)
        const output = []
        for (let i in doc){
            output.push({
                name : doc[i].name,
                index : doc[i].index,
                date : doc[i].date,
                id : doc[i]._id
            })
        }
        callback(output)
    })
}
//// LISTENER ////

app.listen(PORT, () => {
    console.log(`start serwera na porcie ${PORT}`)
})