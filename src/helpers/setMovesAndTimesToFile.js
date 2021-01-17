import download from 'downloadjs'

const setMovesAndTimesToFile = (moves, times)=>{
    const convertedMoves = MovesConverter(moves)
    const movesAndTimes = convertedMoves.concat(times)
    download(movesAndTimes, 'MovesAndTimes.txt', 'text/plain')
}
function MovesConverter(arr){
    const newArr = []
    arr.forEach(item=>{
      if(item === 2) newArr.push('Left')
      else if(item === -2) newArr.push('Right')
      else newArr.push('Nothing')
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
