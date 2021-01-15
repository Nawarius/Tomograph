const setDataToServer = (moves, times)=>{
    fetch('http://localhost:4000/setData', {
        method:'POST',
        body:JSON.stringify({
            "moves": moves,
            "times": times
        }),
        headers:{
            'Content-Type':'application/json'
        }
    })
}

export default setDataToServer
