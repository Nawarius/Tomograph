import download from 'downloadjs'
import * as Papa from 'papaparse'

const setMovesAndTimesToFile = (movesAndTimes)=>{
    const convertedMovesAndTimes = MovesConverter(movesAndTimes)
    
  console.log(convertedMovesAndTimes)
    const csv = Papa.unparse(convertedMovesAndTimes, {
      quotes: false, 
      delimiter: ",",
      header: true,
      newline: "\r\n",                        
      columns: [ "position", "reaction"]
    }) 
    download(csv, 'MovesAndTimes.csv', 'text/plain')
}
function MovesConverter(arr){
    const newArr = []
    arr.forEach(item=>{
      if(item.position > 0) newArr.push({position: 'Left', reaction: item.reaction})
      else if(item.position < 0) newArr.push({position: 'Right', reaction: item.reaction})
      else newArr.push({position: 'Nothing', reaction: item.reaction})
    })
    return newArr
  }

export default setMovesAndTimesToFile
//In case server must be needed
// fetch('/setData', {
    //     method:'POST',
    //     body:JSON.stringify({
    //         "moves": moves,
    //         "times": times
    //     }),
    //     headers:{
    //         'Content-Type':'application/json'
    //     }
    // }).then(res=>{
    //     if(res.status !== 200) throw new Error('Error')
    //     return res.json()
    // }).then(resData=>{
    //     download(resData.movesAndTimes, 'MovesAndTimes.txt', 'text/plain')
    // })

    // fetch('/download',{
    //     method:'GET',
    //     headers:{
    //         'Content-Type':'application/json'
    //     }
    // }).then(res=>{
    //     if(res.status !== 200) throw new Error('Error')
    //     return res.json()
    // }).then(resData=>{
    //     
    //     download(resData, 'Moves.txt', 'text/plain')
    //     //console.log(JSON.parse(resData))
    // })
