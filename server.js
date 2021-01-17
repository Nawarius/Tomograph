require('dotenv').config()
const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const bodyParser = require("body-parser");
const port = process.env.PORT || 4000
const app = express()

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.static(__dirname))


app.post('/setData', (req,res)=>{
  const convertedMoves = MovesConverter(req.body.moves)
  fs.writeFileSync('Moves.txt', JSON.stringify(convertedMoves))
  fs.appendFileSync('Moves.txt', JSON.stringify(req.body.times))

  const movesAndTimes = fs.readFileSync('Moves.txt', 'utf-8')

  res.send({ movesAndTimes })
})

app.get('/getData', (req, res)=>{
  const position = fs.readFileSync('trial_position_sequence.txt', 'utf-8')
  const delay = fs.readFileSync('trial_delay_sequence.txt', 'utf-8')
  const tricks = fs.readFileSync('trial_tricks_sequence.txt', 'utf-8')
  
  const newPos = position.split(',')
  const newDel = delay.split(',')
  const newTricks = tricks.split(',')

  cleaner(newDel)
  toNumber(newDel)
  cleaner(newPos)
  toNumber(newPos)
  cleaner(newTricks)
  toNumber(newTricks)
  
  res.send({
    trial_position:JSON.stringify(newPos),
    trial_delay:JSON.stringify(newDel),
    trial_tricks:JSON.stringify(newTricks)
  })
})

if(process.env.PROD){
  app.use(express.static(path.join(__dirname, './client/build')))
  app.get('*', (req,res)=>{
      res.sendFile(path.join(__dirname, './client/build/index.html'))
  })
}
app.listen(port, ()=>{
  console.log(`Server running on the port: ${port}`)
})

function MovesConverter(arr){
  const newArr = []
  arr.forEach(item=>{
    if(item === 2) newArr.push('Left')
    else if(item === -2) newArr.push('Right')
    else newArr.push('Nothing')
  })
  return newArr
}
function cleaner(arr){
  arr[0] = arr[0].replace('[', '')
  arr[arr.length-1] = arr[arr.length-1].replace(']', '')
}
function toNumber(arr){
  for(let i = 0; i < arr.length; i++){
    arr[i] = +arr[i]
  }
}

