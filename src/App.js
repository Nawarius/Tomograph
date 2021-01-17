import SceneContainer from './Components/SceneContainer'
import { useRef, useState } from 'react';
import { Grid, Button, Typography } from '@material-ui/core';



function App() {
  const [trial_position_sequence, setTrial_position_sequence] = useState(false)
  const [trial_tricks_sequence, setTrial_tricks_sequence] = useState(false)
  const [trial_delay_sequence, setTrial_delay_sequence] = useState(false)

  const [allowedPosition, setAllowedPosition] = useState(false)
  const [allowedDelay, setAllowedDelay] = useState(false)
  const [allowedTricks, setAllowedTricks] = useState(false)

  const [access, setAccess] = useState([])

  const positionRef = useRef()
  const delayRef = useRef()
  const tricksRef = useRef()

  const changeHandle = (e) => {
    switch(e.target.name){
      case 'positionFile':{
        const reader = new FileReader()
        reader.readAsText(positionRef.current.files[0])
        reader.onload = ()=>{
          const arr = reader.result.replace('[', '').replace(']', '').split(',')
          const newArr = arr.map(item=>{
            return +item
          })
          setTrial_position_sequence(newArr)
          setAccess(oldArray => [...oldArray, 1])
          setAllowedPosition(true)
        }
        break
      }
      case 'delayFile':{
        const reader = new FileReader()
        reader.readAsText(delayRef.current.files[0])
        reader.onload = ()=>{
          const arr = reader.result.replace('[', '').replace(']', '').split(',')
          const newArr = arr.map(item=>{
            return +item
          })
          setTrial_delay_sequence(newArr)
          setAccess(oldArray => [...oldArray, 1])
          setAllowedDelay(true)
        }
        break
      }
      case 'tricksFile':{
        const reader = new FileReader()
        reader.readAsText(tricksRef.current.files[0])
        reader.onload = ()=>{
          const arr = reader.result.replace('[', '').replace(']', '').split(',')
          const newArr = arr.map(item=>{
            return +item
          })
          setTrial_tricks_sequence(newArr)
          setAccess(oldArray => [...oldArray, 1])
          setAllowedTricks(true)
        }
        break
      }
      default:
        break
    }
  }

  return <>
  {access.length!==3 &&
  <Grid container direction = 'column' justify = 'center' alignItems = 'center' style = {{height:'100%'}} spacing = {3}>
        <Grid item>
            <Button component = 'label' variant = 'contained' style = {{color:allowedPosition?'blue':'red'}}>
                <input type = "file" ref = {positionRef} name = 'positionFile' hidden onChange = {changeHandle} />
                <Typography>Load Position Array</Typography>
            </Button>
        </Grid>
        <Grid item>
            <Button component = 'label' variant = 'contained' style = {{color:allowedDelay?'blue':'red'}}>
                <input type="file" ref = {delayRef} name = 'delayFile' hidden onChange = {changeHandle} />
                <Typography>Load Delay Array</Typography>
            </Button>
        </Grid>
        <Grid item>
            <Button component = 'label' variant = 'contained' style = {{color:allowedTricks?'blue':'red'}}>
                <input type="file" ref = {tricksRef} name = 'tricksFile' hidden onChange = {changeHandle} />
                <Typography>Load Tricks Array</Typography>
            </Button>
        </Grid>
  </Grid>
  }
  {access.length == 3 && 
  <SceneContainer trial_position_sequence = {trial_position_sequence}
    trial_tricks_sequence = {trial_tricks_sequence} trial_delay_sequence = {trial_delay_sequence}
    />
    }
    
  </>
}

export default App
