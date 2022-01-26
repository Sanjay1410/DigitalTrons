var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
const { request, response } = require('express')
const path = require('path')
var app = express()

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../Client/dist')));


var dbURI = 'mongodb+srv://sanjay:sanjay@cluster0.96sxn.mongodb.net/myFirstDatabase'

var Slot = mongoose.model('slot', {
    slot: String,
    firstName: String,
    lastName: String,
    phoneNumber: Number,
    booked: Number
})
mongoose.connect(dbURI, (err) => {
    console.log("Database Connected", err)
})

var server = app.listen(3000, () => {
    console.log("Server is started on port :: ", server.address().port)
})


app.get('/api/getSlot', (request, response) => {
    console.log(request.url)
    Slot.find({}, (err, res) => {
        console.log("SLOT DATA :: ", res)
        if (err) {
            console.log("ERROR :: ", err)
            return response.status(500).json({
                status: 'error',
                error: 'Internal Server Error'
            })
        } else {
            response.status(200).json({
                status: 'success',
                data: res
            })
        }
    })
})

app.post('/api/slot', (request, response) => {
    console.log(request.body)

    const SlotM = new Slot(request.body);
    SlotM.save().then((res) => {
        return response.status(200).json({
            status: 'success',
            message: 'Data Saved'
        })
    }).catch((error) => {
        console.log(error)
    })
})

app.put('/api/slot', (request, response) => {
    Slot.updateOne({ 'slot': { $eq: request.body['slot'] } }, request.body).then((res)=>{
        return response.status(200).json({
            status: 'success',
            message: 'Slot Updated'
        })
    }).catch((error)=>{
        console.log(error)
    })
})

app.put('/api/deleteSlot', (request, response) => {
    console.log(request.body)
    Slot.deleteOne({ '_id': { $eq: request.body['slotId'] } }).then((res) => {
        return response.status(200).json({
            status: 'success',
            message: 'Slot Deleted'
        })
    }).catch((error) => {
        console.log(error)
    })
})